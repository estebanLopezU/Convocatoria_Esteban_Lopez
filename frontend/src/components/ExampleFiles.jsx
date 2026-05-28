import React from 'react';

const exampleFiles = [
  {
    name: 'ejemplo_estacion.json',
    label: '📄 Ejemplo Original (PDF)',
    description: 'Datos del ejercicio del PDF (8 registros)',
  },
  {
    name: 'estacion_ejemplo_1.json',
    label: '☀️ Estación Mañana',
    description: 'Datos matutinos con variación gradual (6 registros)',
  },
  {
    name: 'estacion_ejemplo_2.json',
    label: '🌧️ Estación con Lluvia',
    description: 'Datos con precipitación (6 registros)',
  },
  {
    name: 'estacion_ejemplo_3.json',
    label: '🌅 Estación Día/Noche',
    description: 'Datos amanecer/Atardecer (8 registros)',
  },
];

function ExampleFiles() {
  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`/data/${filename}`);
      if (!response.ok) {
        // Si no está disponible en /data, usar contenido embebido
        const data = getEmbeddedData(filename);
        downloadFile(data, filename);
      } else {
        const data = await response.json();
        downloadFile(data, filename);
      }
    } catch (error) {
      // Fallback: usar datos embebidos
      const data = getEmbeddedData(filename);
      downloadFile(data, filename);
    }
  };

  const getEmbeddedData = (filename) => {
    // Datos embebidos como fallback
    const examples = {
      'ejemplo_estacion.json': [
        { "fecha": "11/5/2015", "hora": "19:36:21", "temp": 16.17, "vel_viento": 0, "dir_viento": 0, "dir_rosa": "S", "presion": 594.36, "humedad": 94, "ppt_cincom": 6.6, "rad_solar": 0, "evt_cincom": 1.83 },
        { "fecha": "11/5/2015", "hora": "19:42:24", "temp": 16.11, "vel_viento": 0.89, "dir_viento": 165, "dir_rosa": "SSE", "presion": 594.44, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "11/5/2015", "hora": "19:44:29", "temp": 16.06, "vel_viento": 0, "dir_viento": 90, "dir_rosa": "E", "presion": 594.54, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "11/5/2015", "hora": "19:50:36", "temp": 15.89, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 594.67, "humedad": 93, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "11/5/2015", "hora": "19:54:41", "temp": 15.67, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 595.02, "humedad": 93, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "11/5/2015", "hora": "20:00:12", "temp": "ND", "vel_viento": "ND", "dir_viento": "ND", "dir_rosa": "ND", "presion": "ND", "humedad": "ND", "ppt_cincom": "ND", "rad_solar": "ND", "evt_cincom": "ND" },
        { "fecha": "11/5/2015", "hora": "20:05:54", "temp": 15.5, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 594.79, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "11/5/2015", "hora": "20:10:56", "temp": 15.39, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 594.92, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 }
      ],
      'estacion_ejemplo_1.json': [
        { "fecha": "12/5/2015", "hora": "08:12:15", "temp": 22.5, "vel_viento": 2.3, "dir_viento": 45, "dir_rosa": "NE", "presion": 602.1, "humedad": 78, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "12/5/2015", "hora": "08:23:42", "temp": 23.1, "vel_viento": 2.8, "dir_viento": 52, "dir_rosa": "NE", "presion": 601.8, "humedad": 77, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "12/5/2015", "hora": "08:35:08", "temp": 24.2, "vel_viento": 3.1, "dir_viento": 60, "dir_rosa": "E", "presion": 601.2, "humedad": 75, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "12/5/2015", "hora": "08:52:33", "temp": 25.8, "vel_viento": 4.2, "dir_viento": 75, "dir_rosa": "E", "presion": 600.5, "humedad": 72, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "12/5/2015", "hora": "09:08:17", "temp": 27.3, "vel_viento": 4.8, "dir_viento": 90, "dir_rosa": "E", "presion": 599.8, "humedad": 68, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "12/5/2015", "hora": "09:25:41", "temp": 28.5, "vel_viento": 5.2, "dir_viento": 105, "dir_rosa": "ESE", "presion": 599.2, "humedad": 65, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 }
      ],
      'estacion_ejemplo_2.json': [
        { "fecha": "06/15/2015", "hora": "14:08:22", "temp": 18.2, "vel_viento": 1.5, "dir_viento": 180, "dir_rosa": "S", "presion": 588.5, "humedad": 85, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "06/15/2015", "hora": "14:17:45", "temp": 17.8, "vel_viento": 2.1, "dir_viento": 195, "dir_rosa": "S-SW", "presion": 588.2, "humedad": 87, "ppt_cincom": 2.5, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "06/15/2015", "hora": "14:28:12", "temp": 17.2, "vel_viento": 3.2, "dir_viento": 210, "dir_rosa": "SW", "presion": 587.8, "humedad": 89, "ppt_cincom": 5.8, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "06/15/2015", "hora": "14:45:33", "temp": 16.5, "vel_viento": 4.1, "dir_viento": 225, "dir_rosa": "SW", "presion": 587.1, "humedad": 91, "ppt_cincom": 8.2, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "06/15/2015", "hora": "15:02:18", "temp": 16.8, "vel_viento": 3.8, "dir_viento": 240, "dir_rosa": "W-SW", "presion": 587.5, "humedad": 90, "ppt_cincom": 6.1, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "06/15/2015", "hora": "15:18:25", "temp": 17.5, "vel_viento": 2.9, "dir_viento": 255, "dir_rosa": "W", "presion": 588.0, "humedad": 88, "ppt_cincom": 2.3, "rad_solar": 0, "evt_cincom": 0 }
      ],
      'estacion_ejemplo_3.json': [
        { "fecha": "03/20/2015", "hora": "05:52:14", "temp": 12.3, "vel_viento": 0.8, "dir_viento": 350, "dir_rosa": "N", "presion": 592.1, "humedad": 95, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "03/20/2015", "hora": "06:08:27", "temp": 13.1, "vel_viento": 1.2, "dir_viento": 5, "dir_rosa": "N", "presion": 591.8, "humedad": 93, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "03/20/2015", "hora": "06:22:41", "temp": 14.5, "vel_viento": 1.8, "dir_viento": 12, "dir_rosa": "N-NE", "presion": 591.4, "humedad": 90, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "03/20/2015", "hora": "06:38:55", "temp": 16.2, "vel_viento": 2.4, "dir_viento": 25, "dir_rosa": "N-NE", "presion": 591.0, "humedad": 87, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "03/20/2015", "hora": "07:05:12", "temp": 18.8, "vel_viento": 3.1, "dir_viento": 38, "dir_rosa": "NE", "presion": 590.5, "humedad": 82, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "03/20/2015", "hora": "07:22:33", "temp": 20.5, "vel_viento": 3.8, "dir_viento": 52, "dir_rosa": "NE", "presion": 589.9, "humedad": 78, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "03/20/2015", "hora": "22:15:42", "temp": 15.2, "vel_viento": 1.5, "dir_viento": 165, "dir_rosa": "SSE", "presion": 590.8, "humedad": 85, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
        { "fecha": "03/20/2015", "hora": "22:32:18", "temp": 14.8, "vel_viento": 2.1, "dir_viento": 172, "dir_rosa": "S", "presion": 591.2, "humedad": 87, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 }
      ],
    };
    return examples[filename] || [];
  };

  const downloadFile = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="card example-section">
      <h2>📋 Archivos de Ejemplo</h2>
      <p className="example-description">
        Descarga archivos JSON de ejemplo para probar el sistema
      </p>
      <div className="example-files-grid">
        {exampleFiles.map((file) => (
          <button
            key={file.name}
            className="btn btn-secondary example-btn"
            onClick={() => handleDownload(file.name)}
            title={file.description}
          >
            {file.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ExampleFiles;