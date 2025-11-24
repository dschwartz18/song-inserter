export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  coverUrl?: string; // Optional placeholder
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  coverUrl?: string;
  isPinned?: boolean;
  type: 'playlist' | 'artist' | 'album' | 'liked';
}

export interface User {
  username: string;
  token?: string;
}

export enum InsertionMode {
  ARTIST = 'ARTIST',
  LIST = 'LIST',
}

export interface GeneratedSongResponse {
  title: string;
  artist: string;
  album: string;
  duration: string;
}