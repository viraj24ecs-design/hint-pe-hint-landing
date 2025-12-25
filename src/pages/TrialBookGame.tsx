import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Coins, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const TrialBookGame = () => {
  const { user, logout, updateBookProgress } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const bookId = "trialBook";
  const currentProgress = user?.bookProgress?.trialBook || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/game");
  };

  const handleTestProgress = async () => {
    const newProgress = Math.min(100, currentProgress + 10);
    const result = await updateBookProgress(bookId, newProgress);
    
    if (result.success) {
      toast({
        title: "Progress Updated!",
        description: `Trial Book progress is now ${newProgress}%`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update progress",
        variant: "destructive",
      });
    }
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
        <div className="max-w-4xl mx-auto">
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

          {/* Book Title */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-5xl font-bold text-text-heading">
              Trial Book
            </h2>
            <p className="text-lg text-muted-foreground">
              Game content for Trial Book will be added here
            </p>
          </div>

          {/* Test Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleTestProgress}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Increase Progress by 10%
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrialBookGame;
