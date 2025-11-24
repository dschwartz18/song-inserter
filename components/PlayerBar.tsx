import React from 'react';
import { Play, SkipBack, SkipForward, Repeat, Shuffle, Mic2, ListMusic, Laptop2, Volume2, Maximize2, Heart } from 'lucide-react';

const PlayerBar: React.FC = () => {
  return (
    <div className="h-[90px] bg-[#000000] border-t border-[#282828] flex items-center justify-between px-4 z-50">
      {/* Left: Current Song Info (Mock) */}
      <div className="flex items-center gap-4 w-[30%]">
        <div className="w-14 h-14 bg-[#282828] rounded-md overflow-hidden relative group cursor-pointer">
             <img src="https://picsum.photos/seed/player/56/56" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="cover" />
        </div>
        <div className="flex flex-col justify-center">
            <span className="text-white text-sm font-medium hover:underline cursor-pointer">שם השיר המתנגן</span>
            <span className="text-[#b3b3b3] text-xs hover:underline cursor-pointer hover:text-white">שם האמן</span>
        </div>
        <Heart size={16} className="text-[#1ed760] ml-2 cursor-pointer" fill="#1ed760" />
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center w-[40%] max-w-[722px]">
        <div className="flex items-center gap-6 mb-2">
            <Shuffle size={16} className="text-[#1ed760] cursor-pointer hover:scale-105 transition-transform" />
            <SkipForward size={20} className="text-[#b3b3b3] hover:text-white cursor-pointer fill-current rotate-180" />
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <Play size={16} fill="black" className="text-black ml-0.5" />
            </div>
            <SkipBack size={20} className="text-[#b3b3b3] hover:text-white cursor-pointer fill-current rotate-180" />
            <Repeat size={16} className="text-[#b3b3b3] hover:text-white cursor-pointer" />
        </div>
        <div className="w-full flex items-center gap-2 text-xs text-[#a7a7a7] font-medium">
            <span>0:42</span>
            <div className="h-1 bg-[#4d4d4d] rounded-full flex-1 group cursor-pointer relative">
                <div className="h-full w-[30%] bg-white rounded-full group-hover:bg-[#1ed760]"></div>
                 <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-[70%] w-3 h-3 bg-white rounded-full shadow-md"></div>
            </div>
            <span>3:15</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end gap-3 w-[30%] text-[#b3b3b3]">
        <Mic2 size={16} className="hover:text-white cursor-pointer" />
        <ListMusic size={16} className="hover:text-white cursor-pointer" />
        <Laptop2 size={16} className="hover:text-white cursor-pointer" />
        <div className="flex items-center gap-2 w-24 group">
            <Volume2 size={16} className="hover:text-white cursor-pointer" />
            <div className="h-1 bg-[#4d4d4d] rounded-full flex-1 cursor-pointer relative">
                 <div className="h-full w-[80%] bg-white rounded-full group-hover:bg-[#1ed760]"></div>
            </div>
        </div>
        <Maximize2 size={16} className="hover:text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default PlayerBar;