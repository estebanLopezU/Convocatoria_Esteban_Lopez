import React, { useState, useRef } from 'react';
import { homogenizeData } from '../services/api';

function DataUploader({ onResult, onError, onLoading, loading }) {
  const [file, setFile] = useState(null);
  const [stationName, setStationName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validar que sea JSON
    if (!selectedFile.name.endsWith('.json')) {
      onError('Por favor selecciona un archivo JSON válido.');
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
  };

  const handleProcess = async () => {
    if (!file) {
      onError('Por favor selecciona un archivo JSON primero.');
      return;
    }

    onLoading(true);

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      // Validar estructura del JSON
      let dataArray = jsonData;
      
      // Si el JSON tiene una propiedad "data", usarla
      if (jsonData.data && Array.isArray(jsonData.data)) {
        dataArray = jsonData.data;
      } else if (jsonData.records && Array.isArray(jsonData.records)) {
        dataArray = jsonData.records;
      } else if (!Array.isArray(jsonData)) {
        onError('El archivo JSON debe contener un array de registros o un objeto con propiedad "data" que sea un array.');
        onLoading(false);
        return;
      }

      if (dataArray.length === 0) {
        onError('El array de datos está vacío.');
        onLoading(false);
        return;
      }

      // Validar que los registros tengan los campos mínimos
      const requiredFields = ['fecha', 'hora'];
      for (let i = 0; i < Math.min(dataArray.length, 5); i++) {
        const missing = requiredFields.filter(f => !(f in dataArray[i]));
        if (missing.length > 0) {
          onError(`El registro ${i + 1} no tiene los campos requeridos: ${missing.join(', ')}`);
          onLoading(false);
          return;
        }
      }

      const result = await homogenizeData(dataArray, stationName || file.name.replace('.json', ''));
      onResult(result);

    } catch (err) {
      if (err instanceof SyntaxError) {
        onError('El archivo no contiene un JSON válido. Verifica el formato.');
      } else {
        onError(err.message || 'Error al procesar el archivo.');
      }
      onLoading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setStationName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-input-wrapper">
      <label className={`file-input-label ${file ? 'has-file' : ''}`}>
        <span className="file-icon">📄</span>
        <span>
          {file ? 'Archivo seleccionado:' : 'Haz clic para seleccionar un archivo JSON'}
        </span>
        {file && <span className="file-name">{file.name}</span>}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
      </label>

      <input
        type="text"
        className="station-input"
        placeholder="Nombre de la estación (opcional)"
        value={stationName}
        onChange={(e) => setStationName(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-primary"
          onClick={handleProcess}
          disabled={!file || loading}
        >
          {loading ? (
            <span className="loading-spinner" style={{ padding: 0 }}>
              <span className="spinner" />
              Procesando...
            </span>
          ) : (
            '🚀 Procesar Datos'
          )}
        </button>

        {file && (
          <button className="btn btn-secondary" onClick={handleClearFile} style={{ margin: 0 }}>
            ❌ Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

export default DataUploader;