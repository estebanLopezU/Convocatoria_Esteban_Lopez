const API_BASE = '/api';

/**
 * Envía datos crudos al backend para homogenización.
 * @param {Array} data - Array de registros de estación
 * @param {string} stationName - Nombre opcional de la estación
 * @returns {Promise<Object>} Resultado con inputData y outputData
 */
export async function homogenizeData(data, stationName = '') {
  const response = await fetch(`${API_BASE}/homogenize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data, stationName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Obtiene el historial de cálculos realizados.
 * @param {number} limit - Cantidad de registros
 * @param {number} page - Número de página
 * @returns {Promise<Object>} Lista de registros históricos
 */
export async function getHistory(limit = 10, page = 1) {
  const response = await fetch(`${API_BASE}/history?limit=${limit}&page=${page}`);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Obtiene un registro histórico específico.
 * @param {string} id - ID del registro
 * @returns {Promise<Object>} Registro completo
 */
export async function getHistoryById(id) {
  const response = await fetch(`${API_BASE}/history/${id}`);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  return response.json();
}