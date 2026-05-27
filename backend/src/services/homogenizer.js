/**
 * Servicio de Homogenización Climática
 *
 * Convierte datos de estaciones meteorológicas con base de tiempo no
 * cincominutal a datos cincominutales (cada 5 minutos) mediante
 * interpolación lineal.
 *
 * Reglas (Tabla de decisión):
 * ┌────────────────┬─────────────────┬──────────────────────────┐
 * │ Dato anterior   │ Dato siguiente   │ Acción                  │
 * ├────────────────┼─────────────────┼──────────────────────────┤
 * │ < 5 min         │ < 5 min          │ Interpolación lineal    │
 * │ < 2.5 min       │ > 5 min (No hay)│ Tomar dato anterior     │
 * │ > 5 min (No hay)│ < 2.5 min        │ Tomar dato siguiente    │
 * │ > 2.5 min       │ > 5 min (No hay)│ ND                      │
 * │ > 5 min (No hay)│ > 2.5 min        │ ND                      │
 * └────────────────┴─────────────────┴──────────────────────────┘
 */

/**
 * Calcula la diferencia absoluta en minutos entre dos fechas
 */
function diffMinutes(date1, date2) {
  return Math.abs(date1.getTime() - date2.getTime()) / 60000;
}

/**
 * Verifica si un registro contiene al menos un valor numérico válido
 * (no todos los campos son ND)
 */
function hasValidData(record) {
  if (!record) return false;
  const numericFields = [
    'temp', 'vel_viento', 'dir_viento', 'presion',
    'humedad', 'ppt_cincom', 'rad_solar', 'evt_cincom'
  ];
  return numericFields.some(field => {
    if (record[field] === undefined || record[field] === null) return false;
    if (typeof record[field] === 'string' && record[field].trim().toUpperCase() === 'ND') return false;
    const val = parseFloat(record[field]);
    return !isNaN(val);
  });
}

/**
 * Encuentra el registro con datos válidos más cercano dentro de un intervalo
 * de minutos alrededor de targetDate.
 *
 * @param {Array} records - Array de registros ordenados
 * @param {Date} targetDate - Fecha objetivo
 * @param {number} maxMinutesBefore - Máximo de minutos hacia atrás
 * @param {number} maxMinutesAfter - Máximo de minutos hacia adelante
 * @returns {{ record: Object|null, distance: number }}
 */
function findClosestWithData(records, targetDate, maxMinutesBefore, maxMinutesAfter) {
  let closestBefore = null;
  let closestBeforeDist = Infinity;
  let closestAfter = null;
  let closestAfterDist = Infinity;

  for (const record of records) {
    if (!hasValidData(record)) continue;

    const recordDate = new Date(record.fecha + ' ' + record.hora);
    const diff = recordDate.getTime() - targetDate.getTime();
    const dist = Math.abs(diff) / 60000;

    if (diff <= 0 && dist <= maxMinutesBefore && dist < closestBeforeDist) {
      // Record está antes o igual al target
      closestBefore = record;
      closestBeforeDist = dist;
    } else if (diff > 0 && dist <= maxMinutesAfter && dist < closestAfterDist) {
      // Record está después del target
      closestAfter = record;
      closestAfterDist = dist;
    }
  }

  return {
    before: { record: closestBefore, distance: closestBeforeDist },
    after: { record: closestAfter, distance: closestAfterDist }
  };
}

/**
 * Realiza interpolación lineal entre dos registros para una fecha objetivo.
 *
 * f(t) = v1 + ((t - t1) / (t2 - t1)) * (v2 - v1)
 */
function linearInterpolation(targetDate, recordBefore, recordAfter) {
  const dateBefore = new Date(recordBefore.fecha + ' ' + recordBefore.hora);
  const dateAfter = new Date(recordAfter.fecha + ' ' + recordAfter.hora);
  const t = targetDate.getTime();
  const t1 = dateBefore.getTime();
  const t2 = dateAfter.getTime();

  if (t2 === t1) {
    return extractNumericValues(recordBefore);
  }

  const interpolated = {};
  const numericFields = [
    'temp', 'vel_viento', 'dir_viento', 'presion',
    'humedad', 'ppt_cincom', 'rad_solar', 'evt_cincom'
  ];

  for (const field of numericFields) {
    const v1 = parseFloat(recordBefore[field]);
    const v2 = parseFloat(recordAfter[field]);

    if (isNaN(v1) || isNaN(v2)) {
      interpolated[field] = 'ND';
    } else if (field === 'dir_viento') {
      // Interpolación circular para ángulos (0-360°)
      let diff = v2 - v1;
      if (diff > 180) diff -= 360;
      else if (diff < -180) diff += 360;
      let result = v1 + ((t - t1) / (t2 - t1)) * diff;
      if (result < 0) result += 360;
      else if (result >= 360) result -= 360;
      interpolated[field] = Math.round(result * 100) / 100;
    } else {
      interpolated[field] = Math.round(
        (v1 + ((t - t1) / (t2 - t1)) * (v2 - v1)) * 100
      ) / 100;
    }
  }

  // Dirección de rosa de los vientos (campo no numérico)
  const d1 = recordBefore.dir_rosa ? recordBefore.dir_rosa.trim() : '';
  const d2 = recordAfter.dir_rosa ? recordAfter.dir_rosa.trim() : '';
  if (d1 && d1 !== 'ND' && d2 && d2 !== 'ND') {
    interpolated.dir_rosa = d1; // Tomar la del anterior por simplicidad
  } else if (d1 && d1 !== 'ND') {
    interpolated.dir_rosa = d1;
  } else if (d2 && d2 !== 'ND') {
    interpolated.dir_rosa = d2;
  } else {
    interpolated.dir_rosa = 'ND';
  }

  return interpolated;
}

