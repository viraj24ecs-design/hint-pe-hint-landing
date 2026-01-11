import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Coins, ArrowLeft, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import correctSound from "@/assets/correct-6033.mp3";
import wrongSound from "@/assets/wrong.mp3";





const preloadImages = [
  "/VishalPics/VishalBG.webp",
  "/VishalPics/VishalCongrats.webp",
  "/VishalPics/vishalCorrectAns.webp",
  "/VishalPics/VishalIncorrectAns.webp",
  "/VishalPics/VishalSad.webp",
];

const preload = ()=> {
  preloadImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

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
  imagePath: "/How-To-Bring-Self-Discipline-To-Exercise.jpg", // Single image for entire game (2:3 aspect ratio, 1024x1536px) - served from public folder
  rounds: [
    {
      roundNumber: 1,
      hint: "Think you're too busy to exercise? This law says skipping workouts steals time, not saves it. Without exercise, your brain drains fast—foggy focus means wasted hours. But just 30 min daily movement for 5 days (2.5 hrs total) boosts productivity so much you gain 7.5 hours of sharp focus weekly. Net gain: 5 extra hours! Exercise isn't a time cost—it's a time multiplier. Move a little, gain a lot. Your future self will thank you!",
      correctButtonId: 4, // Button 1 (ID 0) is correct in round 1
    },
    {
      roundNumber: 2,
      hint: "Planning perfect workouts—6 days/week, no cheat meals? The P of Perfectionism kills motivation! Miss one day and you feel like a failure, so you quit. Look for P of Persistence. Aim for \"good enough\"—20 min most days beats zero. Life brings headaches, soreness, bad sleep. Perfection says \"all or nothing\" and makes you crash. Persistence says \"some beats none\" and builds real habits. Ditch flawless dreams. Embrace messy, consistent action—that's how you win..",
      correctButtonId: 0, // Button 2 (ID 1) is correct in round 2
    },
    {
      roundNumber: 3,
      hint: "Postponing workouts? Make NOT exercising more awkward than doing it! Sleep in workout clothes—you're dressed when the alarm rings, easier to move than change back. Place your alarm across the room—standing up kills inertia, might as well exercise. Public commitment is nuclear: announce your plan to friends. Skip it? Face their teasing for weeks! Discomfort beats laziness. Make procrastination uncomfortable, and discipline becomes easy.",
      correctButtonId: 9, // Button 3 (ID 2) is correct in round 3
    },
    {
      roundNumber: 4,
      hint: "Author positions physical excellence as the foundational habit that positively influences all other areas of life. Unlike other self-discipline targets, exercise builds a “reserve of discipline” that transfers to other domains like work, relationships, and personal projects. The reasoning is captured in the phrase “without a healthy body, nothing else matters” - physical fitness provides the energy and mental resilience that makes tackling all other goals significantly easier.",
      correctButtonId: 6, // Button 4 (ID 3) is correct in round 4
    },
    {
      roundNumber: 5,
      hint: "Think “play,” not punishment. If workouts feel like torture, you won’t stick with them. Choose fun movement that excites you—dance, sport, parkour, cycling, anything that makes time fly. When exercise feels like joy, not grind, your brain wants more and habits become automatic. Ditch “no pain, no gain.” Pick activities that make you smile, sweat, and say, “Let’s do that again tomorrow!”.",
      correctButtonId: 3, // Button 5 (ID 4) is correct in round 5
    },
    {
      roundNumber: 6,
      hint: "Ever pumped yourself up for exercise with dreams of Hritik Roshan’s six pack abs? Martin Meadows warns about this fallacy — that sneaky trap where fantasy feels so good, you never actually start! You get a motivation high from imagining the win, but skip the sweat. I will start exercising from 1st of the next month.",
      correctButtonId: 1, // Button 6 (ID 5) is correct in round 6
    },
    {
      roundNumber: 7,
      hint: "The book reveals that the most common type of motivation people use to exercise is usually ineffective. Meadows distinguishes between external rewards like appearance, praise, weight loss and internal desires like feeling energized, enjoying movement, personal growth. While external factors work temporarily, they create fragile commitment that collapses when results plateau or life gets busy. Inner burning desire produces sustainable, fulfilling outcomes because it fosters deeper connection to the activity itself.",
      correctButtonId: 8, // Button 7 (ID 6) is correct in round 7
    },
    {
      roundNumber: 8,
      hint: "Planning rest and recovery is an essential discipline technique, not a weakness. Planning rewards after long workouts or scheduling complete rest days actually strengthens exercise adherence by preventing burnout and overtraining. This reframes rest from “cheating” to strategic recovery, making the overall routine sustainable. By building rest and recovery into the plan rather than taking it as failure, practitioners maintain psychological momentum even during breaks.",
      correctButtonId: 5, // Button 8 (ID 7) is correct in round 8
    },
    {
      roundNumber: 9,
      hint: "Struggling to fit in workouts? Use this idea: attach tiny exercises to routines you already do. After brushing, do 10 push-ups. While sipping morning coffee, add 5 minutes of stretches. After dinner, take a 15-minute walk listening to audio summaries. Existing habits become automatic triggers, so you skip motivation battles. Your daily routines turn into stealth workout launchpads.",
      correctButtonId: 7, // Button 9 (ID 8) is correct in round 9
    },
    {
      roundNumber: 10,
      hint: "Some people exercise consistently because they have this mindset: the tiniest workout that still counts. No 1-hour blasts—just 2–3 minutes that feel “too easy to skip.” Five squats and ten jumping jacks after brushing, or three deep breaths plus one surya namaskar post-chai. Small wins beat huge plans that die in a week. Tiny, consistent effort builds momentum, then naturally grows over time.",
      correctButtonId: 2, // Button 10 (ID 9) is correct in round 10
    },
  ],
};

