import React from 'react';

const PomodoroTimer = ({ 
  workTime = 25, 
  breakTime = 5, 
  // Timer state from parent
  minutes,
  seconds,
  isActive,
  mode,
  isAlarmPlaying,
  // Timer control functions from parent
  onToggleTimer,
  onResetTimer,
  onConfigClick,
  onStopAlarm
}) => {

  const totalSeconds = mode === 'work' ? workTime * 60 : breakTime * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const progressPercentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  const completedPomodoros = localStorage.getItem('pomodorosCompleted') || 0;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {isAlarmPlaying && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
          <span className="mr-2">🔔 {mode === 'work' ? '¡Tiempo de descanso!' : '¡Volver al trabajo!'}</span>
          <button 
            onClick={onStopAlarm}
            className="ml-auto text-sm bg-red-200 px-2 py-1 rounded"
          >
            Silenciar
          </button>
        </div>
      )}

      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#ef4444"
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progressPercentage / 100)}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold">
            {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </div>
          <div className="text-lg font-medium mt-2 text-red-600">
            {mode === 'work' ? 'Trabajo' : 'Descanso'}
          </div>
          <div className="text-sm mt-2 text-gray-600">
            {mode === 'work' && `+ ${breakTime} minutos de descanso`}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onToggleTimer}
          className={`px-8 py-3 rounded-full text-white font-medium ${isActive ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'} transition-colors shadow-md`}
        >
          {isActive ? 'Detener' : 'Comenzar'}
        </button>
        <button 
          onClick={onResetTimer}
          className="px-8 py-3 bg-gray-200 rounded-full font-medium hover:bg-gray-300 transition-colors shadow-md"
        >
          Reiniciar
        </button>
      </div>
      <div className="flex gap-4 mt-6">
        <button 
          onClick={onConfigClick}
          className="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          ⚙️ Configurar
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-600">Pomodoros completados</p>
        <p className="text-2xl font-bold text-red-600">{completedPomodoros}</p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
