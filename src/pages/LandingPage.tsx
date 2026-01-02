import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthDialog from "@/components/AuthDialog";
import { User, LogOut, Coins as CoinsIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LandingPage = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right"); // Track swipe direction
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfilePopover(false);
    navigate("/");
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // 12 Books array - customize titles, images, and routes here
  const books = [
    { id: 1, title: "How To Bring Self-Discipline To Exercise", image: "/BookPics/How-To-Bring-Self-Discipline-To-Exercise.jpg", route: "/game/trial-book" },
    { id: 2, title: "Book 2", image: "", route: "/book/2" },
    { id: 3, title: "Book 3", image: "", route: "/book/3" },
    { id: 4, title: "Book 4", image: "", route: "/book/4" },
    { id: 5, title: "Book 5", image: "", route: "/book/5" },
    { id: 6, title: "Book 6", image: "", route: "/book/6" },
    { id: 7, title: "Book 7", image: "", route: "/book/7" },
    { id: 8, title: "Book 8", image: "", route: "/book/8" },
    { id: 9, title: "Book 9", image: "", route: "/book/9" },
    { id: 10, title: "Book 10", image: "", route: "/book/10" },
    { id: 11, title: "Book 11", image: "", route: "/book/11" },
    { id: 12, title: "Book 12", image: "", route: "/book/12" },
  ];

  // Show 3 books at a time
  const visibleBooks = books.slice(currentIndex, currentIndex + 3);

  const handlePrevious = () => {
    setDirection("left"); // Swipe back = slide from left
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setDirection("right"); // Swipe forward = slide from right
    setCurrentIndex((prev) => Math.min(books.length - 3, prev + 1));
  };

  const handleBookClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-2 sm:px-4 py-2 flex justify-between items-center">
          <h1 className="text-sm sm:text-xl font-bold">Hint Pe Hint</h1>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Charity Coins Display */}
            <button className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
              <img 
                src="https://img.icons8.com/emoji/48/coin-emoji.png" 
                alt="coin"
                className="w-3 h-3 sm:w-6 sm:h-6"
              />
              <span className="font-bold text-xs sm:text-lg">
                {isLoggedIn ? user?.charityCoins ?? 0 : "???"}
              </span>
            </button>
            
            {/* Login Button or User Profile */}
            {!isLoggedIn ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAuthDialog(true)}
                className="text-xs sm:text-sm"
              >
                Sign In
              </Button>
            ) : (
              <Popover open={showProfilePopover} onOpenChange={setShowProfilePopover}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-bold">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Username</span>
                        </div>
                        <span className="text-sm font-medium">{user?.username}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CoinsIcon className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-900">Charity Coins</span>
                        </div>
                        <span className="text-sm font-bold text-yellow-900">{user?.charityCoins ?? 0}</span>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Books Carousel */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Choose Your Book</h2>
          
          {/* Books Carousel Container */}
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="h-12 w-12 rounded-full flex-shrink-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Books Display - Always shows 3 books */}
            <div className="flex gap-4 justify-center items-center overflow-hidden">
              {visibleBooks.map((book, index) => (
                <button
                  key={`${book.id}-${currentIndex}-${direction}`}
                  onClick={() => handleBookClick(book.route)}
                  className={`flex flex-col items-center gap-2 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-200 w-[180px] bg-white animate-in fade-in ${
                    direction === "right" ? "slide-in-from-right-10" : "slide-in-from-left-10"
                  }`}
                  style={{
                    animationDuration: "400ms",
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "backwards"
                  }}
                >
                  {/* Book Image - 2:3 Aspect Ratio */}
                  <div className="w-full aspect-[2/3] bg-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {book.image ? (
                      <img 
                        src={book.image} 
                        alt={book.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Book Cover</span>
                    )}
                  </div>
                  
                  {/* Book Title - Multi-line with auto-scaling text */}
                  <p className="text-sm font-semibold text-center w-full px-1 leading-tight line-clamp-3 break-words"
                     style={{
                       fontSize: book.title.length > 20 ? '0.75rem' : book.title.length > 15 ? '0.8rem' : '0.875rem'
                     }}
                  >
                    {book.title}
                  </p>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= books.length - 3}
              className="h-12 w-12 rounded-full flex-shrink-0"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Carousel Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: books.length - 2 }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-blue-500 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;
