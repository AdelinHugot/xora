/**
 * Crée une fonction debounced qui retarde l'exécution
 * @param {Function} func - La fonction à debouncer
 * @param {number} delay - Le délai en millisecondes
 * @returns {Function} - La fonction debounced
 */
export function debounce(func, delay = 500) {
  let timeoutId;

  return function debounced(...args) {
    // Annuler le timeout précédent
    clearTimeout(timeoutId);

    // Créer un nouveau timeout
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Crée un hook pour auto-save avec debounce
 * @param {Function} updateFunc - La fonction de mise à jour
 * @param {number} delay - Le délai en millisecondes
 * @returns {Function} - La fonction debounced de save
 */
export function useAutoSave(updateFunc, delay = 1000) {
  return debounce(updateFunc, delay);
}
