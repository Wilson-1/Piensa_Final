import React, { useState, useEffect } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import PomodoroInfo from './components/PomodoroInfo';
import LoadingScreen from './components/LoadingScreen';
import StatsScreen from './components/StatsScreen';
import ConfigModal from './components/ConfigModal';
import BluetoothModal from './components/BluetoothModal';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('timer');
  const [showConfig, setShowConfig] = useState(false);
  const [showBluetooth, setShowBluetooth] = useState(false);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [serverWorkTime, setServerWorkTime] = useState(25);
  const [serverBreakTime, setServerBreakTime] = useState(5);
  // Timer state lifted to App level to persist across screen switches
  const [timerMinutes, setTimerMinutes] = useState(workTime);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  
  const [stats, setStats] = useState({
    pomodorosCompleted: parseInt(localStorage.getItem('pomodorosCompleted')) || 0,
    focusTime: parseInt(localStorage.getItem('focusTime')) || 0,
    sessions: (() => {
      try {
        return JSON.parse(localStorage.getItem('sessions')) || [];
      } catch (error) {
        console.error('Error parsing sessions from localStorage:', error);
        return [];
      }
    })()
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch work time from server
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/pomodoro/work-time');
        const data = await response.json();
        setServerWorkTime(data.workTime);
        setServerBreakTime(data.breakTime);
        // Update local times if server has different values
        if (data.workTime !== workTime) {
          setWorkTime(data.workTime);
        }
        if (data.breakTime !== breakTime) {
          setBreakTime(data.breakTime);
        }
      } catch (error) {
        console.error('Failed to fetch times from server:', error);
      }
    };

    fetchTimes();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchTimes, 5000);
    return () => clearInterval(interval);
  }, [workTime]);

  // Timer logic - runs continuously regardless of current screen
  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            const nextMode = timerMode === 'work' ? 'break' : 'work';
            setTimerMode(nextMode);
            setTimerMinutes(nextMode === 'work' ? workTime : breakTime);
            setTimerSeconds(0);

            // Play alarm sound
            const alarmSound = new Audio('/alarma.mp3');
            alarmSound.play().then();
            setIsAlarmPlaying(true);

            if (nextMode === 'work') {
              setCompletedPomodoros(prev => prev + 1);
              handlePomodoroComplete();
            }
          } else {
            setTimerMinutes(prev => prev - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(prev => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerMinutes, timerSeconds, timerMode, workTime, breakTime]);

  // Reset timer when work time changes (only when timer is not active)
  useEffect(() => {
    if (!isTimerActive) {
      console.log('Resetting timer due to workTime change:', { workTime, isTimerActive });
      setTimerMinutes(workTime);
      setTimerSeconds(0);
    }
  }, [workTime]); // Removed isTimerActive from dependencies

  const handlePomodoroComplete = () => {
    setStats(prev => {
      const newStats = {
        pomodorosCompleted: prev.pomodorosCompleted + 1,
        focusTime: prev.focusTime + workTime,
        sessions: [
          ...prev.sessions,
          {
            date: new Date().toISOString(),
            duration: workTime,
            type: 'work'
          }
        ]
      };
      
      // Save to localStorage
      localStorage.setItem('pomodorosCompleted', newStats.pomodorosCompleted.toString());
      localStorage.setItem('focusTime', newStats.focusTime.toString());
      localStorage.setItem('sessions', JSON.stringify(newStats.sessions));
      
      console.log('Pomodoro completed! Updated stats:', newStats);
      
      return newStats;
    });
  };

  const handleSaveConfig = (newWorkTime, newBreakTime) => {
    setWorkTime(newWorkTime);
    setBreakTime(newBreakTime);
    setShowConfig(false);
  };

  const handleConnectESP32 = () => {
    setShowBluetooth(true);
  };


  // Timer control functions
  const toggleTimer = () => {
    console.log('Toggle timer called. Current state:', { isTimerActive, timerMinutes, timerSeconds });
    setIsTimerActive(!isTimerActive);
    if (isAlarmPlaying) {
      setIsAlarmPlaying(false);
    }
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerMinutes(timerMode === 'work' ? workTime : breakTime);
    setTimerSeconds(0);
    setIsAlarmPlaying(false);
  };

  const stopAlarm = () => {
    setIsAlarmPlaying(false);
  };

  const clearStats = () => {
    const emptyStats = {
      pomodorosCompleted: 0,
      focusTime: 0,
      sessions: []
    };
    setStats(emptyStats);
    
    // Clear localStorage
    localStorage.removeItem('pomodorosCompleted');
    localStorage.removeItem('focusTime');
    localStorage.removeItem('sessions');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-red-600 text-white">
        <h1 className="text-xl font-bold text-center">Pomodoro Pro</h1>
        {isTimerActive && (
          <div className="text-center mt-2 text-sm">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
              ⏱️ {timerMode === 'work' ? 'Trabajo' : 'Descanso'} - {timerMinutes.toString().padStart(2, '0')}:{timerSeconds.toString().padStart(2, '0')}
            </span>
          </div>
        )}
        {isAlarmPlaying && (
          <div className="text-center mt-2 p-2 bg-yellow-500 rounded">
            <span className="text-white font-medium">
              🔔 {timerMode === 'work' ? '¡Tiempo de descanso!' : '¡Volver al trabajo!'}
            </span>
            <button 
              onClick={stopAlarm}
              className="ml-2 text-sm bg-white bg-opacity-20 px-2 py-1 rounded text-white"
            >
              Silenciar
            </button>
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-4 pb-8">
        {currentScreen === 'timer' && (
          <PomodoroTimer 
            workTime={workTime}
            breakTime={breakTime}
            onComplete={handlePomodoroComplete}
            onConfigClick={() => setShowConfig(true)}
            onConnectESP32={handleConnectESP32}
            // Timer state
            minutes={timerMinutes}
            seconds={timerSeconds}
            isActive={isTimerActive}
            mode={timerMode}
            completedPomodoros={completedPomodoros}
            isAlarmPlaying={isAlarmPlaying}
            // Timer control functions
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
            onStopAlarm={stopAlarm}
          />
        )}
        {currentScreen === 'info' && <PomodoroInfo />}
        {currentScreen === 'stats' && <StatsScreen stats={stats} onClearStats={clearStats} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentScreen('timer')}
            className={`p-2 ${currentScreen === 'timer' ? 'text-red-600' : 'text-gray-600'}`}
          >
            ⏱️ Temporizador {isTimerActive && <span className="text-xs">●</span>}
          </button>
          <button
            onClick={() => setCurrentScreen('stats')}
            className={`p-2 ${currentScreen === 'stats' ? 'text-red-600' : 'text-gray-600'}`}
          >
            📊 Estadísticas
          </button>
          <button
            onClick={() => setCurrentScreen('info')}
            className={`p-2 ${currentScreen === 'info' ? 'text-red-600' : 'text-gray-600'}`}
          >
            ℹ️ Información
          </button>
        </div>
      </nav>

      {showConfig && (
        <ConfigModal
          workTime={workTime}
          onSave={handleSaveConfig}
          onClose={() => setShowConfig(false)}
        />
      )}

      {showBluetooth && (
        <BluetoothModal 
          isOpen={showBluetooth} 
          onClose={() => setShowBluetooth(false)} 
        />
      )}
    </div>
  );
};

export default App;
