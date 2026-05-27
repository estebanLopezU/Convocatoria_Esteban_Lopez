import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

function History({ onSelectResult }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHistory(20, 1);
      setRecords(result.records || []);
    } catch (err) {
      setError('No se pudo cargar el historial. Verifica que el backend esté corriendo.');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Refrescar cada 30 segundos
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading && records.length === 0) {
    return <div className="history-loading">Cargando historial...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="history-error">{error}</div>
        <button className="btn btn-secondary" onClick={fetchHistory} style={{ margin: '10px auto', display: 'block' }}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  if (records.length === 0) {
    return <div className="history-empty">No hay cálculos en el historial. Sube un archivo JSON para comenzar.</div>;
  }

  return (
    <div className="history-list">
      {records.map((record) => (
        <div
          key={record._id}
          className="history-item"
          onClick={() => {
            if (onSelectResult) {
              // Si tiene el detalle completo, lo usamos
              fetch(`/api/history/${record._id}`)
                .then(res => res.json())
                .then(data => {
                  if (data.success && data.record) {
                    onSelectResult({
                      inputData: data.record.inputData,
                      outputData: data.record.outputData,
                      summary: data.record.summary,
                      processingTimeMs: 0
                    });
                  }
                })
                .catch(err => console.error('Error loading history detail:', err));
            }
          }}
        >
          <div className="history-item-info">
            <span className="history-item-title">
              📊 {record.summary?.stationName || 'Estación sin nombre'}
            </span>
            <span className="history-item-subtitle">
              {record.summary?.totalInputRecords || 0} registros de entrada →{' '}
              {record.summary?.totalOutputRecords || 0} registros de salida •{' '}
              {formatDate(record.createdAt || record.timestamp)}
            </span>
          </div>
          <span className="history-item-action">Ver resultados →</span>
        </div>
      ))}
    </div>
  );
}

export default History;