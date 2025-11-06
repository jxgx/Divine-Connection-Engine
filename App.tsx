import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Job, JobCategory } from './types';
import { fetchJobs, fetchBibleVerse } from './services/geminiService';
import { Filters } from './components/Filters';
import { SearchBar } from './components/SearchBar';
import { JobList } from './components/JobList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState<JobCategory>('AI');
  const [isRussian, setIsRussian] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [view, setView] = useState<'search' | 'saved'>('search');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bibleVerse, setBibleVerse] = useState<string>('');
  const [isVerseLoading, setIsVerseLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem('savedJobs');
      if (storedJobs) {
        setSavedJobs(JSON.parse(storedJobs));
      }
    } catch (e) {
      console.error("Failed to parse saved jobs from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    } catch (e) {
      console.error("Failed to save jobs to localStorage", e);
    }
  }, [savedJobs]);

  const loadJobs = useCallback(async () => {
    if (view === 'saved') return;

    setIsLoading(true);
    setError(null);
    try {
      const language = isRussian ? 'Russian' : 'English';
      // The `searchTerm` is applied on the client-side for all categories now.
      const jobs = await fetchJobs(category, language, '');
      setAllJobs(jobs);
    } catch (err) {
      console.error(err);
      setError('Failed to receive divine guidance. The connection may be lost. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [category, isRussian, view]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);
  
  const handleFetchBibleVerse = async () => {
      setIsVerseLoading(true);
      setBibleVerse('');
      try {
          const verse = await fetchBibleVerse();
          setBibleVerse(verse);
      } catch (err) {
          console.error("Failed to fetch Bible verse", err);
          setBibleVerse("The connection to the divine is unstable.");
      } finally {
          setIsVerseLoading(false);
      }
  };

  const handleSaveJob = (jobToSave: Job) => {
    if (!savedJobs.some(job => job.id === jobToSave.id)) {
      setSavedJobs(prev => [...prev, { ...jobToSave, applied: false }]);
    }
  };

  const handleRemoveJob = (jobIdToRemove: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobIdToRemove));
  };

  const handleToggleApplied = (jobId: string) => {
    setSavedJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, applied: !job.applied } : job
    ));
  };
  
  const handleSearchSubmit = () => {
    // Search is now handled live on the client-side, no submission needed.
  };

  const savedJobIds = useMemo(() => new Set(savedJobs.map(j => j.id)), [savedJobs]);

  const displayedJobs = useMemo(() => {
    const sourceList = view === 'search' ? allJobs : savedJobs;

    const filteredList = sourceList.filter(job => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      if (!lowerSearchTerm) return true;
      
      return (
        job.title.toLowerCase().includes(lowerSearchTerm) ||
        job.company.toLowerCase().includes(lowerSearchTerm) ||
        job.description.toLowerCase().includes(lowerSearchTerm)
      );
    });
    
    if (view === 'saved') {
        return filteredList.sort((a, b) => {
            if (a.applied === b.applied) {
                return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
            }
            return a.applied ? 1 : -1;
        });
    }

    return filteredList.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());

  }, [allJobs, savedJobs, view, searchTerm]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-holy-pink p-2 shadow-holy-outset border-2 border-holy-dark-blue">
        <Header />

        <main className="mt-4 p-2 border-2 border-holy-dark-blue shadow-holy-inset min-h-[60vh]">
          <div className="md:flex md:space-x-4">
             <Filters
                category={category}
                setCategory={setCategory}
                isRussian={isRussian}
                setIsRussian={setIsRussian}
                onFetchBibleVerse={handleFetchBibleVerse}
                bibleVerse={bibleVerse}
                isVerseLoading={isVerseLoading}
             />
             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearchSubmit={handleSearchSubmit}/>
          </div>
          
          <div className="my-4 flex justify-center space-x-4">
            <button 
              onClick={() => setView('search')}
              className={`px-4 py-1 border-2 border-holy-dark-blue shadow-holy-outset ${view === 'search' ? 'bg-holy-yellow text-holy-black shadow-holy-inset' : 'bg-holy-gray text-holy-black'} active:shadow-holy-inset`}
            >
              Search Results
            </button>
             <button 
              onClick={() => setView('saved')}
              className={`px-4 py-1 border-2 border-holy-dark-blue shadow-holy-outset ${view === 'saved' ? 'bg-holy-yellow text-holy-black shadow-holy-inset' : 'bg-holy-gray text-holy-black'} active:shadow-holy-inset`}
            >
              My List ({savedJobs.length})
            </button>
          </div>

          <div className="mt-4">
            {isLoading && view === 'search' && <LoadingSpinner />}
            {error && view === 'search' && <p className="text-holy-yellow bg-holy-dark-blue border border-holy-yellow p-2 text-center">{error}</p>}
            {!isLoading && !error && <JobList jobs={displayedJobs} onSaveJob={handleSaveJob} onRemoveJob={handleRemoveJob} savedJobIds={savedJobIds} onToggleApplied={handleToggleApplied} view={view} />}
            {view === 'saved' && savedJobs.length === 0 && <p className="p-4 text-center">Your list is empty. Go find a calling!</p>}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default App;