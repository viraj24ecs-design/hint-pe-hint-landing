import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hint Pe Hint</h1>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
