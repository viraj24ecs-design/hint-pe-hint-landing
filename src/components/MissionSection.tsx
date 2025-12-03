const MissionSection = () => {
  return (
    <section className="py-24 lg:py-40 bg-section">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-text-subtle text-sm tracking-widest uppercase mb-4">
            Why we do this
          </p>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-heading mb-8 lg:mb-12">
            Our Mission
          </h2>
          
          <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            We believe every Indian deserves access to knowledge. Through this game, 
            we aim to foster a reading culture across the nation, making books accessible 
            to the underprivileged and inspiring millions to discover the joy of reading.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
