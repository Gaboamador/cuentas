// import React, { useState, useEffect, useContext } from "react";
// import { calcularFormulas } from "../../utils/formulas";
// import { guardarPlanilla, obtenerPlanilla } from "../../utils/firestoreHelper";
// import UserContext from "../../context/userContext";
// import styles from './estilos/tablaCuentas.module.scss'
// import globalStyles from '../../styles/globalStyles.module.scss'

// export default function TablaCuentas({mesActivo}) {
//   const { user } = useContext(UserContext);

//   const [valores, setValores] = useState({
//     colchon: 0,
//     visaBBVATotalResumen: 0,
//     dbRg5617: 0,
//     visaBNA: 0,
//     mcBBVA: 0,
//     mcBNA: 0,
//     valorUSD: 0,
//     dolares: 0,
//     exp1: 0,
//     exp2: 0,
//     cajaAhorroActual: 0,
//   });

//   const [resultados, setResultados] = useState({});

//   // Cargar planilla de Firestore al montar
// useEffect(() => {
//   if (!user || !mesActivo) return;

//   // Aseguramos que mesActivo sea un string simple
//   const mes = String(mesActivo);

//   let isMounted = true;

//   obtenerPlanilla(user.uid, mes).then(data => {
//     if (!isMounted) return;
//     if (data?.valores) setValores(data.valores);
//     else setValores(prev => ({ ...prev })); // reset o deja valores previos
//   });

//   return () => { isMounted = false };
// }, [user, mesActivo?.toString()]);

//   // Calcular resultados cada vez que cambian los valores
//   useEffect(() => {
//     setResultados(calcularFormulas(valores));
//   }, [valores]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setValores({
//       ...valores,
//       [name]: parseFloat(value) || 0
//     });
//   };

//     const handleGuardar = async () => {
//     if (!user) return alert("Debes iniciar sesión para guardar.");
//     if (!mesActivo) return alert("No hay mes activo definido.");
//     await guardarPlanilla(user.uid, mesActivo, { valores, resultados });
//     alert(`Planilla de ${mesActivo} guardada correctamente.`);
//   };

//   const fmt = (n) => 
//     n === undefined || n === null || Number.isNaN(Number(n)) 
//       ? "" 
//       : new Intl.NumberFormat('es-AR', {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2
//         }).format(n);
import React, { useState, useEffect, useContext } from "react";
import { calcularFormulas } from "../../utils/formulas";
import { guardarPlanilla } from "../../utils/firestoreHelper";
import UserContext from "../../context/userContext";
import styles from './estilos/tablaCuentas.module.scss'
import globalStyles from '../../styles/globalStyles.module.scss'
import valoresMapping from "../../utils/valoresMapping";
import ModalValores from "../ModalValores";

export default function TablaCuentas({ planilla, onGuardar }) {
  const { user } = useContext(UserContext);

// const [valores, setValores] = useState(
//   planilla.data?.valores ||
//   Object.keys(valoresMapping).reduce((acc, key) => {
//     acc[key] = "";
//     return acc;
//   }, {})
// );
const [valores, setValores] = useState(() => {
  const inicial = planilla.data?.valores || Object.keys(valoresMapping).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});
  
  // Forzamos que colchon sea 20000
  inicial.colchon = 20000;
  
  return inicial;
});


const [mostrarModal, setMostrarModal] = useState(false);
const [resultados, setResultados] = useState(planilla.data?.resultados || {});

// 🔁 Cuando cambia la planilla (por swipe)
// useEffect(() => {
//   setValores(
//     planilla.data?.valores ||
//     Object.keys(valoresMapping).reduce((acc, key) => {
//       acc[key] = ""; // 👈 también vacío acá
//       return acc;
//     }, {})
//   );
//   setResultados(planilla.data?.resultados || {});
// }, [planilla]);
useEffect(() => {
  const inicial = planilla.data?.valores || Object.keys(valoresMapping).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  // Colchón siempre 20000
  inicial.colchon = 20000;

  setValores(inicial);
  setResultados(planilla.data?.resultados || {});
}, [planilla]);

