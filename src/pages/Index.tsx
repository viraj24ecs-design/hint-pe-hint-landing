import { useNavigate } from "react-router-dom";
import { Lock, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import TrialBookImg from "@/assets/TrialBook.png";
import RichDadPoorDadImg from "@/assets/RichDadPoorDad.png";
import AtomicHabitsImg from "@/assets/AtomicHabits.png";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
            {/* Charity Coins Display */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full shadow-lg">
              <Coins className="w-5 h-5" />
              {user ? (
                <>
                  <span className="font-bold text-lg">{user.charityCoins ?? 0}</span>
                  <span className="text-sm">Charity Coins</span>
                </>
              ) : (
                <span className="text-xs">Log in to view charity coins</span>
              )}
            </div>
            
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, {user.name}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuthDialog(true)}>
                Sign In / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area with top padding to account for fixed header */}
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-heading mb-4">
              Choose Your Book
            </h2>
            <p className="text-lg text-muted-foreground">
              Select a book to start playing and earning charity coins
            </p>
          </div>

          {/* Book Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <Card 
                key={book.id}
                className={`transition-all duration-300 overflow-hidden relative ${
                  book.requiresLogin 
                    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-2' 
                    : book.isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'cursor-pointer hover:shadow-xl hover:-translate-y-2'
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
                        <Lock className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-xl font-bold text-center">{book.title}</h3>
                      {book.isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    {(!book.isLocked && !book.requiresLogin) && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span>{book.progress}%</span>
                        </div>
                        <Progress value={book.progress} className="h-2" />
                      </div>
                    )}
                    {book.requiresLogin && (
                      <p className="text-sm text-center text-muted-foreground">
                        Log in to play this book
                      </p>
                    )}
                    {book.isLocked && !book.requiresLogin && (
                      <p className="text-sm text-center text-muted-foreground">
                        Complete Trial Book to unlock
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                setShowAuthDialog(true);
              }}
            >
              Log In / Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auth Dialog */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => setShowAuthDialog(false)}
      />
    </div>
  );
};

export default Index;
