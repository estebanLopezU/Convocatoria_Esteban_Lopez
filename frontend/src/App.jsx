import React, { useState } from 'react';
import DataUploader from './components/DataUploader';
import ComparisonTable from './components/ComparisonTable';
import TemperatureChart from './components/TemperatureChart';
import History from './components/History';
import './App.css';

function App() {
  const [inputData, setInputData] = useState(null);
  const [outputData, setOutputData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSeason, setActiveSeason] = useState('auto');

  const handleResult = (result) => {
    setInputData(result.inputData);
    setOutputData(result.outputData);
    setSummary(result.summary);
    setProcessingTime(result.processingTimeMs);
    setLoading(false);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
    setInputData(null);
    setOutputData(null);
    setSummary(null);
    setProcessingTime(null);
  };

  const handleClear = () => {
    setInputData(null);
    setOutputData(null);
    setSummary(null);
    setProcessingTime(null);
    setError(null);
  };

  // Determinar qué emoji mostrar según la estación
  const seasonEmoji = {
    auto: '🌤️',
    spring: '🌸',
    summer: '☀️',
    fall: '🍂',
    winter: '❄️'
  };

  return (
    <div className="app">
      {/* 🌤️ CONTENEDOR DE CLIMA: fondo + fenómenos meteorológicos */}
      <div className={`weather-container ${activeSeason}`}>
        <div className={`weather-bg ${activeSeason}`}>
          <div className="sky"></div>

          {/* Primavera: arcoíris */}
          <div className="rainbow"></div>

          {/* Verano: sol */}
          <div className="sun"></div>
          <div className="sun-ray"></div>

          {/* Otoño: líneas de viento */}
          <div className="wind-lines">
            <div className="wind-line"></div>
            <div className="wind-line"></div>
            <div className="wind-line"></div>
            <div className="wind-line"></div>
            <div className="wind-line"></div>
          </div>

          {/* Invierno: nubes */}
          <div className="clouds">
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
          </div>
        </div>

        {/* Partículas meteorológicas por estación */}
        <div className={`weather-particles ${activeSeason}`}>
          {/* Pétalos de primavera */}
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>

          {/* Rayos de sol de verano */}
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="sunbeam"></div>
          <div className="heat-wave"></div>
          <div className="heat-wave"></div>
          <div className="heat-wave"></div>
          <div className="heat-wave"></div>
          <div className="heat-wave"></div>

          {/* Hojas de otoño */}
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>
          <div className="leaf"></div>

          {/* Copos de nieve de invierno */}
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>
          <div className="snowflake"></div>

          {/* Gotas de lluvia */}
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
          <div className="raindrop"></div>
        </div>
      </div>

      {/* Selector de estación */}
      <div className="season-selector">
        <button
          className={`season-btn ${activeSeason === 'auto' ? 'active' : ''}`}
          onClick={() => setActiveSeason('auto')}
        >
          🌈 Automático
        </button>
        <button
          className={`season-btn ${activeSeason === 'spring' ? 'active' : ''}`}
          onClick={() => setActiveSeason('spring')}
        >
          🌸 Primavera
        </button>
        <button
          className={`season-btn ${activeSeason === 'summer' ? 'active' : ''}`}
          onClick={() => setActiveSeason('summer')}
        >
          ☀️ Verano
        </button>
        <button
          className={`season-btn ${activeSeason === 'fall' ? 'active' : ''}`}
          onClick={() => setActiveSeason('fall')}
        >
          🍂 Otoño
        </button>
        <button
          className={`season-btn ${activeSeason === 'winter' ? 'active' : ''}`}
          onClick={() => setActiveSeason('winter')}
        >
          ❄️ Invierno
        </button>
      </div>

      <header className="app-header">
        <h1>
          <span className="emoji-season">{seasonEmoji[activeSeason]}</span>{' '}
          Sistema de Homogenización Climática
        </h1>
        <p className="subtitle">
          Conversión de datos meteorológicos no cincominutales a datos cincominutales
          mediante interpolación lineal
        </p>
      </header>

      <main className="app-main">
        <section className="card upload-section">
          <h2>📂 Carga de Datos</h2>
          <DataUploader
            onResult={handleResult}
            onError={handleError}
            onLoading={setLoading}
            loading={loading}
          />
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {summary && (
          <section className="card summary-section">
            <h2>📊 Resumen del Procesamiento</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Estación</span>
                <span className="summary-value">{summary.stationName}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Registros de entrada</span>
                <span className="summary-value">{summary.inputRecords}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Registros de salida</span>
                <span className="summary-value">{summary.outputRecords}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Tiempo de procesamiento</span>
                <span className="summary-value">{processingTime} ms</span>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={handleClear}>
              Limpiar resultados
            </button>
          </section>
        )}

        {outputData && (
          <>
            <section className="card chart-section">
              <h2>📈 Curva de Temperatura Interpolada</h2>
              <TemperatureChart inputData={inputData} outputData={outputData} />
            </section>

            <section className="card table-section">
              <h2>📋 Tabla Comparativa</h2>
              <ComparisonTable inputData={inputData} outputData={outputData} />
            </section>
          </>
        )}

        <section className="card history-section">
          <h2>📜 Historial de Cálculos</h2>
          <History onSelectResult={handleResult} />
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Prueba Técnica SAT - Convocatoria Esteban López | 
          <a href="https://github.com/estebanLopezU/Convocatoria_Esteban_Lopez" target="_blank" rel="noopener noreferrer">
            Ver repositorio en GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;