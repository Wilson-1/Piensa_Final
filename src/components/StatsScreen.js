const StatsScreen = ({ stats, onClearStats }) => {

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Tus Estadísticas</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Pomodoros Completados</h3>
          <p className="text-3xl font-bold">{stats.pomodorosCompleted}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Minutos Enfocado</h3>
          <p className="text-3xl font-bold">{stats.focusTime}</p>
        </div>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Historial Reciente</h3>
        {stats.sessions.length > 0 ? (
          <div className="space-y-2">
            {stats.sessions.slice(-5).reverse().map((session, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                <span>
                  {new Date(session.date).toLocaleTimeString()} - {session.duration} min
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                  {session.type === 'work' ? 'Trabajo' : 'Descanso'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aún no hay sesiones registradas</p>
        )}
      </div>
      
      {/* {onClearStats && (
        <div className="mt-4 text-center">
          <button
            onClick={onClearStats}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ Limpiar Estadísticas
          </button>
        </div>
      )} */}
    </div>
  );
};

export default StatsScreen;

// DONE