// All 10 buttons with their text - you can edit these
const ALL_BUTTONS = [
  { id: 0, text: "Wrong P Right P" },
  { id: 1, text: "False Hope Syndrome" },
  { id: 2, text: "Minimum Effective Dose" },
  { id: 3, text: "Excercise without \"work\"" },
  { id: 4, text: "Time Loss Paradox" },
  { id: 5, text: "Scheduled Recovery" },
  { id: 6, text: "Keystone Habit Foundation" },
  { id: 7, text: "Habit Stacking" },
  { id: 8, text: "Intrinsic Motivation" },
  { id: 9, text: "Uncomfortable Procrastination trick" },
];

const TrialBookGame = () => {
  const { user, logout, updateBookProgress, updateCoins, refreshUser } = useAuth();
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
  
  // Sync displayCoins with user's actual coins from backend
  useEffect(() => {
    if (user?.charityCoins !== undefined) {
      setDisplayCoins(user.charityCoins);
    }
  }, [user?.charityCoins]);
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [showVignette, setShowVignette] = useState(false);
  const [correctButtonId, setCorrectButtonId] = useState<number | null>(null);
  const [shakingButtonId, setShakingButtonId] = useState<number | null>(null);
  
  // Dialog states
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true); // Welcome popup on game start
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [animatedCoins, setAnimatedCoins] = useState(0); // For count-up animation
  const [isSavingCoins, setIsSavingCoins] = useState(false); // Prevent multiple clicks on "Back to Book Selection"
  
  // Scroll tracking for hint box
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollThumbHeight, setScrollThumbHeight] = useState(33); // percentage
  const hintRef = useRef<HTMLParagraphElement>(null);
  
  // Handle scroll event for custom scrollbar
  const handleHintScroll = (e: React.UIEvent<HTMLParagraphElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    if (scrollHeight > clientHeight) {
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      const thumbHeight = (clientHeight / scrollHeight) * 100;
      setScrollPosition(scrollPercent);
      setScrollThumbHeight(thumbHeight);
    }
  };
  
  // Guest user state

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
    // Exit WITHOUT saving coins - coins revert to original value
    // User chose to quit mid-game, so no coins are saved
    navigate("/");
  };

  // Handler for "Back to Book Selection" button on completion screen
  // This is where coins get saved to backend
  const handleBackToBooks = async () => {
    // Prevent multiple clicks
    if (isSavingCoins) return;
    setIsSavingCoins(true);
    
    if (!isGuest && tempCoinsEarned !== 0) {
      try {
        // Save all coins earned in this session to backend
        const result = await updateCoins(tempCoinsEarned);
        if (result.success) {
          console.log(`✅ Successfully saved ${tempCoinsEarned} coins to backend`);
          // Refresh user data to get latest coins from backend
          await refreshUser();
          toast({
            title: "Coins Saved!",
            description: `${tempCoinsEarned} Charity Coins have been added to your account.`,
          });
        } else {
          console.error('❌ Failed to save coins:', result.error);
          toast({
            title: "Warning",
            description: "Coins may not have been saved. Please check your connection.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('❌ Error saving coins:', error);
        toast({
          title: "Error",
          description: "Failed to save your coins. Please try again.",
          variant: "destructive",
        });
      }
    }
    navigate("/");
  };

  // Count-up animation for coins when game is completed
  useEffect(() => {
    if (gameCompleted && tempCoinsEarned > 0) {
      const duration = 2500; // 2.5 seconds animation
      const steps = 60; // 60 frames for smooth animation
      const increment = tempCoinsEarned / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedCoins(tempCoinsEarned);
          clearInterval(timer);
        } else {
          setAnimatedCoins(Math.floor(increment * currentStep));
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [gameCompleted, tempCoinsEarned]);

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

    // Show feedback with Vishal image - custom layout with image on left
    toast({
      title: "", // Empty title to prevent it from showing above
      description: (
        <div className="flex items-center gap-2 -ml-4">
          <img 
            src={isCorrect ? "/VishalPics/vishalCorrectAns.webp" : "/VishalPics/VishalIncorrectAns.webp"} 
            alt={isCorrect ? "Correct" : "Incorrect"}
            className="w-56 h-56 object-contain flex-shrink-0"
          />
          <div className="flex flex-col -ml-4">
            <span className="text-base font-bold">
              {isCorrect ? "Correct! 🎉" : "Incorrect ❌"}
            </span>
            <span className="text-sm">
              {`${coinsChange > 0 ? '+' : ''}${coinsChange} Charity Coins`}
            </span>
          </div>
        </div>
      ) as any,
      variant: isCorrect ? "default" : "destructive",
      duration: 1000, // 1 second
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
      // Game completed - just show completion screen
      // Coins will be saved when user clicks "Back to Book Selection"
      setGameCompleted(true);
      
      if (!isGuest) {
        try {
          // Update progress to 100%
          await updateBookProgress(bookId, 100);
        } catch (error) {
          console.error('❌ Error updating progress:', error);
        }
      }
      
      // Game is now completed - congratulations screen will show automatically
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
    <div className="h-screen bg-background flex flex-col overflow-hidden relative overscroll-none" style={{ height: '100dvh', overscrollBehavior: 'none' }}>
      {/* Welcome Dialog - Shown at game start */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          {/* Close button */}
          <button
            onClick={() => setShowWelcomeDialog(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
          
          <div className="flex flex-col sm:flex-row">
            {/* Left side - Image */}
            <div className="w-full sm:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
              <img 
                src="/VishalPics/VishalSad.webp" 
                alt="Vishal needs help" 
                className="w-full h-auto max-w-[250px] object-contain"
              />
            </div>
            
            {/* Right side - Text */}
            <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                  Uh-Oh! Vishal needs your help!
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-3">
                  Answer correctly to help him
                </p>
                <p className="text-sm sm:text-base text-gray-600 italic">
                  If you win this game there is a small surprise for you in the end!
                </p>
              </div>
              
              <Button 
                onClick={() => setShowWelcomeDialog(false)}
                className="w-full sm:w-auto"
                size="lg"
              >
                Let's Help Vishal!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
            // Game Completed Screen - Embedded Congratulations Content
            <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
              {/* Vishal Congratulations Image Section */}
              <div className="w-full bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4 sm:p-6 md:p-8 flex-shrink-0">
                <img 
                  src="/VishalPics/VishalCongrats.webp" 
                  alt="Congratulations" 
                  className="w-full h-auto max-w-[200px] sm:max-w-[300px] md:max-w-[400px] object-contain rounded-xl sm:rounded-2xl shadow-lg"
                  style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))' }}
                />
              </div>
              
              {/* Content Section - Scrollable */}
              <div className="px-4 py-4 sm:px-6 sm:py-6 md:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-4 md:space-y-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600">
                  🎉 Congratulations! 🎉
                </h2>
                
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">
                    Thank you for helping Vishal!
                  </p>
                  <p className="text-sm sm:text-lg md:text-xl text-gray-700">
                    This is the book he wishes you should read
                  </p>
                </div>
                
                {/* Animated Coins Counter */}
                <div className="py-2 sm:py-4 md:py-6">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-600">
                    You earned {animatedCoins} Charity Coins!
                  </p>
                </div>
                
                {/* Additional Info */}
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 max-w-2xl px-4">
                  <p>
                    Thank you for playing Hint Pe Hint and helping Vishal. Your correct answers have not only earned you Charity Coins but have also made a positive impact!
                  </p>
                  <p className="font-semibold text-green-600 text-base sm:text-lg">
                    Your knowledge helped the needy one! Keep it up!
                  </p>
                </div>

                {/* Guest User Sign Up Prompt */}
                {isGuest && (
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 sm:p-5 max-w-md w-full">
                    <p className="text-sm sm:text-base text-gray-700 mb-3">
                      💡 <span className="font-semibold">Sign up now</span> to save your coins and track your progress!
                    </p>
                    <Button 
                      size="lg"
                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                      onClick={() => {
                        setShowAuthDialog(true);
                      }}
                    >
                      Sign Up / Log In
                    </Button>
                  </div>
                )}
                
                {/* Amazon Link */}
                <div className="pt-3 sm:pt-4 md:pt-6">
                  <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">
                    Click on this affiliated link to buy this book
                  </p>
                  <a 
                    href="https://www.amazon.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-base sm:text-lg md:text-xl font-medium"
                  >
                    Amazon Link
                  </a>
                </div>
                
                {/* Continue Button */}
                <Button 
                  size="lg"
                  className="mt-4 sm:mt-6 px-8 sm:px-10 md:px-12 py-6 text-base sm:text-lg"
                  onClick={handleBackToBooks}
                  disabled={isSavingCoins}
                >
                  {isSavingCoins ? "Saving..." : "Back to Book Selection"}
                </Button>
              </div>
            </div>
          ) : (
            // Game Play Screen - Flexbox layout with proper scaling
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Round and Hint Display - Takes available space */}
              <div className="flex-shrink-0 text-center mb-1 sm:mb-2 px-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
                  Concept {GAME_DATA.rounds[currentRound].roundNumber}
                </h2>
                <div className="bg-card border-2 border-primary rounded-lg p-3 sm:p-4 md:p-5 shadow-lg">
                  <div className="relative">
                    <p 
                       ref={hintRef}
                       onScroll={handleHintScroll}
                       className="text-sm sm:text-base md:text-lg leading-relaxed break-words max-h-[18vh] overflow-y-auto pr-4 sm:pr-2 overscroll-contain touch-pan-y"
                       style={{
                         scrollbarWidth: 'thin',
                         scrollbarColor: '#374151 #e5e7eb',
                         WebkitOverflowScrolling: 'touch',
                         overscrollBehavior: 'contain'
                       }}>
                      {GAME_DATA.rounds[currentRound].hint}
                    </p>
                    {/* Dynamic scroll indicator bar for mobile */}
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-300 rounded-full sm:hidden">
                      <div 
                        className="w-full bg-gray-800 rounded-full transition-all duration-100"
                        style={{
                          height: `${scrollThumbHeight}%`,
                          transform: `translateY(${scrollPosition * ((100 - scrollThumbHeight) / 100)}%)`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Reveal Box with Buttons - 2:3 Aspect Ratio (Portrait) - With scrolling if needed */}
              <div className="flex-1 flex items-center justify-center px-2 sm:px-4 pb-2 min-h-0 w-full overflow-y-auto overflow-x-hidden">
                <div 
                  className="relative border-4 border-black rounded-2xl shadow-lg overflow-hidden my-auto game-container" 
                  style={{ 
                    aspectRatio: '2/3',
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
                            text-[14px] xs:text-[15px] sm:text-sm md:text-base font-bold 
                            transition-all duration-300 
                            flex items-center justify-center 
                            border border-black
                            disabled:cursor-not-allowed
                            ${button.id === 0 ? 'rounded-tl-xl' : ''}
                            ${button.id === 1 ? 'rounded-tr-xl' : ''}
                            ${button.id === 8 ? 'rounded-bl-xl' : ''}
                            ${button.id === 9 ? 'rounded-br-xl' : ''}`}
                        >
                          <span className="line-clamp-2 px-1 sm:px-2">{button.text}</span>
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
