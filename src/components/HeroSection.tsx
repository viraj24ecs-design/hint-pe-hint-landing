import { Button } from "@/components/ui/button";
import readerImage from "@/assets/reader-hero.png";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 lg:pt-0 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left animate-fade-up">
            <p className="text-text-subtle text-sm lg:text-base tracking-widest uppercase mb-4 lg:mb-6">
              An initiative to make India read
            </p>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-text-heading leading-[1.1] mb-6 lg:mb-8">
              Hint Pe Hint
            </h1>
            
            <p className="text-muted-foreground text-base lg:text-lg max-w-md mx-auto lg:mx-0 mb-8 lg:mb-12 leading-relaxed">
              Play this game and help the underprivileged
            </p>
            
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Play
            </Button>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <img
                src={readerImage}
                alt="Person reading a book"
                className="w-64 sm:w-80 lg:w-96 xl:w-[480px] h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
