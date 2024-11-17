// src/services/openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getAIWord = async (lastWord) => {
  if (!process.env.REACT_APP_OPENAI_API_KEY) {
    console.error("OpenAI API key is missing");
    return null;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are playing a word game. You need to respond with a valid English word that starts with the last two letters of the given word. The word must be at least 3 letters long and be a real English word. Respond with just the word, nothing else.",
        },
        {
          role: "user",
          content: `Give me a word that starts with "${lastWord.slice(-2)}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    return completion.choices[0].message.content.toLowerCase().trim();
  } catch (error) {
    console.error("Error getting AI response:", error);
    return null;
  }
};
