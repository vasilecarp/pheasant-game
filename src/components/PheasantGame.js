import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Heart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const PheasantGame = () => {
  const [playerLives, setPlayerLives] = useState(5);
  const [aiLives, setAiLives] = useState(5);
  const [currentWord, setCurrentWord] = useState("");
  const [gameHistory, setGameHistory] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState("Your turn! Enter any word to start.");
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Mock AI response - In real implementation, this would call an LLM API
  const getAIResponse = async (lastWord) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // This is where you would integrate with an actual LLM API
    // For demo purposes, using a simple array of words
    const mockWords = {
      on: "only",
      ly: "lyric",
      ic: "icon",
      er: "error",
      or: "orange",
      ge: "genre",
      re: "ready",
    };

    const lastTwoLetters = lastWord.slice(-2);
    const aiWord = mockWords[lastTwoLetters] || "";

    setLoading(false);
    return aiWord;
  };

  const validateWord = (word) => {
    if (word.length < 3) {
      return { valid: false, message: "Word must be at least 3 letters long!" };
    }

    if (gameHistory.length > 0) {
      const lastWord = gameHistory[gameHistory.length - 1];
      const lastTwoLetters = lastWord.slice(-2);
      if (!word.toLowerCase().startsWith(lastTwoLetters)) {
        return {
          valid: false,
          message: `Word must start with '${lastTwoLetters}'!`,
        };
      }
    }

    if (gameHistory.includes(word.toLowerCase())) {
      return { valid: false, message: "Word has already been used!" };
    }

    return { valid: true, message: "" };
  };

  const handlePlayerMove = async () => {
    if (!currentWord || loading || gameOver) return;

    const validation = validateWord(currentWord.toLowerCase());
    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }

    // Add player's word to history
    const newHistory = [...gameHistory, currentWord.toLowerCase()];
    setGameHistory(newHistory);
    setCurrentWord("");
    setIsPlayerTurn(false);

    // AI's turn
    const aiResponse = await getAIResponse(currentWord);

    if (!aiResponse) {
      setAiLives(aiLives - 1);
      setMessage("AI couldn't find a word! AI loses a life!");
      setIsPlayerTurn(true);
    } else {
      setGameHistory([...newHistory, aiResponse]);
      setMessage(`AI played: ${aiResponse}`);
      setIsPlayerTurn(true);
    }
  };

  useEffect(() => {
    if (playerLives === 0 || aiLives === 0) {
      setGameOver(true);
      setMessage(
        playerLives === 0 ? "Game Over! AI wins!" : "Congratulations! You win!"
      );
    }
  }, [playerLives, aiLives]);

  const renderLives = (lives) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Heart
          key={i}
          className={`w-6 h-6 ${i < lives ? "text-red-500" : "text-gray-300"}`}
        />
      ));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Pheasant Word Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Player:</span>
              {renderLives(playerLives)}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">AI:</span>
              {renderLives(aiLives)}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg max-h-48 overflow-y-auto">
            {gameHistory.map((word, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  index % 2 === 0 ? "text-blue-600" : "text-green-600"
                }`}
              >
                {index % 2 === 0 ? "Player" : "AI"}: {word}
              </div>
            ))}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              placeholder="Enter a word..."
              disabled={!isPlayerTurn || gameOver || loading}
              onKeyPress={(e) => e.key === "Enter" && handlePlayerMove()}
            />
            <Button
              onClick={handlePlayerMove}
              disabled={!isPlayerTurn || gameOver || loading}
            >
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PheasantGame;