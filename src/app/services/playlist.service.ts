import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Playlist, Song } from '../models/playlist.model';
import { LoggerService } from './logger.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playlists: Playlist[] = [];
  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  playlists$ = this.playlistsSubject.asObservable();

  // URLs de audio WAV públicas y confiables
  private demoSongs = [
    'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav',
    'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch.wav',
    'https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav',
    'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
    'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav'
  ];

  private songTitles = [
    'Star Wars Theme',
    'Imperial March',
    'Gettysburg Address',
    'Baby Elephant Walk',
    'Cantina Band'
  ];

  private artists = [
    'John Williams',
    'John Williams',
    'Classic Speech',
    'Henry Mancini',
    'John Williams'
  ];

  constructor(
    private logger: LoggerService,
    private toast: ToastService
  ) {}

  createPlaylist(name: string, userId: string): Observable<Playlist> {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      userId,
      songs: []
    };
    
    this.playlists.push(newPlaylist);
    this.playlistsSubject.next(this.playlists);
    this.logger.log('Playlist creada:', newPlaylist);
    return of(newPlaylist);
  }

  getPlaylists(userId: string): Observable<Playlist[]> {
    return of(this.playlists.filter(p => p.userId === userId));
  }

  addSong(playlistId: string, song: Song): Observable<Playlist> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (playlist) {
      const randomIndex = Math.floor(Math.random() * this.demoSongs.length);
      const newSong = {
        ...song,
        id: Date.now().toString(),
        title: this.songTitles[randomIndex],
        artist: this.artists[randomIndex],
        audioUrl: this.demoSongs[randomIndex]
      };
      playlist.songs.push(newSong);
      this.playlistsSubject.next(this.playlists);
      this.logger.log('Canción agregada a la playlist:', newSong);
    }
    return of(playlist!);
  }

  removeSong(playlistId: string, songId: string): Observable<Playlist> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (playlist) {
      playlist.songs = playlist.songs.filter(s => s.id !== songId);
      this.playlistsSubject.next(this.playlists);
      this.logger.log('Canción eliminada de la playlist:', songId);
    }
    return of(playlist!);
  }
}