import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#faf8f5] text-stone-600 animate-fadeIn py-16">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
        <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-stone-500">
          Loading Page...
        </div>
      </div>
    </div>
  );
};
