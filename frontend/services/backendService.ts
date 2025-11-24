import { Playlist, Song } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const backendService = {
  /**
   * Fetches all playlists for the user.
   */
  getPlaylists: async (token: string): Promise<Playlist[]> => {
    if (!token) throw new Error("Unauthorized");

    const response = await fetch(`${API_BASE_URL}/music/playlists/personalized`, {
      headers: {
        'Authorization': token
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlists: ${response.statusText}`);
    }

    const data = await response.json();
    // TODO: Map external API response structure to Playlist[] if different.
    // Assuming for now the external API returns { playlists: [...] } or [...]
    // If the external API structure is unknown, this might need debugging.
    // We return data assuming it matches or is close enough.
    return data.playlists || data; 
  },

  /**
   * Adds a list of songs to a specific playlist.
   */
  addSongsToPlaylist: async (token: string, playlistId: string, newSongs: Song[]): Promise<Playlist[]> => {
    if (!token) throw new Error("Unauthorized");

    // Convert Song objects to search strings (Title + Artist to be specific)
    const songNames = newSongs.map(s => {
        // Clean up title/artist if needed
        return `${s.title} ${s.artist}`.trim();
    });

    const response = await fetch(`${API_BASE_URL}/music/playlists/${playlistId}`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ songs: songNames })
    });

    if (!response.ok) {
      throw new Error(`Failed to add songs: ${response.statusText}`);
    }

    // The add endpoint returns status results, not the updated playlist.
    // So we fetch the playlists again to get the updated state.
    return backendService.getPlaylists(token);
  },

  /**
   * Creates a new playlist (Optional feature for future)
   */
  createPlaylist: async (token: string, name: string): Promise<Playlist[]> => {
    // Not implemented on backend yet.
    console.warn("createPlaylist not implemented on backend yet.");
    return backendService.getPlaylists(token);
  }
};
