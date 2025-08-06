import React, { useState } from 'react';

const BluetoothModal = ({ onClose, onSend }) => {
  const [workTime, setWorkTime] = useState(25); // minutos de trabajo
  const [port, setPort] = useState(null);

  const connectSerial = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      setPort(selectedPort);
      console.log('✅ Puerto serie abierto');
    } catch (error) {
      console.error('❌ Error al abrir el puerto serie:', error);
    }
  };

  const sendMessage = async () => {
    if (!port || !port.writable) return;

    let trabajo = parseInt(workTime);
    if (isNaN(trabajo) || trabajo < 25) {
      trabajo = 25;
    }

    const descanso = Math.max(1, Math.round(trabajo * 0.25));
    const comando = `START:${trabajo}:${descanso}\n`;

    const writer = port.writable.getWriter();
    const data = new TextEncoder().encode(comando);
    await writer.write(data);
    writer.releaseLock();

    if (onSend) onSend(comando.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Conexión Arduino (Web Serial)</h2>

        {!port ? (
          <button
            onClick={connectSerial}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
          >
            Conectar al Arduino
          </button>
        ) : (
          <>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de trabajo (mínimo 25 minutos)
              </label>
              <input
                type="number"
                min="25"
                value={workTime}
                onChange={(e) => setWorkTime(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />

              <button
                onClick={sendMessage}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Iniciar Pomodoro
              </button>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default BluetoothModal;
