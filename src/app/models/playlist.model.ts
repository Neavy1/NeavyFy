export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
  songs: Song[];
}