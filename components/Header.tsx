import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-holy-gray text-holy-black p-2 flex items-center justify-between border-2 border-holy-dark-blue">
      <h1 className="text-xl md:text-3xl font-bold tracking-wider">
        Divine Connection Engine
      </h1>
      <div className="flex space-x-1">
        <div className="w-5 h-5 bg-holy-gray border-2 border-holy-dark-blue shadow-holy-outset text-center font-bold text-holy-black text-sm">_</div>
        <div className="w-5 h-5 bg-holy-gray border-2 border-holy-dark-blue shadow-holy-outset text-center font-bold text-holy-black text-sm">[]</div>
        <div className="w-5 h-5 bg-holy-gray border-2 border-holy-dark-blue shadow-holy-outset text-center font-bold text-holy-black text-sm">X</div>
      </div>
    </header>
  );
};