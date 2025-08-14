import React from 'react';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Neural Network Nodes */}
      <div className="absolute inset-0">
        {/* Large nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 bg-opacity-30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400 bg-opacity-40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-indigo-400 bg-opacity-35 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-cyan-400 bg-opacity-30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-4 h-4 bg-violet-400 bg-opacity-40 rounded-full animate-pulse delay-500"></div>
        
        {/* Medium nodes */}
        <div className="absolute top-32 left-1/2 w-2 h-2 bg-blue-300 bg-opacity-25 rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-60 left-1/4 w-3 h-3 bg-purple-300 bg-opacity-30 rounded-full animate-pulse delay-800"></div>
        <div className="absolute top-80 right-1/4 w-2 h-2 bg-indigo-300 bg-opacity-25 rounded-full animate-pulse delay-400"></div>
        
        {/* Small nodes */}
        <div className="absolute top-24 right-40 w-1 h-1 bg-cyan-300 bg-opacity-20 rounded-full animate-pulse delay-600"></div>
        <div className="absolute bottom-20 left-60 w-1 h-1 bg-violet-300 bg-opacity-20 rounded-full animate-pulse delay-900"></div>
        <div className="absolute top-72 left-20 w-1 h-1 bg-blue-300 bg-opacity-20 rounded-full animate-pulse delay-100"></div>
      </div>

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.1)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Neural network connections */}
        <path d="M 100 120 Q 200 180 320 160" stroke="url(#lineGradient1)" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M 320 160 Q 450 140 580 200" stroke="url(#lineGradient2)" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M 80 320 Q 180 280 280 340" stroke="url(#lineGradient1)" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M 280 340 Q 400 380 520 320" stroke="url(#lineGradient2)" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M 160 240 Q 300 200 440 260" stroke="url(#lineGradient1)" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0;0,100" dur="4.5s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Floating Data Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 text-blue-300 text-opacity-20 text-xs font-mono animate-bounce">
          [0.95, 0.87, 0.92]
        </div>
        <div className="absolute top-28 right-24 text-purple-300 text-opacity-20 text-xs font-mono animate-bounce delay-500">
          tensor.shape
        </div>
        <div className="absolute bottom-24 left-32 text-indigo-300 text-opacity-20 text-xs font-mono animate-bounce delay-1000">
          model.predict()
        </div>
        <div className="absolute top-52 right-40 text-cyan-300 text-opacity-20 text-xs font-mono animate-bounce delay-700">
          confidence: 0.89
        </div>
        <div className="absolute bottom-36 right-32 text-violet-300 text-opacity-20 text-xs font-mono animate-bounce delay-300">
          bbox: [x,y,w,h]
        </div>
        <div className="absolute top-44 left-1/3 text-blue-300 text-opacity-20 text-xs font-mono animate-bounce delay-800">
          ReLU(x)
        </div>
      </div>

      {/* Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-12 right-12 w-8 h-8 border border-blue-400 border-opacity-20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-12 left-12 w-6 h-6 border border-purple-400 border-opacity-20 rotate-12 animate-spin" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-1/2 right-16 w-4 h-4 border border-indigo-400 border-opacity-20 rotate-45 animate-spin" style={{ animationDuration: '25s' }}></div>
      </div>

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 text-green-400 text-xs font-mono animate-pulse">
          1 0 1 0<br/>
          0 1 1 0<br/>
          1 1 0 1<br/>
          0 0 1 1
        </div>
        <div className="absolute top-20 right-1/4 text-green-400 text-xs font-mono animate-pulse delay-1000">
          1 1 0 0<br/>
          0 1 0 1<br/>
          1 0 1 1<br/>
          1 1 1 0
        </div>
        <div className="absolute bottom-20 left-1/3 text-green-400 text-xs font-mono animate-pulse delay-500">
          0 1 1 1<br/>
          1 0 0 1<br/>
          1 1 0 0<br/>
          0 1 1 0
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-10 blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-full opacity-10 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-violet-500 to-pink-600 rounded-full opacity-10 blur-xl animate-pulse delay-500"></div>
    </div>
  );
};

export default HeroBackground;