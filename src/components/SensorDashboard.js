import React, { useEffect, useState } from 'react';

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSensorData = async () => {
    try {
      setError('');
      const response = await fetch('http://localhost:3001/api/thinger/latest');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSensorData(data);
      setLoading(false);
      
      // Obtener estadísticas para cada sensor
      for (const sensor of data) {
        try {
          const statsResponse = await fetch(
            `http://localhost:3001/api/thinger/stats/${sensor.sensorType}`
          );
          if (statsResponse.ok) {
            const sensorStats = await statsResponse.json();
            setStats(prev => ({
              ...prev,
              [sensor.sensorType]: sensorStats
            }));
          }
        } catch (statsError) {
          console.warn(`Error fetching stats for ${sensor.sensorType}:`, statsError);
        }
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setError('Error al obtener datos de sensores: ' + error.message);
      setLoading(false);
    }
  };

  const manualFetch = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Necesitarás especificar el resourceId correcto aquí
      const resourceId = 'sensor_data'; // Cambia esto por el resourceId real de tu ESP32
      
      const response = await fetch('http://localhost:3001/api/thinger/fetch/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: resourceId,
          // token se toma de las variables de entorno del backend
        }),
      });
      
      if (response.ok) {
        await fetchSensorData();
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error manual fetch:', error);
      setError('Error al actualizar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSensorIcon = (sensorType) => {
    const icons = {
      temperature: '🌡️',
      humidity: '💧',
      pressure: '🌬️',
      light: '💡',
      motion: '🚶',
      gas: '💨',
      voltage: '⚡',
      current: '🔌',
    };
    return icons[sensorType.toLowerCase()] || '📊';
  };

  const getSensorUnit = (sensorType) => {
    const units = {
      temperature: '°C',
      humidity: '%',
      pressure: 'hPa',
      light: 'lux',
      voltage: 'V',
      current: 'A',
      gas: 'ppm',
    };
    return units[sensorType.toLowerCase()] || '';
  };

  if (loading && sensorData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          📡 Datos ESP32 - Wilson2005
        </h2>
        <button
          onClick={manualFetch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          disabled={loading}
        >
          {loading ? 'Actualizando...' : '🔄 Actualizar'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          ⚠️ {error}
        </div>
      )}

      {sensorData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            📭 No hay datos de sensores disponibles
          </p>
          <p className="text-sm text-gray-400">
            Dispositivo: esp32_wilson<br/>
            Usuario: Wilson2005<br/>
            Asegúrate de que el ESP32 esté enviando datos a Thinger.io
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {sensorData.map((sensor, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-800 capitalize flex items-center gap-2">
                    {getSensorIcon(sensor.sensorType)}
                    {sensor.sensorType.replace('_', ' ')}
                  </h3>
                </div>
                
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {sensor.value.toFixed(2)}
                  <span className="text-sm ml-1 text-gray-600">
                    {sensor.unit || getSensorUnit(sensor.sensorType)}
                  </span>
                </p>
                
                <p className="text-xs text-gray-500 mb-2">
                  📅 {new Date(sensor.timestamp).toLocaleString()}
                </p>
                
                {stats[sensor.sensorType] && (
                  <div className="mt-3 p-2 bg-white rounded text-xs">
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                      <div>📉 Min: <span className="font-semibold">{stats[sensor.sensorType].min}</span></div>
                      <div>📈 Max: <span className="font-semibold">{stats[sensor.sensorType].max}</span></div>
                      <div>📊 Prom: <span className="font-semibold">{stats[sensor.sensorType].avg}</span></div>
                      <div>🔢 Registros: <span className="font-semibold">{stats[sensor.sensorType].count}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            🔄 Actualización automática cada 30 segundos | 
            📱 Datos programados cada 10 minutos | 
            🤖 Dispositivo: esp32_wilson
          </div>
        </>
      )}
    </div>
  );
};

export default SensorDashboard;