// 🧮 Calcular resultados cada vez que cambian los valores
useEffect(() => {
  setResultados(calcularFormulas(valores));
}, [valores]);


  const handleGuardar = async () => {
    if (!user) return alert("Debes iniciar sesión");
    await guardarPlanilla(user.uid, planilla.mes, { valores, resultados });
    alert(`Planilla de ${planilla.mes} guardada correctamente!`);

    // Avisamos al componente padre que ya se guardó
    onGuardar(planilla.mes, { valores, resultados });
  };

  const fmt = (n) => 
    n === undefined || n === null || Number.isNaN(Number(n)) 
      ? "" 
      : new Intl.NumberFormat('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(n);
        

  return (
  <div className={globalStyles.componentMain}>
    <div className={styles.tablaCuentasContainer}>
      <button onClick={() => setMostrarModal(true)}>Ingresar datos</button>
      <table className={styles.tablaCuentas}>
        <tbody>
          {/* SECCIÓN TOTALES */}
          <tr data-bank="totales">
            <th colSpan="4">TOTALES</th>
          </tr>
          <tr>
            <td>SUMA TOTAL</td>
            <td>${fmt(resultados.sumaTotal)}</td>
            <td>Dividido</td>
            <td>${fmt(resultados.dividido)}</td>
          </tr>
          <tr>
            <td>Caja ahorro actual</td>
            <td>${fmt(valores.cajaAhorroActual)}</td>
            <td>Redondeado</td>
            <td>${fmt(resultados.redondeado)}</td>
          </tr>
          <tr>
            <td>Colchón</td>
            <td>${fmt(valores.colchon)}</td>
            <td>BNA → BBVA</td>
            <td>
              <div>${fmt(resultados.bnaBBVA)}</div>
              <div>USD {fmt(valores.dolares)}</div>
            </td>
          </tr>

          {/* SECCIÓN BBVA */}
          <tr data-bank="bbva">
            <th colSpan="4">BBVA</th>
          </tr>
          <tr>
            <td>VISA</td>
            <td>${fmt(resultados.visaBBVANeto)}</td>
            <td>MC</td>
            <td>${fmt(valores.mcBBVA)}</td>
          </tr>
          <tr>
            <td>Total resumen</td>
            <td>${fmt(valores.visaBBVATotalResumen)}</td>
          </tr>
          <tr>
            <td>DB. RG 5617</td>
            <td>${fmt(valores.dbRg5617)}</td>
          </tr>

          {/* SECCIÓN BNA */}
          <tr data-bank="bna">
            <th colSpan="4">BNA</th>
          </tr>
          <tr>
            <td>VISA</td>
            <td>${fmt(valores.visaBNA)}</td>
            <td>MC</td>
            <td>${fmt(valores.mcBNA)}</td>
          </tr>

          {/* SECCIÓN DÓLARES */}
          <tr data-bank="dolares">
            <th colSpan="4">DOLARES / STOP DEBIT</th>
          </tr>
          <tr>
            <td>DOLARES</td>
            <td>${fmt(valores.dolares)}</td>
            <td>VALOR USD</td>
            <td>${fmt(valores.valorUSD)}</td>
          </tr>
          <tr>
            <td>COSTO DOLARES</td>
            <td>${fmt(resultados.costoDolares)}</td>
          </tr>

          {/* SECCIÓN EXPENSAS */}
          <tr data-bank="expensas">
            <th colSpan="4">EXPENSAS</th>
          </tr>
          <tr>
            <td>Expensas_1</td>
            <td>${fmt(valores.exp1)}</td>
            <td>Expensas_2</td>
            <td>${fmt(valores.exp2)}</td>
          </tr>
          <tr>
            <td>Expensas Total</td>
            <td>${fmt(resultados.expensas)}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={handleGuardar} style={{marginTop: "10px"}}>
        Guardar planilla
      </button>
    </div>

    {mostrarModal && (
      <ModalValores
        valores={valores}
        setValores={setValores}
        onClose={() => setMostrarModal(false)}
      />
    )}
</div>
  );
}