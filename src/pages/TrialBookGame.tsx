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
        "Hint 1: Great for prioritizing important tasks.",
        "Hint 2: Varsha runs an E-Laundry startup in Pune. She found that only a few of her customers contribute to majority of her revenue.",
        "Hint 3: This is the 80/20 rule where a few causes lead to most outcomes.",
      ],
      correctAnswerIndex: 4, // Index of correct answer in answers array (0-11)
    },
    {
      roundNumber: 2,
      hints: [
        "Hint 1: The mind’s power plays a huge role in healing.",
        "Hint 2: When Amir Khan says \"All is Well\" in 3 idiots, he is trying to create this effect",
        "Hint 3: A doctor gave sugar pills instead of real medicines to his patients",
      ],
      correctAnswerIndex: 0,
    },
    {
      roundNumber: 3,
      hints: [
        "Hint 1: Are u binge watching on Netflix? Then welcome to quadrant 4",
        "Hint 2: Is it urgent? is it important?",
        "Hint 3: Delegate quadrant 3, delete quadrant 4",
      ],
      correctAnswerIndex: 9,
    },
    {
      roundNumber: 4,
      hints: [
        "Hint 1: Named after the Italian word for tomato.",
        "Hint 2: Katrina, a designer in Chennai, used to get distracted by WA and youtube while working on her designs. now she works for 25 minutes non-stop, then takes 5-minute breaks.",
        "Hint 3: Katrina is now thankful to the kitchen timer.",
      ],
      correctAnswerIndex: 6,
    },
    {
      roundNumber: 5,
      hints: [
        "Hint 1: A small focus leads to most success.",
        "Hint 2: Why check off all the items on your to-do list when only a few can take care of all!",
        "Hint 3: Your phone may have 60 apps, but you use only 15",
      ],
      correctAnswerIndex: 4,
    },
    {
      roundNumber: 6,
      hints: [
        "Hint 1: I never forget to wear night dress before bed. I always forget to do my night brushing.",
        "Hint 2: So I keep the toothbrush in the pocket of my night dress",
        "Hint 3: A concept from James Clear's Atomic Habits.",
      ],
      correctAnswerIndex: 1,
    },
    {
      roundNumber: 7,
      hints: [
        "Hint 1: After BahubaIi 1, we desperately waited for years to know \"Kattapa ne bahubali ko kyu mara\"",
        "Hint 2: Because Bahubali 1 was an incomplete story",
        "Hint 3: It’s difficult to recollect an answer just 1 week after the exams are over",
      ],
      correctAnswerIndex: 3,
    },
    {
      roundNumber: 8,
      hints: [
        "Hint 1: Venky says to himself \"I will read 1 page everyday\" instead of saying \"I will read 4 books a month\"",
        "Hint 2: Jeff Olson has written the book of the same name",
        "Hint 3: This slight advantage of saving Rs.500 every month made him a crorepati in 20 years",
      ],
      correctAnswerIndex: 5,
    },
    {
      roundNumber: 9,
      hints: [
        "Hint 1: Metaphor for trust and goodwill.",
        "Hint 2: Your wife will love you 10 times more if you invest in it",
        "Hint 3: Used in Stephen Covey’s 7 Habits of Highly Effective People.",
      ],
      correctAnswerIndex: 7,
    },
    {
      roundNumber: 10,
      hints: [
        "Hint 1: Sunita, a wildlife photographer in Kerala, found her purpose of life where her passion met mission and profession.",
        "Hint 2: Guides many in finding life’s true purpose.",
        "Hint 3: It’s a Japanese word",
      ],
      correctAnswerIndex: 11,
    },
  ],
  answers: [
    "Placebo Effect", //round 2            b0         q2
    "Habit Stacking", //round 6            b1         q6
    "xyz", //round x                       b2         qx
    "Zeigarnik Effect", //round 1 and 5    b3         q7
    "Pareto Principle", //         b4         q5 & q1
    "The Slight Edge", //         b5         q8
    "Pomodoro Technique", //round 4        b6         q4
    "Emotional Bank Account", //         b7         q9
    "xyz", //         b8         qx
    "Eisenhower Matrix", //round 3         b9         q3
    "xyz", //       b10        qx
    "Ikigai", //       b11        q10
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
    
    // Move to next round after 1 second
    setTimeout(() => {
      moveToNextRound();
    }, 1000);
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

    // Move to next round after 1 second
    setTimeout(() => {
      moveToNextRound();
    }, 1000);
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
