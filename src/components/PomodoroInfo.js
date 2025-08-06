const PomodoroInfo = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">El Método Pomodoro</h2>
      <div className="space-y-4">
        <p>
          La técnica Pomodoro es un método de gestión del tiempo desarrollado por Francesco Cirillo.
          Se basa en usar un temporizador para dividir el trabajo en intervalos de 25 minutos
          (llamados "pomodoros"), separados por breves descansos.
        </p>

        <h3 className="text-xl font-semibold">Cómo funciona:</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Elige una tarea para realizar</li>
          <li>Configura el temporizador a 25 minutos</li>
          <li>Trabaja en la tarea hasta que suene el temporizador</li>
          <li>Toma un descanso corto (5 minutos)</li>
          <li>Cada 4 pomodoros, toma un descanso más largo (15-30 minutos)</li>
        </ol>

        <h3 className="text-xl font-semibold">Beneficios:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Mejora la concentración</li>
          <li>Reduce la fatiga mental</li>
          <li>Aumenta la productividad</li>
          <li>Proporciona métricas claras de trabajo</li>
        </ul>

        <h3 className="text-xl font-semibold">Consejos para usarlo bien:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Elimina distracciones antes de empezar</li>
          <li>Usa una lista de tareas para priorizar</li>
          <li>No interrumpas un pomodoro, si puedes evitarlo</li>
          <li>Anota lo que logras en cada pomodoro</li>
          <li>Adapta la técnica a tu ritmo: puedes ajustar los tiempos si lo necesitas</li>
        </ul>

        <h3 className="text-xl font-semibold">Qué hacer en los descansos:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Estirarte o caminar un poco</li>
          <li>Hidratarte o comer algo ligero</li>
          <li>Respirar profundamente o meditar</li>
          <li>Evitar pantallas (si es posible)</li>
          <li>Escuchar música suave o simplemente descansar la mente</li>
        </ul>
      </div>
    </div>
  );
};

export default PomodoroInfo;
