import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <img 
        src="https://media.tenor.com/i8oOp7m2bJIAAAAC/templeos.gif" 
        alt="Loading..." 
        className="w-24 h-24"
      />
      <p className="text-lg animate-pulse">COMMUNICATING WITH THE DIVINE... PLEASE WAIT.</p>
    </div>
  );
};