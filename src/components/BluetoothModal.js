import React, { useState, useEffect } from 'react';

const BluetoothModal = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setError('');
      setDevices([]);
      setIsConnected(false);
    }
  }, [isOpen]);

  // Mock function to simulate scanning for Bluetooth devices
  const scanForDevices = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      // Check if Web Bluetooth is supported
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth no es compatible con este navegador');
      }

      // Request device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'ESP32' },
          { namePrefix: 'Arduino' },
          { services: ['battery_service'] }
        ],
        optionalServices: ['generic_access']
      });

      setDevices([device]);
    } catch (err) {
      if (err.name === 'NotFoundError') {
        setError('No se encontraron dispositivos ESP32 disponibles');
      } else {
        setError(`Error de Bluetooth: ${err.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const connectToDevice = async (device) => {
    setIsConnecting(true);
    setError('');

    try {
      const server = await device.gatt.connect();
      setIsConnected(true);
      
      // Simulate getting sensor data
      setSensorData({
        temperature: (20 + Math.random() * 15).toFixed(1),
        humidity: (40 + Math.random() * 40).toFixed(1),
        pressure: (1000 + Math.random() * 50).toFixed(1)
      });

      console.log('Conectado a ESP32:', device.name);
    } catch (err) {
      setError(`Error al conectar: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setSensorData(null);
    setDevices([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            📡 Conexión ESP32
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {!isConnected ? (
            <>
              <p className="text-gray-600 text-sm">
                Conecta tu ESP32 para recibir datos de sensores en tiempo real
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={scanForDevices}
                disabled={isConnecting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    🔍 Buscar ESP32
                  </>
                )}
              </button>

              {devices.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Dispositivos encontrados:</h3>
                  {devices.map((device, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded p-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{device.name || 'ESP32'}</div>
                        <div className="text-sm text-gray-500">{device.id}</div>
                      </div>
                      <button
                        onClick={() => connectToDevice(device)}
                        disabled={isConnecting}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-green-300"
                      >
                        Conectar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
                ✅ Conectado exitosamente a ESP32
              </div>

              {sensorData && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Datos de Sensores:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Temperatura</div>
                      <div className="text-lg font-bold text-blue-600">
                        {sensorData.temperature}°C
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Humedad</div>
                      <div className="text-lg font-bold text-green-600">
                        {sensorData.humidity}%
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Presión</div>
                      <div className="text-lg font-bold text-purple-600">
                        {sensorData.pressure} hPa
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={disconnect}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                🔌 Desconectar
              </button>
            </>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>💡 Tip: Tu ESP32 debe estar emparejado y en modo descubrimiento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluetoothModal;
