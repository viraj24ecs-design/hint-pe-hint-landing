const Footer = () => {
  return (
    <footer className="py-12 lg:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center">
          <span className="font-display text-xl font-semibold text-text-heading">
            Hint Pe Hint
          </span>
          <p className="text-text-subtle text-sm mt-4">
            Making India read, one game at a time.
          </p>
          <p className="text-muted-foreground text-xs mt-8">
            © {new Date().getFullYear()} Hint Pe Hint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
