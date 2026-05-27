import React, { useMemo, useState } from 'react';

function ComparisonTable({ inputData, outputData }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortField, setSortField] = useState('hora');
  const [sortDir, setSortDir] = useState('asc');

  const fields = [
    { key: 'temp', label: 'Temp', unit: '°C', icon: '🌡️', precision: 2, color: '#e17055' },
    { key: 'vel_viento', label: 'Viento', unit: 'm/s', icon: '💨', precision: 2, color: '#0984e3' },
    { key: 'dir_viento', label: 'Dir V', unit: '°', icon: '🧭', precision: 1, color: '#00b894' },
    { key: 'dir_rosa', label: 'Rosa', unit: '', icon: '🧭', precision: 0, color: '#6c5ce7' },
    { key: 'presion', label: 'Presión', unit: 'hPa', icon: '📊', precision: 2, color: '#d63031' },
    { key: 'humedad', label: 'Humedad', unit: '%', icon: '💧', precision: 1, color: '#0984e3' },
    { key: 'ppt_cincom', label: 'Precip', unit: 'mm', icon: '🌧️', precision: 2, color: '#74b9ff' },
    { key: 'rad_solar', label: 'R Solar', unit: 'W/m²', icon: '☀️', precision: 1, color: '#fdcb6e' },
    { key: 'evt_cincom', label: 'Evap', unit: 'mm', icon: '💦', precision: 2, color: '#00cec9' }
  ];

  const matchedData = useMemo(() => {
    if (!inputData || !outputData) return [];

    return outputData.map((output) => {
      const outputDate = new Date(output.fecha + ' ' + output.hora);
      let closestInput = null;
      let closestDist = Infinity;

      for (const input of inputData) {
        const inputDate = new Date(input.fecha + ' ' + input.hora);
        const dist = Math.abs(outputDate - inputDate) / 60000;
        if (dist < closestDist) {
          closestDist = dist;
          closestInput = input;
        }
      }

      return {
        fecha: output.fecha,
        hora: output.hora,
        output,
        closestInput,
        distance: closestDist,
        outputDate
      };
    }).sort((a, b) => {
      let cmp;
      if (sortField === 'hora') {
        cmp = a.outputDate - b.outputDate;
      } else {
        const va = parseFloat(a.output[sortField]) || 0;
        const vb = parseFloat(b.output[sortField]) || 0;
        cmp = va - vb;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [inputData, outputData, sortField, sortDir]);

  const formatValue = (val, precision = 2) => {
    if (val === 'ND' || val === undefined || val === null || val === '') {
      return { text: 'ND', isND: true };
    }
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return { text: String(val), isND: false };
    return { text: num.toFixed(precision), isND: false, value: num };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }) => (
    <span className="sort-icon">
      {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  const toggleRow = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!matchedData || matchedData.length === 0) return null;
    const total = matchedData.length;
    const withData = matchedData.filter(r => r.output.temp !== 'ND').length;
    const interpolated = matchedData.filter(r => {
      return r.output.temp !== 'ND' && r.closestInput && r.closestInput.temp !== 'ND';
    }).length;
    const ndCount = matchedData.filter(r => r.output.temp === 'ND').length;
    return { total, withData, interpolated, ndCount };
  }, [matchedData]);

  return (
    <div className="comparison-wrapper">
      {/* Dashboard Header */}
      {stats && (
        <div className="table-dashboard">
          <div className="dashboard-card">
            <span className="dashboard-icon">📊</span>
            <div>
              <span className="dashboard-value">{stats.total}</span>
              <span className="dashboard-label">Total Registros</span>
            </div>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-icon">✅</span>
            <div>
              <span className="dashboard-value">{stats.withData}</span>
              <span className="dashboard-label">Con Datos</span>
            </div>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-icon">📈</span>
            <div>
              <span className="dashboard-value">{stats.interpolated}</span>
              <span className="dashboard-label">Interpolados</span>
            </div>
          </div>
          <div className="dashboard-card dashboard-nd">
            <span className="dashboard-icon">⚠️</span>
            <div>
              <span className="dashboard-value">{stats.ndCount}</span>
              <span className="dashboard-label">Sin Dato (ND)</span>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="table-legend">
        <div className="legend-item">
          <span className="legend-badge legend-original"></span>
          <span>Dato Original</span>
        </div>
        <div className="legend-item">
          <span className="legend-badge legend-interpolated"></span>
          <span>Dato Cincominutal</span>
        </div>
        <div className="legend-item">
          <span className="legend-badge legend-nd-badge">ND</span>
          <span>No Disponible</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header-main">
              <th rowSpan="2" className="th-sticky" onClick={() => handleSort('hora')}>
                Fecha <SortIcon field="hora" />
              </th>
              <th rowSpan="2" className="th-sticky" onClick={() => handleSort('hora')}>
                Hora <SortIcon field="hora" />
              </th>
              <th colSpan="2" className="th-original">📋 Original</th>
              <th colSpan="2" className="th-interpolated">🎯 Cincominutal</th>
              <th rowSpan="2" className="th-status">Estado</th>
            </tr>
            <tr className="table-header-sub">
              <th className="th-original-sub">Valor</th>
              <th className="th-original-sub">Hora</th>
              {fields.slice(0, 1).map(f => (
                <React.Fragment key={f.key}>
                  <th className="th-interpolated-sub" onClick={() => handleSort(f.key)}>
                    {f.icon} {f.label} <SortIcon field={f.key} />
                  </th>
                </React.Fragment>
              ))}
              <th className="th-interpolated-sub">Δ (min)</th>
            </tr>
          </thead>
          <tbody>
            {matchedData.map((row, idx) => {
              const tempVal = formatValue(row.output.temp, 2);
              const isND = tempVal.isND;
              const dist = row.closestInput ? row.distance.toFixed(1) : '—';

              let statusClass = 'status-ok';
              let statusText = '✓ Válido';
              if (isND) { statusClass = 'status-nd'; statusText = '✗ ND'; }
              else if (row.distance <= 1) { statusClass = 'status-good'; statusText = '★ Exacto'; }
              else if (row.distance <= 2.5) { statusClass = 'status-ok'; statusText = '✓ Cercano'; }
              else { statusClass = 'status-warn'; statusText = '⚠ Interpolado'; }

              return (
                <React.Fragment key={idx}>
                  <tr
                    className={`data-row ${isND ? 'row-nd' : ''} ${expandedRow === idx ? 'row-expanded' : ''}`}
                    onClick={() => toggleRow(idx)}
                  >
                    <td className="cell-date">{row.fecha}</td>
                    <td className="cell-time">{row.hora.slice(0, 5)}</td>
                    <td className="cell-original">
                      {row.closestInput ? (
                        <span className="value-original">
                          {formatValue(row.closestInput.temp, 2).text}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="cell-original-time">
                      {row.closestInput ? row.closestInput.hora.slice(0, 5) : '—'}
                    </td>
                    <td className={`cell-interpolated ${isND ? 'cell-nd' : 'cell-ok'}`}>
                      {tempVal.isND ? (
                        <span className="nd-badge">ND</span>
                      ) : (
                        <span className="value-interpolated">{tempVal.text}</span>
                      )}
                    </td>
                    <td className="cell-delta">
                      <span className={`delta-badge ${isND ? 'delta-none' : dist <= 2.5 ? 'delta-good' : 'delta-far'}`}>
                        {dist !== '—' ? `${dist} min` : '—'}
                      </span>
                    </td>
                    <td className="cell-status">
                      <span className={`status-badge ${statusClass}`}>{statusText}</span>
                    </td>
                  </tr>
                  {expandedRow === idx && (
                    <tr className="row-detail">
                      <td colSpan="8">
                        <div className="detail-panel">
                          <div className="detail-header">
                            <strong>📊 Detalle completo — {row.fecha} {row.hora.slice(0, 5)}</strong>
                          </div>
                          <div className="detail-grid">
                            {fields.map(f => {
                              const orig = row.closestInput ? formatValue(row.closestInput[f.key], f.precision) : null;
                              const out = formatValue(row.output[f.key], f.precision);
                              return (
                                <div className="detail-field" key={f.key}>
                                  <span className="detail-icon">{f.icon}</span>
                                  <div className="detail-content">
                                    <span className="detail-label">{f.label} {f.unit && `(${f.unit})`}</span>
                                    <div className="detail-values">
                                      <span className="detail-original">
                                        Orig: <strong>{orig ? orig.text : '—'}</strong>
                                      </span>
                                      <span className={`detail-interpolated ${out.isND ? 'detail-nd' : ''}`}>
                                        Cinco: <strong>{out.isND ? 'ND' : `${out.text} ${f.unit}`}</strong>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer stats */}
      <div className="table-footer">
        <div className="footer-stats">
          <span>📋 {matchedData.length} registros</span>
          <span>|</span>
          <span className="footer-ok">✓ {stats?.withData || 0} con datos</span>
          <span>|</span>
          <span className="footer-nd">⚠ {stats?.ndCount || 0} ND</span>
        </div>
        <p className="table-caption">
          * Datos originales vs datos cincominutales. Haz clic en una fila para ver detalle completo.
          "ND" indica dato no disponible.
        </p>
      </div>
    </div>
  );
}

export default ComparisonTable;