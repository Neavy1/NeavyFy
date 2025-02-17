import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { Playlist, Song } from '../../models/playlist.model';
import { PlaylistService } from '../../services/playlist.service';
import { ToastService } from '../../services/toast.service';
import { PlayerService } from '../../services/player.service';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    ProgressBarComponent
  ],
  template: `
    <div class="playlist-detail" [class.mobile-view]="isMobile">
      <div class="header">
        <h2>{{ playlist.name }}</h2>
        <button mat-icon-button (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="content-wrapper">
        <!-- Formulario de agregar canciones -->
        <div class="add-song-section">
          <div class="section-header">
            <mat-icon>add_circle</mat-icon>
            <h3>Agregar Nueva Canción</h3>
          </div>
          <form [formGroup]="songForm" (ngSubmit)="addSong()">
            <mat-form-field appearance="outline">
              <mat-label>Título</mat-label>
              <input matInput formControlName="title" placeholder="Nombre de la canción">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Artista</mat-label>
              <input matInput formControlName="artist" placeholder="Nombre del artista">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Duración</mat-label>
              <input matInput formControlName="duration" placeholder="3:45">
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="resetForm()">
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!songForm.valid">
                Agregar Canción
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de canciones -->
        <div class="songs-section">
          <div class="section-header">
            <mat-icon>queue_music</mat-icon>
            <h3>Canciones en la Lista</h3>
          </div>
          
          <div class="songs-list">
            <div class="song-item" *ngFor="let song of playlist.songs; let i = index">
              <div class="song-content" [class.playing]="(playerService.currentSong$ | async)?.id === song.id">
                <div class="song-number">{{ i + 1 }}</div>
                <div class="song-info">
                  <div class="song-main-info">
                    <h4>{{ song.title }}</h4>
                    <p>{{ song.artist }}</p>
                  </div>
                  <span class="song-duration">{{ song.duration }}</span>
                </div>
                
                <div class="song-controls">
                  <button mat-icon-button (click)="togglePlay(song)" class="play-button">
                    <mat-icon>
                      {{ (playerService.isPlaying$ | async) && (playerService.currentSong$ | async)?.id === song.id 
                        ? 'pause_circle_filled' 
                        : 'play_circle_filled' 
                      }}
                    </mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="removeSong(song)" class="delete-button">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>

              <ng-container *ngIf="(playerService.currentSong$ | async)?.id === song.id">
                <app-progress-bar
                  [progress]="(playerService.progress$ | async) || 0"
                  [currentTime]="playerService.getCurrentTime()"
                  [duration]="playerService.getDuration()"
                  (seek)="playerService.seek($event)">
                </app-progress-bar>
              </ng-container>

              <mat-divider></mat-divider>
            </div>

            <div class="empty-state" *ngIf="playlist.songs.length === 0">
              <mat-icon>music_off</mat-icon>
              <p>No hay canciones en esta lista</p>
              <p class="subtitle">¡Agrega algunas canciones para empezar!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playlist-detail {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 400px;
      background: var(--spotify-black);
      box-shadow: -2px 0 4px rgba(0,0,0,0.2);
      padding: 1rem;
      overflow-y: auto;
      z-index: 1000;
      transition: all 0.3s ease;
      color: white;

      @media (max-width: 768px) {
        width: 100%;
        right: -100%;
      }
    }

    .mobile-view {
      @media (max-width: 768px) {
        right: 0;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      position: sticky;
      top: 0;
      background: var(--spotify-black);
      padding: 0.5rem 0;
      z-index: 1;
      border-bottom: 1px solid var(--spotify-dark-gray);
    }

    .header h2 {
      margin: 0;
      font-size: clamp(1.25rem, 3vw, 1.5rem);
      color: white;
      font-weight: 700;
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      color: var(--spotify-green);
    }

    .section-header h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: white;
    }

    .section-header mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .add-song-section, .songs-section {
      background: var(--spotify-dark-gray);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 0.5rem;

      @media (max-width: 480px) {
        flex-direction: column;
      }
    }

    .songs-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .song-item {
      padding: 0.75rem 0;
      transition: background-color 0.2s ease;
    }

    .song-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .song-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .song-content.playing {
      background-color: rgba(29, 185, 84, 0.1);
    }

    .song-number {
      min-width: 24px;
      text-align: center;
      font-size: 0.9rem;
      color: var(--spotify-light-gray);
    }

    .song-info {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      min-width: 0;
    }

    .song-main-info {
      min-width: 0;
    }

    .song-main-info h4 {
      margin: 0;
      font-size: 1rem;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-main-info p {
      margin: 0.25rem 0 0 0;
      font-size: 0.875rem;
      color: var(--spotify-light-gray);
    }

    .song-duration {
      font-size: 0.875rem;
      color: var(--spotify-light-gray);
      white-space: nowrap;
    }

    .song-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .play-button {
      color: var(--spotify-green);
    }

    .play-button mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .delete-button {
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .delete-button:hover {
      opacity: 1;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: var(--spotify-light-gray);
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
      opacity: 0.7;
    }

    .empty-state p {
      margin: 0;
      font-size: 1.1rem;
    }

    .empty-state .subtitle {
      font-size: 0.9rem;
      margin-top: 0.5rem;
      opacity: 0.8;
    }

    mat-form-field {
      width: 100%;
    }

    ::ng-deep {
      .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .mat-mdc-text-field-wrapper {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }

      .mat-mdc-form-field-flex {
        background-color: transparent !important;
      }

      .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
      .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
      .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
        border-color: rgba(255, 255, 255, 0.2) !important;
      }

      .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__leading,
      .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__notch,
      .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__trailing {
        border-color: rgba(255, 255, 255, 0.3) !important;
      }

      .mat-mdc-form-field-label {
        color: rgba(255, 255, 255, 0.6) !important;
      }

      .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
        color: white !important;
      }
    }

    mat-divider {
      border-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class PlaylistDetailComponent implements OnDestroy {
  @Input() playlist!: Playlist;
  @Output() close = new EventEmitter<void>();

  songForm: FormGroup;
  isMobile = window.innerWidth <= 768;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private toast: ToastService,
    public playerService: PlayerService
  ) {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      duration: ['', Validators.required]
    });

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addSong() {
    if (this.songForm.valid) {
      this.playlistService.addSong(this.playlist.id, this.songForm.value)
        .subscribe(updatedPlaylist => {
          this.playlist = updatedPlaylist;
          this.songForm.reset();
          this.toast.success('Canción agregada correctamente');
        });
    }
  }

  removeSong(song: Song) {
    const sub = this.playerService.currentSong$.subscribe(current => {
      if (current?.id === song.id) {
        this.playerService.pause();
      }
      this.playlistService.removeSong(this.playlist.id, song.id)
        .subscribe(updatedPlaylist => {
          this.playlist = updatedPlaylist;
          this.toast.success('Canción eliminada correctamente');
        });
    });
    this.subscriptions.push(sub);
  }

  async togglePlay(song: Song) {
    await this.playerService.play(song);
  }

  resetForm() {
    this.songForm.reset();
  }
}