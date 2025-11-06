import { GoogleGenAI } from "@google/genai";
import type { Job, JobCategory } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchJobs = async (category: JobCategory, language: 'English' | 'Russian', searchTerm: string): Promise<Job[]> => {
  const basePrompt = `
    The datePosted should be the actual date the job was posted, in 'YYYY-MM-DD' format.
    The output MUST be a single, valid JSON array of job objects, enclosed in a markdown code block (\`\`\`json ... \`\`\`).
    Each job object must include: a unique 'id' (can be a generated UUID), 'title', 'company', 'description' (a 1-2 sentence summary), 'datePosted', 'location' (can be 'Remote' or a specific city if mentioned), 'language', 'category', and the direct 'url' to the job posting.
    Do not include any text outside of the JSON markdown block.
  `;
  
  const specificPrompt = `Using Google Search, find 12 real, remote, entry-level or mid-level job listings for the category "${category}" targeting ${language} speakers, posted within the last month, from popular job sites like LinkedIn, Indeed, etc.`;
  
  const prompt = specificPrompt + basePrompt;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    if (!jsonMatch) {
      try {
        return JSON.parse(text) as Job[];
      } catch (e) {
         throw new Error("No valid JSON content found in the response.");
      }
    }
    
    const jsonString = jsonMatch[1];
    const jobs = JSON.parse(jsonString) as Job[];
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs from Gemini API:", error);
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON response from the model.");
    }
    throw new Error("Failed to generate job listings.");
  }
};

export const fetchBibleVerse = async (): Promise<string> => {
    const prompt = `Generate a single, short, encouraging Bible verse. Include the book, chapter, and verse number (e.g., John 3:16). The response should be ONLY the verse text and its reference. Do not include any other text, explanation, or markdown formatting.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching affirmation:", error);
        return "You are a child of God. He will not forget you.";
    }
}