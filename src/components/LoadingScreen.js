import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Preparando tu sesión de productividad...",
    "Cargando el poder del Pomodoro...",
    "Configurando tu temporizador...",
    "¡Listo para ser imparable!"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col items-center justify-center z-50">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍅</div>
        <h1 className="text-3xl font-bold text-white mb-2">Pomodoro Pro</h1>
        <p className="text-blue-200">Tu compañero de productividad</p>
      </div>
      
      <div className="w-64 h-3 bg-gray-700 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-white text-lg animate-pulse">
        {messages[messageIndex]}
      </p>
      
      <div className="mt-8 text-blue-200 text-sm">
        {progress < 100 ? (
          <span>Cargando... {progress}%</span>
        ) : (
          <span className="text-green-400">¡Listo!</span>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;

// DONE