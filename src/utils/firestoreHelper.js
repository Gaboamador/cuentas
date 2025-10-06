import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Guarda la planilla de un usuario para un mes determinado
 * @param {string} userId - UID del usuario autenticado
 * @param {string} mes - Formato 'YYYY-MM'
 * @param {object} data - Datos de la planilla
 */
export const guardarPlanilla = async (userId, mes, data) => {
  const ref = doc(db, "users", userId, "planillas", mes);
  await setDoc(ref, data, { merge: true });
};

/**
 * Obtiene la planilla de un usuario para un mes determinado
 * @param {string} userId - UID del usuario autenticado
 * @param {string} mes - Formato 'YYYY-MM'
 * @returns {object|null} - Datos de la planilla o null si no existe
 */
export const obtenerPlanilla = async (userId, mes) => {
  const ref = doc(db, "users", userId, "planillas", mes);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
};
