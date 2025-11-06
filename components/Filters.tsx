import React from 'react';
import type { JobCategory } from '../types';

interface FiltersProps {
  category: JobCategory;
  setCategory: (category: JobCategory) => void;
  isRussian: boolean;
  setIsRussian: (isRussian: boolean) => void;
  onFetchBibleVerse: () => void;
  bibleVerse: string;
  isVerseLoading: boolean;
}

const standardCategories: JobCategory[] = ['AI', 'IT', 'Marketing', 'Web3', 'SEO'];

export const Filters: React.FC<FiltersProps> = ({ category, setCategory, isRussian, setIsRussian, onFetchBibleVerse, bibleVerse, isVerseLoading }) => {
  return (
    <fieldset className="border-2 border-holy-dark-blue p-2 w-full md:w-1/3 shadow-holy-inset mb-4 md:mb-0">
      <legend className="px-1 font-bold"></legend>
      <div className="space-y-3">
        <div>
          <label className="block mb-1">Category:</label>
          <div>
            <div className="flex flex-wrap gap-2">
                {standardCategories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-1 px-3 py-1 border-2 border-holy-dark-blue shadow-holy-outset text-holy-black ${category === cat ? 'bg-holy-yellow shadow-holy-inset' : 'bg-holy-gray'} active:shadow-holy-inset text-sm`}
                >
                    {cat}
                </button>
                ))}
            </div>
            <button
                onClick={onFetchBibleVerse}
                className={`w-full mt-2 px-3 py-1 border-2 border-holy-dark-blue shadow-holy-outset bg-holy-gray text-holy-black active:shadow-holy-inset text-lg font-bold`}
                title="Receive a word from the Lord"
            >
                Catacombs
            </button>
          </div>
        </div>
        
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRussian}
              onChange={() => setIsRussian(!isRussian)}
              className="appearance-none w-4 h-4 bg-holy-white border-2 border-holy-dark-blue shadow-holy-inset checked:bg-holy-yellow"
            />
            <span>Russian Language Roles</span>
          </label>
        </div>
        
        {(isVerseLoading || bibleVerse) && (
            <div className="mt-3 pt-3 border-t-2 border-dashed border-holy-dark-blue">
                {isVerseLoading && <p className="text-sm italic text-center">Receiving transmission...</p>}
                {bibleVerse && <p className="text-sm italic text-center">"{bibleVerse}"</p>}
            </div>
        )}
      </div>
    </fieldset>
  );
};