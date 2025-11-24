import React from 'react';
import { Hammer } from 'lucide-react';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] rounded-lg p-8 overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="mb-6 p-6 bg-[#282828] rounded-full animate-pulse">
        <Hammer size={64} className="text-[#1ed760]" />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-white">מגיע בקרוב</h1>
      <p className="text-[#b3b3b3] max-w-md text-lg">
        אנו עובדים כרגע על הוספת האפשרות להוסיף שירים לפי אמן.
        <br />
        אנא חזרו לבדוק בקרוב!
      </p>
    </div>
  );
};

export default ComingSoonPage;

