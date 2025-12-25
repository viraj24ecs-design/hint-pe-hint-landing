import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Coins, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Game data structure - EDIT THESE VALUES
const GAME_DATA = {
  rounds: [
    {
      roundNumber: 1,
      hints: [
        "Hint 1 text here - Edit this",
        "Hint 2 text here - Edit this",
        "Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 3, // Index of correct answer in answers array (0-11)
    },
    {
      roundNumber: 2,
      hints: [
        "Round 2 - Hint 1 text here - Edit this",
        "Round 2 - Hint 2 text here - Edit this",
        "Round 2 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 1,
    },
    {
      roundNumber: 3,
      hints: [
        "Round 3 - Hint 1 text here - Edit this",
        "Round 3 - Hint 2 text here - Edit this",
        "Round 3 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 2,
    },
    {
      roundNumber: 4,
      hints: [
        "Round 4 - Hint 1 text here - Edit this",
        "Round 4 - Hint 2 text here - Edit this",
        "Round 4 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 0,
    },
    {
      roundNumber: 5,
      hints: [
        "Round 5 - Hint 1 text here - Edit this",
        "Round 5 - Hint 2 text here - Edit this",
        "Round 5 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 4,
    },
    {
      roundNumber: 6,
      hints: [
        "Round 6 - Hint 1 text here - Edit this",
        "Round 6 - Hint 2 text here - Edit this",
        "Round 6 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 5,
    },
    {
      roundNumber: 7,
      hints: [
        "Round 7 - Hint 1 text here - Edit this",
        "Round 7 - Hint 2 text here - Edit this",
        "Round 7 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 6,
    },
    {
      roundNumber: 8,
      hints: [
        "Round 8 - Hint 1 text here - Edit this",
        "Round 8 - Hint 2 text here - Edit this",
        "Round 8 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 7,
    },
    {
      roundNumber: 9,
      hints: [
        "Round 9 - Hint 1 text here - Edit this",
        "Round 9 - Hint 2 text here - Edit this",
        "Round 9 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 8,
    },
    {
      roundNumber: 10,
      hints: [
        "Round 10 - Hint 1 text here - Edit this",
        "Round 10 - Hint 2 text here - Edit this",
        "Round 10 - Hint 3 text here - Edit this",
      ],
      correctAnswerIndex: 9,
    },
  ],
  answers: [
    "Answer Box 1 - Edit this",
    "Answer Box 2 - Edit this",
    "Answer Box 3 - Edit this",
    "Answer Box 4 - Edit this",
    "Answer Box 5 - Edit this",
    "Answer Box 6 - Edit this",
    "Answer Box 7 - Edit this",
    "Answer Box 8 - Edit this",
    "Answer Box 9 - Edit this",
    "Answer Box 10 - Edit this",
    "Decoy Answer 1 - Edit this",
    "Decoy Answer 2 - Edit this",
  ],
};

const TrialBookGame = () => {
  const { user, logout, updateBookProgress, updateCoins } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const bookId = "trialBook";
  const currentProgress = user?.bookProgress?.trialBook || 0;

  // Game state
  const [currentRound, setCurrentRound] = useState(0);
  const [currentHint, setCurrentHint] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/game");
  };

  const handleNextHint = () => {
    if (currentHint < 2) {
      setCurrentHint(currentHint + 1);
    }
  };

  const handleRevealAnswer = () => {
    setIsRevealed(true);
    setSelectedAnswer(GAME_DATA.rounds[currentRound].correctAnswerIndex);
    
    // Move to next round after 7 seconds
    setTimeout(() => {
      moveToNextRound();
    }, 7000);
  };

  const handleAnswerClick = async (answerIndex: number) => {
    if (selectedAnswer !== null || isRevealed) return; // Already answered

    setSelectedAnswer(answerIndex);
    const correctIndex = GAME_DATA.rounds[currentRound].correctAnswerIndex;
    const isCorrect = answerIndex === correctIndex;

    // Calculate coins based on current hint
    let coinsChange = 0;
    if (currentHint === 0) {
      coinsChange = isCorrect ? 60 : -30;
    } else if (currentHint === 1) {
      coinsChange = isCorrect ? 40 : -20;
    } else {
      coinsChange = isCorrect ? 20 : -20;
    }

    // Update coins (updateCoins function handles ensuring coins don't go below 0)
    if (coinsChange !== 0) {
      await updateCoins(coinsChange);
    }

    // Show feedback
    toast({
      title: isCorrect ? "Correct! 🎉" : "Incorrect ❌",
      description: `${coinsChange > 0 ? '+' : ''}${coinsChange} Charity Coins`,
      variant: isCorrect ? "default" : "destructive",
    });

    setIsRevealed(true);

    // Move to next round after 7 seconds
    setTimeout(() => {
      moveToNextRound();
    }, 7000);
  };

  const moveToNextRound = async () => {
    if (currentRound < GAME_DATA.rounds.length - 1) {
      // Move to next round
      setCurrentRound(currentRound + 1);
      setCurrentHint(0);
      setSelectedAnswer(null);
      setIsRevealed(false);

      // Update progress (10% per round)
      const newProgress = Math.min(100, ((currentRound + 1) / GAME_DATA.rounds.length) * 100);
      await updateBookProgress(bookId, newProgress);
    } else {
      // Game completed
      setGameCompleted(true);
      await updateBookProgress(bookId, 100);
      
      toast({
        title: "🎉 Congratulations!",
        description: "You've completed the Trial Book!",
      });
    }
  };

  const getAnswerStyle = (answerIndex: number) => {
    if (!isRevealed) return "";
    
    const correctIndex = GAME_DATA.rounds[currentRound].correctAnswerIndex;
    
    if (answerIndex === correctIndex) {
      return "bg-green-500 text-white border-green-600";
    }
    
    if (answerIndex === selectedAnswer && answerIndex !== correctIndex) {
      return "bg-red-500 text-white border-red-600";
    }
    
    return "opacity-50";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hint Pe Hint</h1>
          <div className="flex items-center gap-4">
            {/* Charity Coins Display */}
            {user && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full shadow-lg">
                <Coins className="w-5 h-5" />
                <span className="font-bold text-lg">{user.charityCoins ?? 0}</span>
                <span className="text-sm">Charity Coins</span>
              </div>
            )}
            {user && (
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </span>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>

          {/* Progress Bar */}
          <div className="mb-8 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Progress</h3>
              <span className="text-lg font-bold text-primary">{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-3" />
          </div>

          {gameCompleted ? (
            // Game Completed Screen
            <div className="text-center space-y-6 py-12">
              <h2 className="text-5xl font-bold text-green-600">🎉 Congratulations! 🎉</h2>
              <p className="text-2xl">You've completed the Trial Book!</p>
              <p className="text-xl text-muted-foreground">
                You earned a total of {user?.charityCoins || 0} Charity Coins
              </p>
              <Button 
                size="lg"
                onClick={handleBack}
                className="mt-8"
              >
                Back to Book Selection
              </Button>
            </div>
          ) : (
            // Game Play Screen
            <>
              {/* Round and Hint Display */}
              <div className="mb-8 text-center space-y-4">
                <h2 className="text-4xl font-bold">
                  Round {GAME_DATA.rounds[currentRound].roundNumber}
                </h2>
                <div className="bg-card border-2 border-primary rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">
                    Hint {currentHint + 1}:
                  </h3>
                  <p className="text-2xl">
                    {GAME_DATA.rounds[currentRound].hints[currentHint]}
                  </p>
                </div>
                
                {/* Next Hint / Reveal Answer Button */}
                <div className="flex justify-center">
                  {currentHint < 2 ? (
                    <Button
                      onClick={handleNextHint}
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      disabled={isRevealed}
                    >
                      Next hint
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRevealAnswer}
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      disabled={isRevealed}
                    >
                      Reveal answer
                    </Button>
                  )}
                </div>
              </div>

              {/* Answer Boxes Grid (3x4) */}
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                {GAME_DATA.answers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={selectedAnswer !== null || isRevealed}
                    className={`h-24 text-lg font-semibold transition-all ${getAnswerStyle(index)}`}
                    variant="outline"
                  >
                    {answer}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrialBookGame;
