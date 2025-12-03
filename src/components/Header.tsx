import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <span className="font-display text-xl lg:text-2xl font-semibold text-text-heading tracking-tight">
              Hint Pe Hint
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2 lg:gap-4">
            <Button variant="nav" size="default" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button variant="navFilled" size="default">
              Sign Up
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
