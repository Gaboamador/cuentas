import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Guarda o actualiza la planilla de un usuario para un mes determinado
 * @param {string} userId - UID del usuario autenticado
 * @param {string} mes - Formato 'YYYY-MM'
 * @param {object} data - Datos de la planilla
 */
export const guardarPlanilla = async (userId, mes, data) => {
  try {
    const ref = doc(db, "users", userId, "planillas", mes);
    await setDoc(ref, data, { merge: true });
    console.log("Planilla guardada/actualizada correctamente:", ref.path);
  } catch (error) {
    console.error("Error al guardar planilla:", error);
  }
};

/**
 * Obtiene la planilla de un usuario para un mes determinado
 */
export const obtenerPlanilla = async (userId, mes) => {
  const ref = doc(db, "users", userId, "planillas", mes);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
};

/**
 * Obtiene todas las planillas de un usuario
 */
export const obtenerTodasLasPlanillas = async (userId) => {
  try {
    const ref = collection(db, "users", userId, "planillas");
    const snapshot = await getDocs(ref);

    const planillas = [];
    snapshot.forEach((doc) => {
      planillas.push({ id: doc.id, ...doc.data() });
    });

    // Ordena cronológicamente según el ID (YYYY-MM)
    planillas.sort((a, b) => a.id.localeCompare(b.id));

    return planillas;
  } catch (error) {
    console.error("Error al obtener todas las planillas:", error);
    return [];
  }
};

/**
 * Obtiene los datos generales del usuario (no las planillas)
 */
export const obtenerDatosUsuario = async (userId) => {
  const ref = doc(db, "users", userId);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
};
