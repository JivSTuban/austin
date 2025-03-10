
import React from 'react';
import { cn } from '@/lib/utils';

const BackgroundShapes: React.FC = () => {
  return (
    <div style={{ position: 'absolute', zIndex: -1 }}>
      {/* Existing background shapes code */}
    </div>
  );
  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
      {/* Floating Cube */}
      <div className="shape shape-1 floating-slow">
        <div className="w-24 h-24 md:w-32 md:h-32 opacity-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl" 
            style={{ transform: 'perspective(1000px) rotateX(20deg) rotateY(30deg)' }}
        />
      </div>
      
      {/* Floating Circle */}
      <div className="shape shape-2 floating">
        <div className="w-32 h-32 md:w-40 md:h-40 opacity-10 bg-gradient-to-tr from-purple-400 to-pink-600 rounded-full" />
      </div>
      
      {/* Floating Triangle */}
      <div className="shape shape-3 floating-slow" style={{ animationDelay: '-5s' }}>
        <div className="w-0 h-0 border-l-[60px] border-l-transparent border-b-[100px] border-b-purple-400/10 border-r-[60px] border-r-transparent" />
      </div>
      
      {/* Floating Rectangle */}
      <div className="shape shape-4 floating" style={{ animationDelay: '-3s' }}>
        <div className="w-40 h-20 md:w-48 md:h-24 opacity-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg"
            style={{ transform: 'perspective(1000px) rotateZ(10deg)' }}
        />
      </div>
      
      {/* Additional blurred gradients */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50/5 to-transparent pointer-events-none" />
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-l from-purple-50/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default BackgroundShapes;
