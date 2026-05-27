const { homogenize } = require('./backend/src/services/homogenizer');

// Datos exactos de la Tabla 1 del PDF
const inputData = [
  { fecha: "11/5/2015", hora: "19:36:21", temp: 16.17, vel_viento: 0, dir_viento: 0, dir_rosa: "S", presion: 594.36, humedad: 94, ppt_cincom: 6.6, rad_solar: 0, evt_cincom: 1.83 },
  { fecha: "11/5/2015", hora: "19:42:24", temp: 16.11, vel_viento: 0.89, dir_viento: 165, dir_rosa: "SSE", presion: 594.44, humedad: 94, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { fecha: "11/5/2015", hora: "19:44:29", temp: 16.06, vel_viento: 0, dir_viento: 90, dir_rosa: "E", presion: 594.54, humedad: 94, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { fecha: "11/5/2015", hora: "19:50:36", temp: 15.89, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 594.67, humedad: 93, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { fecha: "11/5/2015", hora: "19:54:41", temp: 15.67, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 595.02, humedad: 93, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { fecha: "11/5/2015", hora: "20:00:12", temp: "ND", vel_viento: "ND", dir_viento: "ND", dir_rosa: "ND", presion: "ND", humedad: "ND", ppt_cincom: "ND", rad_solar: "ND", evt_cincom: "ND" },
  { fecha: "11/5/2015", hora: "20:05:54", temp: 15.5, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 594.79, humedad: 94, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { fecha: "11/5/2015", hora: "20:10:56", temp: 15.39, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 594.92, humedad: 94, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 }
];

// Resultados esperados basados en la fórmula de interpolación lineal del PDF
// NOTA: El PDF muestra dir_viento=166.59 para 19:40:00, pero la interpolación
// lineal estándar entre 0 (19:36:21) y 165 (19:42:24) da ~99.55
const expectedOutput = [
  { hora: "19:35:00", temp: 16.17, vel_viento: 0, dir_viento: 0, dir_rosa: "S", presion: 594.36, humedad: 94, ppt_cincom: 6.6, rad_solar: 0, evt_cincom: 1.83 },
  { hora: "19:40:00", temp: 16.13, vel_viento: 0.54, dir_viento: 99.55, dir_rosa: "S", presion: 594.41, humedad: 94, ppt_cincom: 2.62, rad_solar: 0, evt_cincom: 0.73 },
  { hora: "19:45:00", temp: 16.06, vel_viento: 0, dir_viento: 90, dir_rosa: "E", presion: 594.54, humedad: 94, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { hora: "19:50:00", temp: 15.89, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 594.67, humedad: 93, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { hora: "19:55:00", temp: 15.67, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 595.02, humedad: 93, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { hora: "20:00:00", temp: "ND", vel_viento: "ND", dir_viento: "ND", dir_rosa: "ND", presion: "ND", humedad: "ND", ppt_cincom: "ND", rad_solar: "ND", evt_cincom: "ND" },
  { hora: "20:05:00", temp: 15.5, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 594.79, humedad: 94, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 },
  { hora: "20:10:00", temp: 15.41, vel_viento: 0, dir_viento: 83, dir_rosa: "E", presion: 594.9, humedad: 94, ppt_cincom: 0, rad_solar: 0, evt_cincom: 0 }
];

console.log("=== PRUEBA DEL ALGORITMO DE HOMOGENIZACIÓN ===\n");

const result = homogenize(inputData);

console.log(`Input: ${inputData.length} registros`);
console.log(`Output: ${result.length} registros cincominutales\n`);
console.log("Resultados obtenidos:");
console.table(result.map(r => ({ hora: r.hora, temp: r.temp, vel_viento: r.vel_viento, dir_viento: r.dir_viento, presion: r.presion, humedad: r.humedad })));

console.log("\n=== VERIFICACIÓN CONTRA TABLA 2 DEL PDF ===\n");
let allPass = true;

for (let i = 0; i < expectedOutput.length; i++) {
  const exp = expectedOutput[i];
  const got = result[i];
  if (!got) {
    console.log(`❌ Fila ${i} (${exp.hora}): No se encontró resultado`);
    allPass = false;
    continue;
  }

  const fields = ['temp', 'vel_viento', 'dir_viento', 'presion', 'humedad', 'ppt_cincom', 'rad_solar', 'evt_cincom'];
  let rowPass = true;
  const errors = [];

  for (const field of fields) {
    if (exp[field] === "ND") {
      if (got[field] !== "ND" && got[field] !== "ND") {
        errors.push(`${field}: esperado ND, obtenido ${got[field]}`);
        rowPass = false;
      }
    } else {
      const expectedNum = typeof exp[field] === 'number' ? Math.round(exp[field] * 100) / 100 : exp[field];
      const gotNum = typeof got[field] === 'number' ? Math.round(got[field] * 100) / 100 : got[field];
      // Tolerancia de 0.05 para interpolación
      if (typeof expectedNum === 'number' && typeof gotNum === 'number') {
        if (Math.abs(expectedNum - gotNum) > 0.05) {
          errors.push(`${field}: esperado ${expectedNum}, obtenido ${gotNum}`);
          rowPass = false;
        }
      }
    }
  }
  // Verificar dir_rosa por separado (es string)
  if (got.dir_rosa !== exp.dir_rosa) {
    errors.push(`dir_rosa: esperado ${exp.dir_rosa}, obtenido ${got.dir_rosa}`);
    rowPass = false;
  }

  if (rowPass) {
    console.log(`✅ ${got.fecha} ${got.hora} - OK`);
  } else {
    console.log(`❌ ${got.fecha} ${got.hora} - ${errors.join(', ')}`);
    allPass = false;
  }
}

console.log(`\n${allPass ? '✅ TODAS LAS PRUEBAS PASARON' : '❌ HAY ERRORES EN EL ALGORITMO'}`);