import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSongResponse } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    // We will return a dummy client or handle this gracefully in the UI
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchSongsByArtist = async (artistName: string): Promise<GeneratedSongResponse[]> => {
  const ai = getAiClient();
  
  const prompt = `List 10 popular songs by the artist "${artistName}". Provide the title, album, and an approximate duration (e.g. "3:45"). Ensure the artist name is consistent.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              album: { type: Type.STRING },
              duration: { type: Type.STRING }
            },
            required: ["title", "artist", "album", "duration"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedSongResponse[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching songs by artist:", error);
    return [];
  }
};

export const parseSongList = async (rawText: string): Promise<GeneratedSongResponse[]> => {
  const ai = getAiClient();
  
  const prompt = `Parse the following text into a structured list of songs. Attempt to identify title and artist. If no artist is found, use "Unknown Artist". If no album is found, use "Single". Estimate duration if unknown. Text: "${rawText}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              album: { type: Type.STRING },
              duration: { type: Type.STRING }
            },
            required: ["title", "artist", "album", "duration"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedSongResponse[];
    }
    return [];
  } catch (error) {
    console.error("Error parsing song list:", error);
    return [];
  }
};