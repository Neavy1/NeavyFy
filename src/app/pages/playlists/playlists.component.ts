import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Playlist } from '../../models/playlist.model';
import { CreatePlaylistDialogComponent } from './create-playlist-dialog.component';
import { PlaylistDetailComponent } from './playlist-detail.component';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    PlaylistDetailComponent
  ],
  template: `
    <div class="playlists-container">
      <div class="header">
        <h1>Mis Listas de Reproducción</h1>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          <span class="button-text">Nueva Lista</span>
        </button>
      </div>

      <div class="playlists-grid">
        <div class="playlist-card" *ngFor="let playlist of playlists" (click)="selectPlaylist(playlist)">
          <div class="playlist-image">
            <mat-icon class="playlist-icon">queue_music</mat-icon>
            <div class="play-overlay">
              <mat-icon class="play-icon">play_circle_filled</mat-icon>
            </div>
          </div>
          <div class="playlist-info">
            <h3>{{ playlist.name }}</h3>
            <p class="song-count">{{ playlist.songs.length }} canciones</p>
            <p class="created-date">Creada: {{ playlist.createdAt | date }}</p>
          </div>
        </div>
      </div>

      <app-playlist-detail
        *ngIf="selectedPlaylist"
        [playlist]="selectedPlaylist"
        (close)="closePlaylist()">
      </app-playlist-detail>
    </div>
  `,
  styles: [`
    .playlists-container {
      max-width: 1200px;
      margin: 1rem auto;
      padding: 0 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    h1 {
      font-size: clamp(1.5rem, 4vw, 2rem);
      margin: 0;
    }

    .button-text {
      @media (max-width: 400px) {
        display: none;
      }
    }

    .playlists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
      
      @media (min-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.5rem;
      }
      
      @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }

    .playlist-card {
      background: var(--spotify-dark-gray);
      border-radius: 8px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      @media (min-width: 480px) {
        padding: 1rem;
      }
    }

    .playlist-card:hover {
      background: #333;
      transform: translateY(-4px);
    }

    .playlist-card:hover .play-overlay {
      opacity: 1;
    }

    .playlist-image {
      background: #282828;
      aspect-ratio: 1;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      position: relative;
      overflow: hidden;
    }

    .playlist-icon {
      font-size: clamp(32px, 8vw, 48px);
      width: auto;
      height: auto;
      color: var(--spotify-light-gray);
    }

    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .play-icon {
      font-size: clamp(32px, 8vw, 48px);
      width: auto;
      height: auto;
      color: var(--spotify-green);
    }

    .playlist-info h3 {
      margin: 0;
      font-size: clamp(0.875rem, 2.5vw, 1rem);
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .song-count {
      margin: 0;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      color: var(--spotify-light-gray);
      margin-bottom: 0.25rem;
    }

    .created-date {
      margin: 0;
      font-size: clamp(0.7rem, 1.8vw, 0.75rem);
      color: var(--spotify-light-gray);
      opacity: 0.8;
    }
  `]
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  selectedPlaylist: Playlist | null = null;

  constructor(
    private playlistService: PlaylistService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    await this.loadPlaylists();
  }

  async loadPlaylists() {
    const user = await firstValueFrom(this.authService.currentUser$);
    if (user) {
      this.playlistService.getPlaylists(user.id).subscribe(playlists => {
        this.playlists = playlists;
      });
    }
  }

  async openCreateDialog() {
    const dialogRef = this.dialog.open(CreatePlaylistDialogComponent, {
      width: '90%',
      maxWidth: '400px'
    });
    const name = await dialogRef.afterClosed().toPromise();
    if (name) {
      const user = await firstValueFrom(this.authService.currentUser$);
      if (user) {
        this.playlistService.createPlaylist(name, user.id)
          .subscribe(() => {
            this.loadPlaylists();
            this.toast.success('Lista de reproducción creada correctamente');
          });
      }
    }
  }

  selectPlaylist(playlist: Playlist) {
    this.selectedPlaylist = playlist;
  }

  closePlaylist() {
    this.selectedPlaylist = null;
  }
}