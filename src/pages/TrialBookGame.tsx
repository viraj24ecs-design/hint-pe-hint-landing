import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Coins, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import AuthDialog from "@/components/AuthDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import correctSound from "@/assets/correct-6033.mp3";
import wrongSound from "@/assets/wrong.mp3";

// Confetti configuration
const createConfetti = () => {
  const confettiCount = 100; // 2x increase from 50 to 100
  const confetti = [];
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493'];
  
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 0.5,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      transform: `rotate(${Math.random() * 360}deg)`,
    });
  }
  return confetti;
};

// Game data structure - 10 buttons total, each round reveals one more
// Round 1: Button 1 is correct (button ID 0)
// Round 2: Button 2 is correct (button ID 1)
// ... and so on
// Buttons that are answered correctly disappear FOREVER and never come back in future rounds

const GAME_DATA = {
  imagePath: "/VishalBG.PNG", // Single image for entire game (2:3 aspect ratio, 1024x1536px) - served from public folder
  rounds: [
    {
      roundNumber: 1,
      hint: "This is hint for round 1. Edit this text to your actual hint.",
      correctButtonId: 0, // Button 1 (ID 0) is correct in round 1
    },
    {
      roundNumber: 2,
      hint: "This is hint for round 2. Edit this text to your actual hint.",
      correctButtonId: 1, // Button 2 (ID 1) is correct in round 2
    },
    {
      roundNumber: 3,
      hint: "This is hint for round 3. Edit this text to your actual hint.",
      correctButtonId: 2, // Button 3 (ID 2) is correct in round 3
    },
    {
      roundNumber: 4,
      hint: "This is hint for round 4. Edit this text to your actual hint.",
      correctButtonId: 3, // Button 4 (ID 3) is correct in round 4
    },
    {
      roundNumber: 5,
      hint: "This is hint for round 5. Edit this text to your actual hint.",
      correctButtonId: 4, // Button 5 (ID 4) is correct in round 5
    },
    {
      roundNumber: 6,
      hint: "This is hint for round 6. Edit this text to your actual hint.",
      correctButtonId: 5, // Button 6 (ID 5) is correct in round 6
    },
    {
      roundNumber: 7,
      hint: "This is hint for round 7. Edit this text to your actual hint.",
      correctButtonId: 6, // Button 7 (ID 6) is correct in round 7
    },
    {
      roundNumber: 8,
      hint: "This is hint for round 8. Edit this text to your actual hint.",
      correctButtonId: 7, // Button 8 (ID 7) is correct in round 8
    },
    {
      roundNumber: 9,
      hint: "This is hint for round 9. Edit this text to your actual hint.",
      correctButtonId: 8, // Button 9 (ID 8) is correct in round 9
    },
    {
      roundNumber: 10,
      hint: "This is hint for round 10. Edit this text to your actual hint.",
      correctButtonId: 9, // Button 10 (ID 9) is correct in round 10
    },
  ],
};

// All 10 buttons with their text - you can edit these
const ALL_BUTTONS = [
  { id: 0, text: "Answer 1" },
  { id: 1, text: "Answer 2" },
  { id: 2, text: "Answer 3" },
  { id: 3, text: "Answer 4" },
  { id: 4, text: "Answer 5" },
  { id: 5, text: "Answer 6" },
  { id: 6, text: "Answer 7" },
  { id: 7, text: "Answer 8" },
  { id: 8, text: "Answer 9" },
  { id: 9, text: "Answer 10" },
];

