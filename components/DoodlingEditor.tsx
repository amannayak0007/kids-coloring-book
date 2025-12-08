import React from 'react';
import { Home } from 'lucide-react';
import DoodleJoyApp from '../doodle-joy/App';

interface DoodlingEditorProps {
  onBack: () => void;
}

export const DoodlingEditor: React.FC<DoodlingEditorProps> = ({ onBack }) => {
  return (
    <div className="relative h-screen w-full">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-50 bg-white/80 backdrop-blur-xl hover:bg-white text-gray-700 px-5 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all font-rounded"
      >
        <Home size={18} />
        <span className="text-sm sm:text-base">Home</span>
      </button>
      
      {/* Doodle Joy App */}
      <DoodleJoyApp />
    </div>
  );
};

