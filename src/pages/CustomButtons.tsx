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
                    {/* Square using ABSOLUTE commands */}
                    <clipPath id="squareClip" clipPathUnits="obj">
                        <path d="
                            
                            
                            
                        " />
                    </clipPath>
                </defs>
            </svg>
        </div>
        </div>
    );
};


export default Custombuttons;
