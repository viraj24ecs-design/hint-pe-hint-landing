import { Button } from "@/components/ui/button";
import readerImage from "@/assets/AmrutD.png";
import hintPeHintLogo from "@/assets/HintPeHint.png";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center pt-20 lg:pt-0 bg-background">
      <div className="w-full max-w-[1400px] mx-auto pl-6 lg:pl-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12">
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left animate-fade-up flex-shrink-0">
            <p className="text-text-subtle text-sm lg:text-base tracking-widest uppercase mb-1 lg:mb-[-70px] lg:ml-14">
              Amruth Deshmukh Presents
            </p>
            
           <div className="mb-6 lg:mb-8">
             <img 
               src={hintPeHintLogo} 
               alt="Hint Pe Hint" 
               className="w-[400px] sm:w-[400px] lg:w-96 xl:w-[450px] h-auto mx-auto lg:mx-0"
             />
           </div>
            
            <p className="text-muted-foreground text-base lg:text-lg max-w-md mx-auto lg:mx-0 mb-8 lg:mb-[-50px] leading-relaxed lg:ml-[70px] lg:-mt-[100px]">
              An Initiative To Make India Read
            </p>
             <p className="font-Nohemi text-muted-foreground text-base lg:text-lg max-w-md mx-auto lg:mx-0 mb-8 lg:mb-8 leading-relaxed lg:ml-[10px]">
              Play This Game And Help The Underprivileged
            </p>
            
            <Button variant="hero" size="xl" className="w-full sm:w-auto lg:px-16 lg:py-6 lg:text-2xl lg:mt-8 lg:ml-[50px] ">
              Play 
            </Button>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 flex justify-center animate-fade-in flex-shrink-0 lg:-ml-16" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <img
                src={readerImage}
                alt="Person reading a book"
                className="w-64 sm:w-80 lg:w-[800px] xl:w-[900px] h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
