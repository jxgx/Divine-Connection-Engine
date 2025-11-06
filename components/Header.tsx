import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-holy-gray text-holy-black p-2 flex items-center justify-between border-2 border-holy-dark-blue">
      <div className="flex items-center space-x-4">
        <h1 className="font-germanic text-2xl md:text-4xl font-bold">
          Divine Connection Engine
        </h1>
        <img src="https://media.tenor.com/X0CsHkP2V60AAAAi/angel-pixel-art.gif" alt="Lovely Angel" className="w-12 h-12" />
      </div>
      <div className="flex space-x-1">
        <div className="w-5 h-5 bg-holy-gray border-2 border-holy-dark-blue shadow-holy-outset text-center font-bold text-holy-black text-sm">_</div>
        <div className="w-5 h-5 bg-holy-gray border-2 border-holy-dark-blue shadow-holy-outset text-center font-bold text-holy-black text-sm">[]</div>
        <div className="w-5 h-5 bg-holy-gray border-2 border-holy-dark-blue shadow-holy-outset text-center font-bold text-holy-black text-sm">X</div>
      </div>
    </header>
  );
};