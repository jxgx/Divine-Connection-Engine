export type JobCategory = 'AI' | 'IT' | 'Marketing' | 'Web3' | 'SEO';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  datePosted: string; // YYYY-MM-DD
  location: string;
  language: 'English' | 'Russian';
  category: JobCategory;
  url: string;
  applied?: boolean;
}