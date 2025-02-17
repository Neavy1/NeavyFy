import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatButtonModule, 
    RouterLink, 
    RouterLinkActive,
    ProgressBarComponent,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <span class="brand">NeavyFy</span>
          <div class="nav-links">
            <a mat-button routerLink="/" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}">
              Home
            </a>
            <a mat-button routerLink="/about" 
               routerLinkActive="active">
              About
            </a>
            <a mat-button routerLink="/contact" 
               routerLinkActive="active">
              Contact
            </a>
            <ng-container *ngIf="authService.currentUser$ | async">
              <a mat-button routerLink="/playlists" 
                 routerLinkActive="active">
                Mis Listas
              </a>
            </ng-container>
          </div>
        </div>
        
        <div class="nav-right">
          <ng-container *ngIf="authService.currentUser$ | async; else loginButton">
            <button mat-button (click)="logout()">Cerrar Sesión</button>
          </ng-container>
          <ng-template #loginButton>
            <button mat-button routerLink="/login" 
                    routerLinkActive="active">
              Iniciar Sesión
            </button>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>

    <!-- Global Player -->
    <div class="global-player" *ngIf="playerService.currentSong$ | async as currentSong">
      <div class="player-content">
        <div class="song-info">
          <h4>{{ currentSong.title }}</h4>
          <p>{{ currentSong.artist }}</p>
        </div>
        
        <div class="player-controls">
          <button mat-icon-button (click)="playerService.togglePlay()">
            <mat-icon>
              {{ (playerService.isPlaying$ | async) ? 'pause' : 'play_arrow' }}
            </mat-icon>
          </button>
        </div>
        
        <div class="progress-container">
          <app-progress-bar
            [progress]="(playerService.progress$ | async) || 0"
            [currentTime]="playerService.getCurrentTime()"
            [duration]="playerService.getDuration()"
            (seek)="playerService.seek($event)">
          </app-progress-bar>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 0;
      height: 64px;
      background-color: rgba(25, 20, 20, 0.98) !important;
      backdrop-filter: blur(10px);
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--spotify-green);
      text-shadow: 0 0 10px rgba(29, 185, 84, 0.3);
    }

    .nav-links {
      display: flex;
      gap: 0.5rem;
    }

    .nav-right {
      display: flex;
      align-items: center;
    }

    a.mat-mdc-button {
      position: relative;
      color: var(--spotify-light-gray);
      transition: all 0.3s ease;
      height: 64px;
      border-radius: 0;
    }

    a.mat-mdc-button:hover {
      color: white;
      background-color: var(--spotify-dark-gray);
    }

    a.mat-mdc-button.active {
      color: var(--spotify-green);
      background-color: var(--spotify-dark-gray);
    }

    a.mat-mdc-button.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--spotify-green);
      box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
    }

    .global-player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--spotify-black);
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.5);
    }

    .player-content {
      display: grid;
      grid-template-columns: 200px auto 200px;
      gap: 1rem;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .song-info {
      h4 {
        margin: 0;
        font-size: 0.9rem;
        color: white;
        font-weight: 500;
      }

      p {
        margin: 4px 0 0;
        font-size: 0.8rem;
        color: var(--spotify-light-gray);
      }
    }

    .player-controls {
      display: flex;
      justify-content: center;
      align-items: center;

      .mat-icon-button {
        color: white;
        transform: scale(1.2);
        transition: all 0.3s ease;

        &:hover {
          color: var(--spotify-green);
          transform: scale(1.3);
        }
      }
    }

    .progress-container {
      width: 100%;
      padding: 0 1rem;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .player-content {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
      }

      .progress-container {
        grid-column: 1 / -1;
        order: -1;
        padding: 0;
      }
    }

    // Ajuste para el contenido principal
    :host {
      display: block;
      padding-bottom: 90px; // Espacio para el reproductor
    }
  `]
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    public playerService: PlayerService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}