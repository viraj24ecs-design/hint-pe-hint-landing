import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";

const Game = () => {
  const { user, logout, updateCoins } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Temporary function to test coin addition (will be replaced with actual game logic)
  const handleTestAddCoins = async () => {
    const result = await updateCoins(10);
    if (result.success) {
      console.log("Coins added successfully!");
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
                <span className="font-bold text-lg">{user.charityCoins}</span>
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
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-text-heading">
              Game Area
            </h2>
            <p className="text-lg text-muted-foreground">
              Game functionality will be added here
            </p>
            
            {/* Temporary test button - remove this later */}
            <Button onClick={handleTestAddCoins} className="mt-4">
              Test: Add 10 Coins
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
