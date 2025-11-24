import React, { useState } from 'react';
import { Music, ArrowRight, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    
    if (cleanToken) {
      // If token is '123', set specific username, otherwise default to 'User'
      // This allows the token to be passed up to App for potential API usage
      const username = cleanToken === '123' ? 'חבר למואזין' : 'משתמש';
      onLogin(username, cleanToken);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#1e3a8a] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#1ed760] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="bg-[#121212] p-10 rounded-2xl w-full max-w-md shadow-2xl border border-[#282828] relative z-10">
            <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Music size={32} className="text-black" />
                </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center text-white mb-2">חבר למואזין</h1>
            <p className="text-[#b3b3b3] text-center mb-8 text-sm">הכנס טוקן להתחברות</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white pr-1">טוקן (API Token)</label>
                    <div className="relative group">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] group-focus-within:text-white transition-colors" size={20} />
                        <input 
                            type="password" 
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-transparent focus:border-[#1ed760] focus:bg-[#333] rounded-md py-3 pr-10 pl-4 text-white placeholder-[#757575] outline-none transition-all"
                            placeholder="הדבק את הטוקן שלך כאן"
                            autoFocus
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={!token.trim()}
                    className="bg-[#1ed760] hover:bg-[#3be477] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span>התחבר</span>
                    <ArrowRight size={20} />
                </button>
            </form>
        </div>
    </div>
  );
};

export default LoginPage;