/**
 * Extrae solo los valores numéricos de un registro (convierte ND a null)
 */
function extractNumericValues(record) {
  const fields = [
    'temp', 'vel_viento', 'dir_viento', 'presion',
    'humedad', 'ppt_cincom', 'rad_solar', 'evt_cincom', 'dir_rosa'
  ];
  const result = {};
  for (const field of fields) {
    if (record[field] === undefined || record[field] === null) {
      result[field] = 'ND';
    } else if (typeof record[field] === 'string' && record[field].trim().toUpperCase() === 'ND') {
      result[field] = 'ND';
    } else {
      const val = parseFloat(record[field]);
      result[field] = isNaN(val) ? record[field] : val;
    }
  }
  return result;
}

/**
 * Procesa los datos crudos y genera datos cincominutales.
 *
 * @param {Array} rawData - Array de objetos con datos de estación
 * @returns {Array} - Array con datos cincominutales procesados
 */
function homogenize(rawData) {
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    return [];
  }

  // Ordenar datos por fecha+hora
  const sorted = [...rawData].sort((a, b) => {
    const dateA = new Date(a.fecha + ' ' + a.hora);
    const dateB = new Date(b.fecha + ' ' + b.hora);
    return dateA - dateB;
  });

  // Encontrar el rango de fechas
  const firstDate = new Date(sorted[0].fecha + ' ' + sorted[0].hora);
  const lastDate = new Date(sorted[sorted.length - 1].fecha + ' ' + sorted[sorted.length - 1].hora);

  // Redondear al cincominuto inferior más cercano
  const startDate = new Date(firstDate);
  startDate.setMinutes(Math.floor(startDate.getMinutes() / 5) * 5, 0, 0);

  // Redondear al cincominuto superior más cercano
  const endDate = new Date(lastDate);
  if (endDate.getMinutes() % 5 !== 0) {
    endDate.setMinutes(Math.ceil(endDate.getMinutes() / 5) * 5, 0, 0);
  }

  const result = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const targetDate = new Date(currentDate);

    // Formatear fecha (MM/DD/YYYY)
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const year = targetDate.getFullYear();
    const fecha = `${month}/${day}/${year}`;

    // Formatear hora (HH:mm:ss)
    const hh = String(targetDate.getHours()).padStart(2, '0');
    const mm = String(targetDate.getMinutes()).padStart(2, '0');
    const ss = String(targetDate.getSeconds()).padStart(2, '0');
    const hora = `${hh}:${mm}:${ss}`;

    // Buscar registros con datos válidos en intervalos de ±5 minutos
    const { before, after } = findClosestWithData(sorted, targetDate, 5, 5);

    const entry = {
      fecha,
      hora,
      temp: 'ND',
      vel_viento: 'ND',
      dir_viento: 'ND',
      dir_rosa: 'ND',
      presion: 'ND',
      humedad: 'ND',
      ppt_cincom: 'ND',
      rad_solar: 'ND',
      evt_cincom: 'ND'
    };

    // --- Aplicar reglas de decisión ---
    if (before.record && after.record) {
      // Ambos intervalos tienen datos → Interpolación lineal
      const interpolated = linearInterpolation(targetDate, before.record, after.record);
      Object.assign(entry, interpolated);

    } else if (before.record && !after.record) {
      // Solo hay dato anterior
      if (before.distance <= 2.5) {
        // < 2.5 min → Tomar dato anterior
        Object.assign(entry, extractNumericValues(before.record));
      } else {
        // > 2.5 min → ND (se queda por defecto)
      }

    } else if (!before.record && after.record) {
      // Solo hay dato siguiente
      if (after.distance <= 2.5) {
        // < 2.5 min → Tomar dato siguiente
        Object.assign(entry, extractNumericValues(after.record));
      } else {
        // > 2.5 min → ND (se queda por defecto)
      }

    } else {
      // No hay datos en ningún intervalo → ND (se queda por defecto)
    }

    result.push(entry);
    currentDate.setMinutes(currentDate.getMinutes() + 5);
  }

  return result;
}

module.exports = { homogenize };