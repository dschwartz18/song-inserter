
import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, Loader2, Music2, LogOut, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { InsertionMode, Song, GeneratedSongResponse, Playlist, User } from '../types';
import { fetchSongsByArtist, parseSongList } from '../services/geminiService';

interface MainContentProps {
  onAddSongs: (songs: Song[]) => Promise<void>;
  mode: InsertionMode;
  selectedPlaylist: Playlist | null;
  user: User | null;
  onLogout: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ onAddSongs, mode, selectedPlaylist, user, onLogout }) => {
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState<Song[]>([]);
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Clear results when mode changes
  useEffect(() => {
    setGeneratedSongs([]);
    setSelectedSongIds(new Set());
    setInputValue('');
  }, [mode, selectedPlaylist?.id]);

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;
    
    setIsGenerating(true);
    setGeneratedSongs([]);
    setSelectedSongIds(new Set());

    let results: GeneratedSongResponse[] = [];

    if (mode === InsertionMode.ARTIST) {
      results = await fetchSongsByArtist(inputValue);
    } else {
      results = await parseSongList(inputValue);
    }

    const songs: Song[] = results.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      title: item.title,
      artist: item.artist,
      album: item.album,
      duration: item.duration,
      coverUrl: `https://picsum.photos/seed/${item.title.replace(/\s/g,'') + item.artist.replace(/\s/g,'')}/64/64`
    }));

    setGeneratedSongs(songs);
    // Auto-select all by default for convenience
    setSelectedSongIds(new Set(songs.map(s => s.id)));
    setIsGenerating(false);
  };

  const toggleSongSelection = (id: string) => {
    const newSet = new Set(selectedSongIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedSongIds(newSet);
  };

  const handleAddSelected = async () => {
    if (!selectedPlaylist) return;
    setIsAdding(true);
    
    const songsToAdd = generatedSongs.filter(s => selectedSongIds.has(s.id));
    await onAddSongs(songsToAdd);
    
    setIsAdding(false);
    setGeneratedSongs([]);
    setSelectedSongIds(new Set());
    setInputValue('');
  };

  return (
    <div className="flex-1 bg-[#121212] rounded-lg overflow-hidden flex flex-col relative h-full">
        {/* Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#1e3a8a] to-[#121212] opacity-40 pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative" ref={scrollContainerRef}>
            {/* Header Table / Bar */}
            <div className="sticky top-0 bg-[#121212]/95 backdrop-blur-sm z-20 p-4 border-b border-[#282828] shadow-md flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-white tracking-wide">חבר למואזין</h1>
                 
                 <div className="flex items-center gap-3">
                     {selectedPlaylist && (
                         <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-1 rounded-full border border-[#333]">
                             <Music2 size={14} className="text-[#1ed760]"/>
                             <span className="text-xs text-[#b3b3b3]">מוסיף ל: </span>
                             <span className="text-sm font-bold text-white max-w-[150px] truncate">{selectedPlaylist.name}</span>
                         </div>
                     )}

                     {/* User Profile / Logout Button */}
                     <div 
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-black/60 hover:bg-[#282828] p-1 pl-3 pr-1 rounded-full cursor-pointer transition-all border border-transparent hover:border-[#333] group"
                        title="לחץ להתנתקות"
                     >
                        <div className="w-7 h-7 bg-[#535353] group-hover:bg-[#1ed760] transition-colors rounded-full flex items-center justify-center">
                             <UserIcon size={16} className="text-white group-hover:text-black" />
                        </div>
                        <span className="text-sm font-bold text-white hidden sm:block">{user?.username}</span>
                        <LogOut size={14} className="text-[#b3b3b3] group-hover:text-white ml-1 transition-colors" />
                     </div>
                 </div>
            </div>

            <div className="px-8 max-w-4xl mx-auto mt-8 pb-24">
                <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">
                    {mode === InsertionMode.ARTIST ? 'הוספת שירים לפי אמן' : 'יבוא מרשימת שירים'}
                </h2>
                
                {!selectedPlaylist ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#2a2a2a] rounded-xl text-center animate-pulse">
                        <Music2 size={48} className="text-[#b3b3b3] mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">לא נבחר פלייליסט</h3>
                        <p className="text-[#b3b3b3]">אנא בחר פלייליסט מהתפריט הצדדי כדי להתחיל להוסיף שירים.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 animate-fade-in">
                        {/* Input Area */}
                        <div className="relative">
                            {mode === InsertionMode.ARTIST ? (
                                <div className="relative group">
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] group-focus-within:text-white transition-colors" size={24} />
                                    <input 
                                        type="text" 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="איזה אמן בא לך לשמוע?" 
                                        className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:ring-2 focus:ring-white border-none rounded-full py-4 pr-12 pl-4 text-white placeholder-[#757575] transition-all outline-none text-lg"
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    />
                                </div>
                            ) : (
                                <div className="relative group">
                                    <textarea 
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="הדבק כאן רשימת שירים (כל שיר בשורה חדשה)..."
                                        className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:ring-2 focus:ring-white border-none rounded-2xl py-4 px-4 text-white placeholder-[#757575] transition-all outline-none text-md h-40 resize-none custom-scrollbar"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Generate Action */}
                        <div className="flex justify-end">
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !inputValue.trim()}
                                className="bg-[#1ed760] hover:bg-[#3be477] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-[#1ed760]/20"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                                {mode === InsertionMode.ARTIST ? 'מצא שירים' : 'עבד רשימה'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Results Area */}
                {generatedSongs.length > 0 && selectedPlaylist && (
                    <div className="mt-12 animate-slide-up">
                        <div className="flex items-center justify-between mb-4 border-b border-[#2a2a2a] pb-2 sticky top-[72px] bg-[#121212] z-10 pt-4">
                            <h2 className="text-xl font-bold text-white">תוצאות</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-[#b3b3b3] text-sm">{selectedSongIds.size} נבחרו</span>
                                <button 
                                    onClick={handleAddSelected}
                                    disabled={selectedSongIds.size === 0 || isAdding}
                                    className="bg-white hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed text-black font-bold text-sm px-6 py-2 rounded-full transition-all hover:scale-105 shadow-md flex items-center gap-2 min-w-[140px] justify-center"
                                >
                                    {isAdding ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16}/>
                                            <span>מוסיף...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>הוסף ל-{selectedPlaylist.name}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            {/* Table Header */}
                            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-[#b3b3b3] text-sm border-b border-[#2a2a2a]">
                                <div className="w-8 text-center">#</div>
                                <div>כותרת</div>
                                <div>אלבום</div>
                                <div className="flex justify-end"><Clock size={16} /></div>
                            </div>

                            {/* List */}
                            {generatedSongs.map((song, idx) => (
                                <div 
                                    key={song.id}
                                    onClick={() => toggleSongSelection(song.id)}
                                    className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-md cursor-pointer items-center group transition-colors ${selectedSongIds.has(song.id) ? 'bg-[#2a2a2a]/60' : 'hover:bg-[#2a2a2a]/40'}`}
                                >
                                    <div className="w-8 flex justify-center text-[#b3b3b3] relative">
                                        <span className="group-hover:hidden">{idx + 1}</span>
                                        <div className={`hidden group-hover:flex ${selectedSongIds.has(song.id) ? 'text-[#1ed760]' : 'text-white'}`}>
                                            {selectedSongIds.has(song.id) ? (
                                                 <div className="w-4 h-4 rounded-full bg-[#1ed760] border border-[#1ed760] flex items-center justify-center">
                                                     <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                                 </div>
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-[#b3b3b3] hover:border-white"></div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <img src={song.coverUrl} alt="" className="w-10 h-10 rounded shadow-sm object-cover flex-shrink-0" />
                                        <div className="flex flex-col truncate">
                                            <span className={`truncate font-medium ${selectedSongIds.has(song.id) ? 'text-[#1ed760]' : 'text-white'}`}>{song.title}</span>
                                            <span className="text-sm text-[#b3b3b3] group-hover:text-white transition-colors truncate">{song.artist}</span>
                                        </div>
                                    </div>

                                    <div className="text-[#b3b3b3] text-sm truncate group-hover:text-white transition-colors flex items-center">
                                        {song.album}
                                    </div>

                                    <div className="text-[#b3b3b3] text-sm font-variant-tabular flex justify-end min-w-[50px]">
                                        {song.duration || "-:-"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MainContent;
