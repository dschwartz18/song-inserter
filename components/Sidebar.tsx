import React from 'react';
import { Library, Plus, Heart, ListMusic, Mic2, Pin } from 'lucide-react';
import { Playlist, InsertionMode } from '../types';

interface SidebarProps {
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  onSelectPlaylist: (id: string) => void;
  currentMode: InsertionMode;
  onModeChange: (mode: InsertionMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  playlists, 
  selectedPlaylistId, 
  onSelectPlaylist, 
  currentMode, 
  onModeChange 
}) => {
  return (
    <div className="w-[280px] flex flex-col h-full gap-2 shrink-0">
      {/* Mode Selection Block */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-2">
        <div 
            onClick={() => onModeChange(InsertionMode.ARTIST)}
            className={`flex items-center gap-4 cursor-pointer transition-colors p-3 rounded-md ${currentMode === InsertionMode.ARTIST ? 'text-white bg-[#282828]' : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'}`}
        >
          <Mic2 size={24} />
          <span className="font-bold text-md">לפי אומן</span>
        </div>
        <div 
            onClick={() => onModeChange(InsertionMode.LIST)}
            className={`flex items-center gap-4 cursor-pointer transition-colors p-3 rounded-md ${currentMode === InsertionMode.LIST ? 'text-white bg-[#282828]' : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'}`}
        >
          <ListMusic size={24} />
          <span className="font-bold text-md">לפי שירים</span>
        </div>
      </div>

      {/* Library Block */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4 shadow-lg z-10">
          <div className="flex items-center justify-between text-[#b3b3b3] mb-4">
            <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
              <Library size={24} />
              <span className="font-bold text-md">בחר פלייליסט להוספה</span>
            </div>
            <div className="hover:bg-[#2a2a2a] p-1 rounded-full cursor-pointer transition-colors">
              <Plus size={20} />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <span className="bg-[#2a2a2a] text-sm text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#3a3a3a] transition-colors">פלייליסטים</span>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {playlists.map((playlist) => {
                const isSelected = selectedPlaylistId === playlist.id;
                return (
                    <div 
                        key={playlist.id} 
                        onClick={() => onSelectPlaylist(playlist.id)}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer group transition-all
                            ${isSelected ? 'bg-[#282828] ring-1 ring-[#1ed760]/30' : 'hover:bg-[#1a1a1a]'}
                        `}
                    >
                        {/* Cover Image */}
                        <div className={`w-12 h-12 flex items-center justify-center rounded-md shadow-sm opacity-90 group-hover:opacity-100 overflow-hidden relative
                            ${playlist.type === 'liked' ? 'bg-gradient-to-br from-[#450af5] to-[#c4efd9]' : 'bg-[#333]'}
                        `}>
                            {playlist.type === 'liked' ? (
                                <Heart fill="white" size={20} className="text-white" />
                            ) : playlist.coverUrl ? (
                                <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
                            ) : (
                                <ListMusic size={20} className="text-[#b3b3b3]" />
                            )}
                            
                            {/* Selected Indicator Overlay */}
                            {isSelected && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-[#1ed760] rounded-full shadow-[0_0_8px_#1ed760]"></div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col overflow-hidden flex-1">
                            <span className={`font-medium truncate ${isSelected ? 'text-[#1ed760]' : 'text-white'}`}>
                                {playlist.name}
                            </span>
                            <span className="text-[#b3b3b3] text-sm flex items-center gap-1 truncate">
                                {playlist.isPinned && <Pin size={12} className="text-[#1ed760] fill-[#1ed760]" />}
                                {playlist.type === 'playlist' ? 'פלייליסט' : 'אוסף'} • {playlist.songs.length} שירים
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;