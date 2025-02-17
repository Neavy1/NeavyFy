import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/playlist.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: HTMLAudioElement;
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  private progressSubject = new BehaviorSubject<number>(0);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  currentSong$ = this.currentSongSubject.asObservable();
  progress$ = this.progressSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private toast: ToastService) {
    this.audio = new Audio();
    this.audio.volume = 1.0;
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (!isNaN(this.audio.duration) && isFinite(this.audio.duration)) {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        if (isFinite(progress)) {
          this.progressSubject.next(progress);
        }
      }
    });

    this.audio.addEventListener('ended', () => {
      this.isPlayingSubject.next(false);
      this.progressSubject.next(0);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });

    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
    });

    this.audio.addEventListener('loadstart', () => {
      this.isLoadingSubject.next(true);
    });

    this.audio.addEventListener('canplay', () => {
      this.isLoadingSubject.next(false);
    });

    this.audio.addEventListener('error', (e) => {
      const error = this.audio.error;
      let errorMessage = 'Error al reproducir el audio';
      
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'La reproducción fue abortada';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Error de red al cargar el audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Error al decodificar el audio';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Formato de audio no soportado';
            break;
        }
      }
      
      this.toast.error(errorMessage);
      this.isPlayingSubject.next(false);
      this.isLoadingSubject.next(false);
      this.currentSongSubject.next(null);
    });
  }

  async play(song: Song) {
    if (!song.audioUrl) {
      this.toast.error('URL de audio no válida');
      return;
    }

    const currentSong = this.currentSongSubject.getValue();
    
    if (currentSong?.id === song.id) {
      if (this.audio.paused) {
        try {
          await this.audio.play();
        } catch (error) {
          this.handlePlayError(error);
        }
      } else {
        this.pause();
      }
      return;
    }

    try {
      this.pause();
      this.audio.currentTime = 0;
      
      this.isLoadingSubject.next(true);
      this.currentSongSubject.next(song);
      this.audio.src = song.audioUrl;
      this.audio.load();
      
      await this.audio.play();
    } catch (error) {
      this.handlePlayError(error);
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  private handlePlayError(error: any) {
    console.error('Error al reproducir:', error);
    
    let errorMessage = 'Error al reproducir la canción';
    if (error instanceof DOMException) {
      if (error.name === 'NotSupportedError') {
        errorMessage = 'El formato de audio no es compatible con tu navegador';
      } else if (error.name === 'NotAllowedError') {
        errorMessage = 'Haz clic en el botón de reproducción para comenzar';
      } else if (error.name === 'AbortError') {
        errorMessage = 'La reproducción fue interrumpida';
      }
    }
    
    this.toast.error(errorMessage);
    this.isLoadingSubject.next(false);
  }

  togglePlay() {
    const currentSong = this.currentSongSubject.getValue();
    if (!currentSong) return;

    if (this.audio.paused) {
      this.play(currentSong);
    } else {
      this.pause();
    }
  }

  pause() {
    this.audio.pause();
    this.isPlayingSubject.next(false);
  }

  seek(percentage: number) {
    if (!isNaN(this.audio.duration) && isFinite(this.audio.duration) && isFinite(percentage)) {
      const time = (percentage / 100) * this.audio.duration;
      if (isFinite(time)) {
        this.audio.currentTime = time;
      }
    }
  }

  getCurrentTime(): string {
    return this.formatTime(this.audio.currentTime);
  }

  getDuration(): string {
    return this.formatTime(this.audio.duration);
  }

  private formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}