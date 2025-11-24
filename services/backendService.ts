
import { Playlist, Song } from '../types';

const DB_KEY = 'spoti_hebrew_db_v1';
const NETWORK_DELAY_MS = 600; // Simulate network latency

// Initial seed data if database is empty
const INITIAL_DB: Playlist[] = [
  {
    id: 'liked-songs',
    name: 'שירים שאהבתי',
    type: 'liked',
    isPinned: true,
    songs: [
      { id: '1', title: 'חצי בן אדם', artist: 'Dudi Buzaglo', album: 'Single', duration: '3:20', coverUrl: 'https://picsum.photos/seed/dudi/64/64' },
      { id: '2', title: 'עוד יום', artist: 'Full Trunk', album: 'Molat', duration: '3:45', coverUrl: 'https://picsum.photos/seed/fulltrunk/64/64' },
    ]
  },
  {
    id: 'techno-vibes',
    name: 'Techno Vibes',
    type: 'playlist',
    coverUrl: 'https://picsum.photos/seed/techno/300/300',
    songs: []
  },
  {
    id: 'road-trip',
    name: 'Road Trip IL',
    type: 'playlist',
    coverUrl: 'https://picsum.photos/seed/road/300/300',
    songs: []
  },
  {
    id: 'workout',
    name: 'אימון כוח',
    type: 'playlist',
    coverUrl: 'https://picsum.photos/seed/gym/300/300',
    songs: []
  }
];

// Helper to simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get DB
const getDB = (): Playlist[] => {
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB));
    return INITIAL_DB;
  }
  return JSON.parse(stored);
};

// Helper to save DB
const saveDB = (data: Playlist[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const backendService = {
  /**
   * Fetches all playlists for the user.
   */
  getPlaylists: async (token: string): Promise<Playlist[]> => {
    await delay(NETWORK_DELAY_MS);
    // In a real app, we would validate the token here
    if (!token) throw new Error("Unauthorized");
    return getDB();
  },

  /**
   * Adds a list of songs to a specific playlist.
   */
  addSongsToPlaylist: async (token: string, playlistId: string, newSongs: Song[]): Promise<Playlist[]> => {
    await delay(NETWORK_DELAY_MS);
    if (!token) throw new Error("Unauthorized");

    const db = getDB();
    const playlistIndex = db.findIndex(p => p.id === playlistId);

    if (playlistIndex === -1) {
      throw new Error("Playlist not found");
    }

    // Add new songs to the beginning of the list
    db[playlistIndex].songs = [...newSongs, ...db[playlistIndex].songs];
    
    // Update cover art if it's a regular playlist and currently empty/default
    if (db[playlistIndex].type === 'playlist' && newSongs.length > 0 && newSongs[0].coverUrl) {
       // Optional: logic to update playlist cover based on first song
    }

    saveDB(db);
    return db;
  },

  /**
   * Creates a new playlist (Optional feature for future)
   */
  createPlaylist: async (token: string, name: string): Promise<Playlist[]> => {
    await delay(NETWORK_DELAY_MS);
    const db = getDB();
    const newPlaylist: Playlist = {
        id: `pl-${Date.now()}`,
        name,
        type: 'playlist',
        songs: [],
        coverUrl: `https://picsum.photos/seed/${Date.now()}/300/300`
    };
    db.push(newPlaylist);
    saveDB(db);
    return db;
  }
};
