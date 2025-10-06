import React, { useState, useEffect, useContext } from "react";
import { calcularFormulas } from "../../utils/formulas";
import { guardarPlanilla, obtenerPlanilla } from "../../utils/firestoreHelper";
import UserContext from "../../context/userContext";
import styles from './estilos/tablaCuentas.module.scss'
import globalStyles from '../../styles/globalStyles.module.scss'

export default function TablaCuentas() {
  const { user } = useContext(UserContext);
  const mesActual = new Date().toISOString().slice(0,7); // YYYY-MM

  const [valores, setValores] = useState({
    colchon: 0,
    visaBBVATotalResumen: 0,
    dbRg5617: 0,
    visaBNA: 0,
    mcBBVA: 0,
    mcBNA: 0,
    valorUSD: 0,
    dolares: 0,
    exp1: 0,
    exp2: 0,
    cajaAhorroActual: 0,
  });

  const [resultados, setResultados] = useState({});

  // Cargar planilla de Firestore al montar
  useEffect(() => {
    if (!user) return;
    obtenerPlanilla(user.uid, mesActual).then(data => {
      if (data?.valores) setValores(data.valores);
    });
  }, [user]);

  // Calcular resultados cada vez que cambian los valores
  useEffect(() => {
    setResultados(calcularFormulas(valores));
  }, [valores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValores({
      ...valores,
      [name]: parseFloat(value) || 0
    });
  };

  const handleGuardar = async () => {
    if (!user) return alert("Debes iniciar sesión para guardar.");
    await guardarPlanilla(user.uid, mesActual, { valores, resultados });
    alert("Planilla guardada correctamente.");
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
      <table className={styles.tablaCuentas}>
        <tbody>
          {/* SECCIÓN TOTALES */}
          <tr>
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
            <td>
              <input 
                type="number" 
                name="cajaAhorroActual" 
                value={valores.cajaAhorroActual} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
            <td>Redondeado</td>
            <td>${fmt(resultados.redondeado)}</td>
          </tr>
          <tr>
            <td>Colchón</td>
            <td>
              <input 
                type="number" 
                name="colchon" 
                value={valores.colchon} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
            <td>BNA → BBVA</td>
            <td>
              <div>${fmt(resultados.bnaBBVA)}</div>
              <div>USD {fmt(valores.dolares)}</div>
            </td>
          </tr>

          {/* SECCIÓN BBVA */}
          <tr>
            <th colSpan="4">BBVA</th>
          </tr>
          <tr>
            <td>VISA</td>
            <td>${fmt(resultados.visaBBVANeto)}</td>
            <td>MC</td>
            <td>
              <input 
                type="number" 
                name="mcBBVA" 
                value={valores.mcBBVA} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
          </tr>
          <tr>
            <td>Total resumen</td>
            <td>
              <input 
                type="number" 
                name="visaBBVATotalResumen" 
                value={valores.visaBBVATotalResumen} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
          </tr>
          <tr>
            <td>DB. RG 5617</td>
            <td>
              <input 
                type="number" 
                name="dbRg5617" 
                value={valores.dbRg5617} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
          </tr>

          {/* SECCIÓN BNA */}
          <tr>
            <th colSpan="4">BNA</th>
          </tr>
          <tr>
            <td>VISA</td>
            <td>
              <input 
                type="number" 
                name="visaBNA" 
                value={valores.visaBNA} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
            <td>MC</td>
            <td>
              <input 
                type="number" 
                name="mcBNA" 
                value={valores.mcBNA} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
          </tr>

          {/* SECCIÓN DÓLARES */}
          <tr>
            <th colSpan="4">DOLARES / STOP DEBIT</th>
          </tr>
          <tr>
            <td>DOLARES</td>
            <td>
              <input 
                type="number" 
                name="dolares" 
                value={valores.dolares} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
            <td>VALOR USD</td>
            <td>
              <input 
                type="number" 
                name="valorUSD" 
                value={valores.valorUSD} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
          </tr>
          <tr>
            <td>COSTO DOLARES</td>
            <td>${fmt(resultados.costoDolares)}</td>
          </tr>

          {/* SECCIÓN EXPENSAS */}
          <tr>
            <th colSpan="4">EXPENSAS</th>
          </tr>
          <tr>
            <td>Expensas_1</td>
            <td>
              <input 
                type="number" 
                name="exp1" 
                value={valores.exp1} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
            <td>Expensas_2</td>
            <td>
              <input 
                type="number" 
                name="exp2" 
                value={valores.exp2} 
                onChange={handleChange} 
                step="any" 
              />
            </td>
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
</div>
  );
}