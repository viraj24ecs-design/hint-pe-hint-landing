import flowchartImage from "@/assets/flowchart-placeholder.png";

const FlowchartSection = () => {
  return (
    <section className="py-24 lg:py-40 bg-section">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-subtle text-sm tracking-widest uppercase mb-4">
            The Complete Picture
          </p>
          
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-heading mb-12 lg:mb-16">
            Game Flow
          </h2>
          
          {/* Temporary flowchart image - replace later */}
          <div className="bg-background rounded-2xl p-8 lg:p-12 shadow-premium-lg">
            <img
              src={flowchartImage}
              alt="Game flowchart - temporary placeholder"
              className="w-full h-auto max-w-3xl mx-auto"
            />
            <p className="text-text-subtle text-sm mt-6">
              {/* Viraj: Replace this image with your actual flowchart */}
              Temporary flowchart placeholder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowchartSection;
