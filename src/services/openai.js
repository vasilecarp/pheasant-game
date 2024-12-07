import OpenAI from "openai";

console.log("API Key exists:", !!process.env.REACT_APP_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAIWord = async (lastWord) => {
  if (!process.env.REACT_APP_OPENAI_API_KEY) {
    console.error("OpenAI API key is missing");
    return null;
  }

  try {
    
    await delay(1000); 

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

    // Handle rate limit errors specifically
    if (error.status === 429) {
      console.log(
        "Rate limit reached. Please wait a moment before trying again."
      );
      
      await delay(2000); // Wait 2 seconds before allowing next request
    }
    return null;
  }
};
