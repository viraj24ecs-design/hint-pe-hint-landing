import hintpehintlogo2 from "@/assets/HintPeHintHorizontal.png";


const Footer = () => {
  return (
    <footer className="py-12 lg:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center">
       <img 
            src={hintpehintlogo2} 
            alt="Hint Pe Hint Logo" 
            className="h-60 lg:h-70 w-auto mx-auto mt-[-100px]"
          />
          <p className="text-text-subtle text-sm mt-[-100px]">
            Making India read, one game at a time.
          </p>
          <p className="text-muted-foreground text-xs mt-8">
            © {new Date().getFullYear()} Booklet Guy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