const TrialBookGame = () => {
  const { user, logout, updateBookProgress, updateCoins } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const bookId = "trialBook";
  const currentProgress = user?.bookProgress?.trialBook || 0;

  // Game state
  const [currentRound, setCurrentRound] = useState(0);
  const [poppedButtons, setPoppedButtons] = useState<number[]>([]); // Buttons that have disappeared forever
  const [wrongButtons, setWrongButtons] = useState<number[]>([]); // Buttons marked as wrong in current round
  const [isProcessing, setIsProcessing] = useState(false); // Prevent clicks during animation
  const [gameCompleted, setGameCompleted] = useState(false);
  const [clickedButtonId, setClickedButtonId] = useState<number | null>(null); // Instant feedback on click
  
  // Temporary coins tracking (frontend only during gameplay)
  const [tempCoinsEarned, setTempCoinsEarned] = useState(0); // Coins earned in this session
  const [displayCoins, setDisplayCoins] = useState(user?.charityCoins ?? 0); // What user sees in UI
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [showVignette, setShowVignette] = useState(false);
  const [correctButtonId, setCorrectButtonId] = useState<number | null>(null);
  const [shakingButtonId, setShakingButtonId] = useState<number | null>(null);
  
  // Guest user state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const isGuest = !user;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBack = () => {
    // Show warning dialog before exiting
    setShowExitWarning(true);
  };

  const handleExitConfirm = () => {
    setShowExitWarning(false);
    navigate("/");
  };

  // Play sound effect
  const playSound = (type: 'correct' | 'wrong') => {
    try {
      if (type === 'correct') {
        // Play the charm sound from assets
        const audio = new Audio(correctSound);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio playback failed:', e));
      } else {
        // Play the wrong answer sound from assets
        const audio = new Audio(wrongSound);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio playback failed:', e));
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const handleButtonClick = async (buttonId: number) => {
    // Don't allow clicking if processing or if this button was already marked wrong
    if (isProcessing || wrongButtons.includes(buttonId)) return;

    // INSTANT FEEDBACK: Show black background with white text immediately
    setClickedButtonId(buttonId);

    const correctBtnId = GAME_DATA.rounds[currentRound].correctButtonId;
    const isCorrect = buttonId === correctBtnId;

    // Prevent further clicks during animation
    setIsProcessing(true);

    // Small delay to show the clicked state before processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // New scoring system: +60 for correct, -20 for wrong
    const coinsChange = isCorrect ? 60 : -20;

    // Update temporary coins (frontend only, no backend call)
    setTempCoinsEarned(prev => prev + coinsChange);
    setDisplayCoins(prev => Math.max(0, prev + coinsChange));

    // Show feedback
    toast({
      title: isCorrect ? "Correct! 🎉" : "Incorrect ❌",
      description: `${coinsChange > 0 ? '+' : ''}${coinsChange} Charity Coins`,
      variant: isCorrect ? "default" : "destructive",
    });

    // If correct, show confetti and pop animation
    if (isCorrect) {
      // Play success sound
      playSound('correct');
      
      // Show button as green
      setClickedButtonId(null);
      setCorrectButtonId(buttonId);
      
      // Trigger confetti after 300ms
      setTimeout(() => {
        setShowConfetti(true);
      }, 300);
      
      // Pop button and hide confetti after animation
      setTimeout(() => {
        setPoppedButtons(prev => [...prev, buttonId]);
        setShowConfetti(false);
        setCorrectButtonId(null);
        
        // Move to next round after button pops
        setTimeout(() => {
          moveToNextRound();
        }, 500);
      }, 1500); // Total animation time
    } else {
      // If wrong, show vignette effect and shake button
      playSound('wrong');
      setClickedButtonId(null);
      setShowVignette(true);
      setShakingButtonId(buttonId);
      setWrongButtons(prev => [...prev, buttonId]);
      
      // Remove effects after 1 second
      setTimeout(() => {
        setShowVignette(false);
        setShakingButtonId(null);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const moveToNextRound = async () => {
    if (currentRound < GAME_DATA.rounds.length - 1) {
      // Move to next round
      setCurrentRound(currentRound + 1);
      setWrongButtons([]); // Reset wrong buttons for new round
      setIsProcessing(false);

      // Update progress only for logged-in users
      if (!isGuest) {
        const newProgress = Math.min(100, ((currentRound + 1) / GAME_DATA.rounds.length) * 100);
        await updateBookProgress(bookId, newProgress);
      }
    } else {
      // Game completed - NOW update backend with all coins earned
      setGameCompleted(true);
      
      if (!isGuest) {
        // Update progress to 100%
        await updateBookProgress(bookId, 100);
        
        // Update coins in backend (single call with total earned)
        if (tempCoinsEarned !== 0) {
          await updateCoins(tempCoinsEarned);
        }
        
        toast({
          title: "🎉 Congratulations!",
          description: `You've completed the Trial Book and earned ${tempCoinsEarned} Charity Coins!`,
        });
      } else {
        // Show login prompt for guest users
        setShowLoginPrompt(true);
      }
    }
  };

  const getButtonStyle = (buttonId: number) => {
    // INSTANT FEEDBACK: Show black background with white text when clicked
    if (clickedButtonId === buttonId) {
      return "bg-black text-white border-black";
    }
    
    // Check if this is the correct button being shown as green
    if (correctButtonId === buttonId) {
      return "bg-green-500 text-white border-green-600 animate-pulse";
    }
    
    // Check if this button was marked as wrong
    if (wrongButtons.includes(buttonId)) {
      const isShaking = shakingButtonId === buttonId;
      return `bg-red-500 text-white border-red-600 ${isShaking ? 'animate-shake' : ''}`;
    }
    
    return "bg-white border-2 border-gray-800 hover:bg-gray-100";
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative" style={{ height: '100dvh' }}>
      {/* Red Vignette Effect for Wrong Answer */}
      {showVignette && (
        <div 
          className="fixed inset-0 pointer-events-none z-50 animate-vignette"
          style={{
            background: 'radial-gradient(circle, transparent 30%, rgba(220, 38, 38, 0.6) 100%)',
          }}
        />
      )}
      
      {/* Confetti Animation for Correct Answer */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {createConfetti().map((conf) => (
            <div
              key={conf.id}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${conf.left}%`,
                top: '-10px',
                backgroundColor: conf.backgroundColor,
                animationDelay: `${conf.animationDelay}s`,
                transform: conf.transform,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Fixed Header - Compact */}
      <header className="bg-background border-b shadow-sm flex-shrink-0">
        <div className="container mx-auto px-2 sm:px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBack}
              className="flex items-center p-1 sm:p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-sm sm:text-xl font-bold">Hint Pe Hint</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Charity Coins Display - Compact */}
            <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
              <Coins className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="font-bold text-xs sm:text-lg">{displayCoins}</span>
              <span className="text-xs hidden sm:inline">Coins</span>
            </div>
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
                Logout
              </Button>
            ) : (
              <Button size="sm" onClick={() => setShowAuthDialog(true)} className="text-xs sm:text-sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Fills remaining space with proper overflow handling */}
      <main className="flex-1 flex flex-col overflow-hidden px-2 sm:px-4 py-2 sm:py-3 min-h-0">
        <div className="flex flex-col h-full max-w-6xl mx-auto w-full min-h-0">
          {/* Progress Bar - Compact */}
          <div className="flex-shrink-0 mb-1 sm:mb-2">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs sm:text-sm font-semibold">Progress</h3>
              <span className="text-xs sm:text-sm font-bold text-primary">
                {isGuest ? Math.round(((currentRound + 1) / GAME_DATA.rounds.length) * 100) : currentProgress}%
              </span>
            </div>
            <Progress 
              value={isGuest ? ((currentRound + 1) / GAME_DATA.rounds.length) * 100 : currentProgress} 
              className="h-1 sm:h-2" 
            />
          </div>

          {gameCompleted ? (
            // Game Completed Screen
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl font-bold text-green-600">🎉 Congratulations! 🎉</h2>
              <p className="text-lg sm:text-xl">You've completed the Trial Book!</p>
              <p className="text-base sm:text-lg text-muted-foreground">
                You earned {tempCoinsEarned} Charity Coins in this game!
              </p>
              <Button 
                size="lg"
                onClick={handleBack}
              >
                Back to Book Selection
              </Button>
            </div>
          ) : (
            // Game Play Screen - Flexbox layout with proper scaling
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Round and Hint Display - Takes available space */}
              <div className="flex-shrink-0 text-center mb-1 sm:mb-2 px-2">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2">
                  Round {GAME_DATA.rounds[currentRound].roundNumber}
                </h2>
                <div className="bg-card border-2 border-primary rounded-lg p-2 sm:p-3 md:p-4 shadow-lg">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-1">
                    Hint:
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm leading-tight break-words max-h-[15vh] overflow-y-auto">
                    {GAME_DATA.rounds[currentRound].hint}
                  </p>
                </div>
              </div>

              {/* Image Reveal Box with Buttons - 2:3 Aspect Ratio (Portrait) - With scrolling if needed */}
              <div className="flex-1 flex items-center justify-center px-2 sm:px-4 pb-2 min-h-0 w-full overflow-y-auto overflow-x-hidden">
                <div 
                  className="relative border-4 border-black rounded-2xl shadow-lg overflow-hidden my-auto" 
                  style={{ 
                    aspectRatio: '2/3',
                    width: 'min(400px, 90vw)',
                    height: 'auto',
                  }}
                >
                  {/* Background Image */}
                  <img 
                    src={GAME_DATA.imagePath}
                    alt="Game Image"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Button Grid Overlay - 5 rows x 2 columns = 10 buttons */}
                  <div className="absolute inset-0 grid grid-rows-5 grid-cols-2 gap-0">
                    {ALL_BUTTONS.map((button) => {
                      const isPopped = poppedButtons.includes(button.id);
                      
                      // Don't render popped buttons - they disappear forever, revealing the image
                      if (isPopped) {
                        return <div key={button.id} className="pointer-events-none" />;
                      }
                      
                      return (
                        <button
                          key={button.id}
                          onClick={() => handleButtonClick(button.id)}
                          disabled={isProcessing || wrongButtons.includes(button.id)}
                          className={`${getButtonStyle(button.id)} 
                            text-[7px] xs:text-[8px] sm:text-xs md:text-sm font-bold 
                            transition-all duration-300 
                            flex items-center justify-center 
                            border border-black
                            disabled:cursor-not-allowed
                            ${button.id === 0 ? 'rounded-tl-xl' : ''}
                            ${button.id === 1 ? 'rounded-tr-xl' : ''}
                            ${button.id === 8 ? 'rounded-bl-xl' : ''}
                            ${button.id === 9 ? 'rounded-br-xl' : ''}`}
                        >
                          <span className="line-clamp-2 px-0.5 sm:px-1">{button.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Login Prompt for Guest Users */}
      <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎉 Game Completed!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-lg">
                Congratulations! You've earned <span className="font-bold text-yellow-600">{tempCoinsEarned} Charity Coins</span>
              </p>
              <p>
                Would you like to log in to save these coins to your account? 
                If you don't have an account, you can sign up now!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={() => {
                setShowLoginPrompt(false);
                navigate("/");
              }}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Maybe Later
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowLoginPrompt(false);
                setShowAuthDialog(true);
              }}
            >
              Log In / Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Warning Dialog */}
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Already chickening out?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will not be saved!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={handleExitConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Exit
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => setShowExitWarning(false)}
              className="bg-green-500 hover:bg-green-600"
            >
              No, I wanna play more
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auth Dialog */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => {
          setShowAuthDialog(false);
          toast({
            title: "Welcome!",
            description: `Your ${tempCoinsEarned} coins have been noted. Start a new game to earn more!`,
          });
        }}
      />
    </div>
  );
};

export default TrialBookGame;
