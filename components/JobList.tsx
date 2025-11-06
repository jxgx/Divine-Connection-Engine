import React from 'react';
import type { Job } from '../types';

interface JobCardProps {
    job: Job;
    isSaved: boolean;
    onSave: (job: Job) => void;
    onRemove: (jobId: string) => void;
    onToggleApplied: (jobId:string) => void;
    view: 'search' | 'saved';
}

const JobCard: React.FC<JobCardProps> = ({ job, isSaved, onSave, onRemove, onToggleApplied, view }) => {
  return (
    <div className={`p-2 border-b-2 border-dashed border-holy-dark-blue ${job.applied ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className={`text-lg font-bold text-holy-black ${job.applied ? 'line-through' : ''}`}>{job.title}</h3>
          <p className="text-md font-bold text-holy-dark-blue">{job.company}</p>
        </div>
        <div className="flex items-center space-x-2 ml-2">
            {view === 'saved' && (
                 <button 
                    onClick={() => onToggleApplied(job.id)}
                    className="w-6 h-6 border-2 border-holy-dark-blue shadow-holy-outset bg-holy-gray text-holy-black font-bold active:shadow-holy-inset"
                    title="Mark as Applied"
                >
                    ✓
                 </button>
            )}
            <button
            onClick={() => isSaved ? onRemove(job.id) : onSave(job)}
            className={`px-3 py-1 text-sm border-2 border-holy-dark-blue shadow-holy-outset whitespace-nowrap text-holy-black ${isSaved ? 'bg-holy-yellow' : 'bg-holy-gray'} active:shadow-holy-inset`}
            >
            {isSaved ? 'Remove' : 'Save'}
            </button>
        </div>
      </div>
      <div className="text-sm text-holy-black opacity-75 flex space-x-4 my-1">
        <span><span className="font-bold">Date:</span> {job.datePosted}</span>
        <span><span className="font-bold">Location:</span> {job.location}</span>
      </div>
      <p className="my-2 text-sm text-holy-black">{job.description}</p>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-holy-dark-blue font-bold underline hover:text-holy-black"
      >
        &gt;&gt; Go To Posting
      </a>
    </div>
  );
};

interface JobListProps {
  jobs: Job[];
  onSaveJob: (job: Job) => void;
  onRemoveJob: (jobId: string) => void;
  savedJobIds: Set<string>;
  onToggleApplied: (jobId: string) => void;
  view: 'search' | 'saved';
}

export const JobList: React.FC<JobListProps> = ({ jobs, onSaveJob, onRemoveJob, savedJobIds, onToggleApplied, view }) => {
  if (jobs.length === 0 && view === 'search') {
    return <p className="p-4 text-center">No callings found. Broaden thy search.</p>;
  }

  return (
    <div className="space-y-2 bg-holy-pink p-1 border-2 border-holy-dark-blue shadow-holy-inset">
      {jobs.map(job => (
        <JobCard 
            key={job.id} 
            job={job}
            isSaved={savedJobIds.has(job.id)}
            onSave={onSaveJob}
            onRemove={onRemoveJob}
            onToggleApplied={onToggleApplied}
            view={view}
        />
      ))}
    </div>
  );
};