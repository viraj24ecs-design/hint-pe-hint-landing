import React from 'react';

const Custombuttons =() => {
    const clicking = (shape: string) => {
        alert(`You clicked a ${shape} button`);
    };
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8"> 
    <h1 className="text-3xl font-bold text-white mb-12">Custom Shaped Buttons</h1>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

{/* hex shape*/}
<button 
onClick={() => clicking("Custom")}
    className="w-32 h-32 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-bold hover:scale-110 transition-transform duration-300 flex items-center justify-center mx-auto"
    style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
    Hexagon
</button>


</div></div>    );
};

export default Custombuttons;