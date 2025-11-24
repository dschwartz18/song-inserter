
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LoginPage from './components/LoginPage';
import { Song, InsertionMode, Playlist, User } from './types';
import { backendService } from './services/backendService';

import ComingSoonPage from './components/ComingSoonPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [mode, setMode] = useState<InsertionMode>(InsertionMode.LIST);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Load playlists when user logs in
  useEffect(() => {
    if (user && user.token) {
      const loadData = async () => {
        setIsDataLoading(true);
        try {
          const data = await backendService.getPlaylists(user.token!);
          setPlaylists(data);
          // Select first playlist by default if none selected
          if (!selectedPlaylistId && data.length > 0) {
            setSelectedPlaylistId(data[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch playlists", error);
        } finally {
          setIsDataLoading(false);
        }
      };
      loadData();
    }
  }, [user]);

  const handleLogin = (username: string, token: string) => {
    setUser({ username, token });
  };

  const handleLogout = () => {
    setUser(null);
    setPlaylists([]);
    setSelectedPlaylistId(null);
  };

  const handleAddSongs = async (newSongs: Song[]) => {
    if (!selectedPlaylistId || !user || !user.token) return;

    try {
      // Call backend to update
      const updatedPlaylists = await backendService.addSongsToPlaylist(user.token, selectedPlaylistId, newSongs);
      setPlaylists(updatedPlaylists);
    } catch (error) {
      console.error("Failed to add songs", error);
      alert("שגיאה בהוספת שירים. אנא נסה שנית.");
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || null;

  return (
    <div className="h-screen w-screen bg-black flex overflow-hidden p-2 gap-2">
      <Sidebar 
        playlists={playlists}
        selectedPlaylistId={selectedPlaylistId}
        onSelectPlaylist={setSelectedPlaylistId}
        currentMode={mode}
        onModeChange={setMode}
      />
      {mode === InsertionMode.ARTIST ? (
        <ComingSoonPage />
      ) : (
        <MainContent 
          onAddSongs={handleAddSongs} 
          mode={mode}
          selectedPlaylist={selectedPlaylist}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
