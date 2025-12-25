import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TrialBookImg from "@/assets/TrialBook.png";
import RichDadPoorDadImg from "@/assets/RichDadPoorDad.png";
import AtomicHabitsImg from "@/assets/AtomicHabits.png";

const Game = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const books = [
    {
      id: "trialBook",
      title: "Trial Book",
      image: TrialBookImg,
      route: "/game/trial-book",
      progress: user?.bookProgress?.trialBook || 0,
    },
    {
      id: "richDadPoorDad",
      title: "Rich Dad Poor Dad",
      image: RichDadPoorDadImg,
      route: "/game/rich-dad-poor-dad",
      progress: user?.bookProgress?.richDadPoorDad || 0,
    },
    {
      id: "atomicHabits",
      title: "Atomic Habits",
      image: AtomicHabitsImg,
      route: "/game/atomic-habits",
      progress: user?.bookProgress?.atomicHabits || 0,
    }
  ];

  const handleBookClick = (route: string) => {
    navigate(route);
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
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
                onClick={() => handleBookClick(book.route)}
              >
                <CardContent className="p-0">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-xl font-bold text-center">{book.title}</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{book.progress}%</span>
                      </div>
                      <Progress value={book.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
