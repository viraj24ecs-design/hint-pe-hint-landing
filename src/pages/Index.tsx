import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TrialBookImg from "@/assets/TrialBook.png";
import RichDadPoorDadImg from "@/assets/RichDadPoorDad.png";
import AtomicHabitsImg from "@/assets/AtomicHabits.png";
import CharityCoinsIcon from "@/assets/Charitycoins.png";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showCoinsDialog, setShowCoinsDialog] = useState(false);

  const books = [
    {
      id: "trialBook",
      title: "Trial Book",
      image: TrialBookImg,
      route: "/game/trial-book",
      progress: user?.bookProgress?.trialBook || 0,
      isLocked: false,
      requiresLogin: false,
    },
    {
      id: "richDadPoorDad",
      title: "Rich Dad Poor Dad",
      image: RichDadPoorDadImg,
      route: "/game/rich-dad-poor-dad",
      progress: user?.bookProgress?.richDadPoorDad || 0,
      isLocked: false, // Always unlocked
      requiresLogin: !user, // But requires login if not logged in
    },
    {
      id: "atomicHabits",
      title: "Atomic Habits",
      image: AtomicHabitsImg,
      route: "/game/atomic-habits",
      progress: user?.bookProgress?.atomicHabits || 0,
      isLocked: false, // Always unlocked
      requiresLogin: !user, // But requires login if not logged in
    },
    {
      id: "book4",
      title: "Book 4",
      image: TrialBookImg, // Placeholder image - you'll change this later
      route: "/game/book-4",
      progress: user?.bookProgress?.book4 || 0,
      isLocked: false,
      requiresLogin: !user,
    },
    {
      id: "book5",
      title: "Book 5",
      image: RichDadPoorDadImg, // Placeholder image - you'll change this later
      route: "/game/book-5",
      progress: user?.bookProgress?.book5 || 0,
      isLocked: false,
      requiresLogin: !user,
    },
    {
      id: "book6",
      title: "Book 6",
      image: AtomicHabitsImg, // Placeholder image - you'll change this later
      route: "/game/book-6",
      progress: user?.bookProgress?.book6 || 0,
      isLocked: false,
      requiresLogin: !user,
    }
  ];

  const handleBookClick = (route: string, isLocked: boolean, requiresLogin: boolean) => {
    if (requiresLogin) {
      // Show login prompt dialog
      setShowLoginPrompt(true);
      return;
    }
    if (!isLocked) {
      navigate(route);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hint Pe Hint</h1>
          <div className="flex items-center gap-4">
            {/* Charity Coins Display - Clickable */}
            <button 
              onClick={() => setShowCoinsDialog(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <img src={CharityCoinsIcon} alt="Charity Coins" className="w-6 h-6" />
              {user ? (
                <span className="font-bold text-lg">{user.charityCoins ?? 0}</span>
              ) : (
                <span className="font-bold text-2xl">???</span>
              )}
            </button>
            
            {user ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Sign In / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area with top padding to account for fixed header */}
      <main className="flex-1 container mx-auto px-4 py-4 pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-heading mb-2">
              Choose Your Book
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Select a book to start playing and earning charity coins
            </p>
          </div>

          {/* Book Selection Grid - Compact 3 columns on mobile, 2 rows on tablet, 3 rows on desktop */}
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5 mb-6 max-w-3xl mx-auto">
            {books.map((book) => (
              <Card 
                key={book.id}
                className={`transition-all duration-300 overflow-hidden relative ${
                  book.requiresLogin 
                    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' 
                    : book.isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'cursor-pointer hover:shadow-xl hover:-translate-y-1'
                }`}
                onClick={() => handleBookClick(book.route, book.isLocked, book.requiresLogin)}
              >
                <CardContent className="p-0">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        book.isLocked ? 'grayscale' : 'hover:scale-105'
                      }`}
                    />
                    {book.isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Lock className="w-12 h-12 md:w-16 md:h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 md:p-3 space-y-1 md:space-y-2">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-center line-clamp-1">{book.title}</h3>
                      {book.isLocked && <Lock className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />}
                    </div>
                    {(!book.isLocked && !book.requiresLogin) && (
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{book.progress}%</span>
                        </div>
                        <Progress value={book.progress} className="h-1 md:h-1.5" />
                      </div>
                    )}
                    {book.requiresLogin && (
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-center text-muted-foreground">
                        Log in to play
                      </p>
                    )}
                    {book.isLocked && !book.requiresLogin && (
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-center text-muted-foreground">
                        Complete Trial Book
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Logo Section - Centered below books */}
          <div className="flex justify-center items-center py-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              Hint Pe Hint
            </h1>
          </div>
        </div>
      </main>

      {/* Login Prompt Dialog */}
      <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please log in to play</AlertDialogTitle>
            <AlertDialogDescription>
              You need to log in or sign up to access this book. Create an account to track your progress and save your charity coins!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowLoginPrompt(false)}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowLoginPrompt(false);
                navigate("/auth");
              }}
            >
              Log In / Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Charity Coins Dialog */}
      <AlertDialog open={showCoinsDialog} onOpenChange={setShowCoinsDialog}>
        <AlertDialogContent className="max-w-md">
          {!user ? (
            // Guest User - Login Prompt
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl">Wanna see your charity coins? 🪙</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Please login or sign up to start earning!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => setShowCoinsDialog(false)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Exit
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => {
                    setShowCoinsDialog(false);
                    navigate("/auth");
                  }}
                >
                  Log In / Sign Up
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            // Logged In User - Progress Bar with Milestones
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl">Your Charity Coins Progress 🎯</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  Current: <span className="font-bold text-yellow-600">{user.charityCoins ?? 0}</span> Charity Coins
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              {/* Scrollable Progress Section */}
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6">
                {[
                  { target: 500, label: "Bronze Badge" },
                  { target: 750, label: "Silver Badge" },
                  { target: 1000, label: "Gold Badge" },
                  { target: 2000, label: "Platinum Badge" },
                  { target: 3500, label: "Diamond Badge" },
                  { target: 5000, label: "Master Badge" },
                  { target: 7500, label: "Legend Badge" },
                  { target: 10000, label: "Champion Badge" }
                ].map((milestone, index, array) => {
                  const previousTarget = index > 0 ? array[index - 1].target : 0;
                  const currentCoins = user.charityCoins ?? 0;
                  const progressInRange = Math.max(0, Math.min(currentCoins - previousTarget, milestone.target - previousTarget));
                  const progressPercentage = (progressInRange / (milestone.target - previousTarget)) * 100;
                  const isCompleted = currentCoins >= milestone.target;
                  
                  return (
                    <div key={milestone.target} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{milestone.label}</span>
                        <span className={`text-sm font-bold ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {isCompleted ? '✓ ' : ''}{milestone.target} coins
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={isCompleted ? 100 : progressPercentage} 
                          className="h-3"
                        />
                        {!isCompleted && currentCoins > previousTarget && (
                          <span className="absolute left-0 -bottom-5 text-xs text-muted-foreground">
                            {currentCoins - previousTarget} / {milestone.target - previousTarget}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowCoinsDialog(false)}>
                  Close
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
