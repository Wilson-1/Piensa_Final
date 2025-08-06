import React, { useState, useEffect } from 'react';

const ConfigModal = ({ workTime = 25, onSave, onClose }) => {
  const [localWorkTime, setLocalWorkTime] = useState(workTime);
  const [isSaving, setIsSaving] = useState(false);

  const calculatedBreakTime = Math.max(1, Math.round(localWorkTime * 0.2));

  useEffect(() => {
    setLocalWorkTime(workTime);
  }, [workTime]);

  const handleWorkTimeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 25) {
      setLocalWorkTime(value);
    } else if (isNaN(value)) {
      setLocalWorkTime(25);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Send to server first
      const response = await fetch('http://localhost:3001/api/setWorkTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          workTime: localWorkTime,

        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Work time saved to server successfully:', data);
        
        onSave(localWorkTime, calculatedBreakTime);
      } else {
        console.error('Failed to save work time to server');
        onSave(localWorkTime, calculatedBreakTime);
      }
    } catch (error) {
      console.error('Error saving work time:', error);
      onSave(localWorkTime, calculatedBreakTime);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Configuración Pomodoro</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de trabajo (minutos)
            </label>
            <input
              type="number"
              min="25"
              value={localWorkTime}
              placeholder={"Mínimo 25"}
              onChange={handleWorkTimeChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiempo de descanso (20% calculado automáticamente)
            </label>
            <input
              type="number"
                value={calculatedBreakTime}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
