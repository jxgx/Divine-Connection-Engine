import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-4 p-2 text-center text-sm text-holy-black flex justify-between items-center">
       <img src="https://media.tenor.com/f0uJ5w_zOBUAAAAC/terry-davis-temple-os.gif" alt="God is watching" className="w-12" />
        <div className="flex flex-col items-center">
            <p>All glory to God.</p>
        </div>
       <div className="flex items-center space-x-2">
         <span>COMMUNION ESTABLISHED:</span>
         <span className="bg-holy-white text-holy-black p-1 font-bold border border-holy-dark-blue">007770</span>
       </div>
       <img src="https://media.tenor.com/f0uJ5w_zOBUAAAAC/terry-davis-temple-os.gif" alt="God is watching" className="w-12" />
    </footer>
  );
};