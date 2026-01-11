import React from 'react';

const Custombuttons = () => {
    const clicking = (shape: string) => {
        alert(`You clicked a ${shape} button`);
    };
    
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold text-white mb-12">Custom Shaped Buttons</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16px">
                
                {/* hex shape */}
                <button 
                    onClick={() => clicking("Hexagonn")}
                    className="w-32 h-32 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-bold hover:scale-110 transition-transform duration-300 flex items-center justify-center mx-auto"
                    style={{ clipPath: 'url(#curvedPuzzle)' }}
                >
                    H
                </button>

            </div>
        
        {/*SVG def*/}
        <svg width="0" height="0">
            <defs>
                <clipPath id="curvedPuzzle" clipPathUnits="obj">
                    <path d=" M 0 0
                            L 85 0
                            L 85 35
                            C 85 45, 95 30, 105 40
                            C 105 40, 110 45, 110 50
                            C 113 75, 96 75, 85 70
                            L 85 100
                            L 55 100
                            C 55 95, 65 90, 55 80
                            C 65 95, 53 65, 33 83
                            C 25 90, 40 100, 25 100,
                            L 0 100
                            Z" />
                </clipPath>
            </defs>
            </svg>
            

            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold text-white mb-12">Custom Shaped Buttons</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8px">
                
                {/* hex shape */}
                <button 
                    onClick={() => clicking("Hexagonn")}
                    className="w-32 h-32 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-bold hover:scale-110 transition-transform duration-300 flex items-center justify-center mx-auto"
                    style={{ clipPath: 'url(#curvedPuzzle2)' }}
                >
                    H
                </button>

            </div>
        
        {/*SVG def*/}
        <svg width="0" height="0">
            <defs>
                <clipPath id="curvedPuzzle2" clipPathUnits="objectBoundingBox">
                    <path d="  M 0 0
                            L 1 0
                            L 1 0.35
                            C 1 0.45, 0.90 0.30, 0.80 0.40
                            C 0.80 0.40, 0.75 0.45, 0.75 0.50
                            C 0.73 0.75, 0.82 0.80, 1 0.70
                            L 1 0.85
                            L 0.55 0.85
                            C 0.55 0.90, 0.65 0.95, 0.55 1.05
                            C 0.65 0.90, 0.53 1.20, 0.33 1.02
                            C 0.25 0.95, 0.40 0.85, 0.25 0.85
                            L 0 0.85
                            Z" />
                </clipPath>
            </defs>
            </svg>
            </div>
            </div>
    );
};

export default Custombuttons;
