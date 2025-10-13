import React, { useState, useEffect, useContext } from "react";
import { calcularFormulas } from "../../utils/formulas";
import { guardarPlanilla, obtenerDatosUsuario } from "../../utils/firestoreHelper";
import UserContext from "../../context/userContext";
import styles from './estilos/tablaCuentas.module.scss'
import valoresMapping from "../../utils/valoresMapping";
import ModalValores from "../ModalValores";
import formatearMes from "../../utils/formatearMes";
import { FiEdit } from "react-icons/fi";
import CopiarBoton from "../CopiarBoton";
import textos from "../../utils/textos";
import CopiarDropdown from "../CopiarDropdown";

export default function TablaCuentas({ planilla, onGuardar, mostrarModal, setMostrarModal }) {
  const { user } = useContext(UserContext);

const [valores, setValores] = useState(() => {
  const inicial = planilla.data?.valores || Object.keys(valoresMapping).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});
  
  // Forzamos que colchon sea 20000
  inicial.colchon = 20000;
  
  return inicial;
});

// const [mostrarModal, setMostrarModal] = useState(false);
const [resultados, setResultados] = useState(planilla.data?.resultados || {});

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


        // Función para obtener el mes anterior en formato 'YYYY-MM'
const obtenerMesAnterior = (mesActual) => {
  const [anio, mes] = mesActual.split('-').map(Number); // asume formato 'YYYY-MM'
  const fecha = new Date(anio, mes - 1, 1); // mes -1 porque JS usa 0-index
  fecha.setMonth(fecha.getMonth() - 1); // retrocedemos un mes
  const anioAnterior = fecha.getFullYear();
  const mesAnterior = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${anioAnterior}-${mesAnterior}`;
};
const mesAnterior = obtenerMesAnterior(planilla.mes);

        const [direccion, setDireccion] = useState(null)
    const [detalle, setDetalle] = useState(null)
    const [depto, setDepto] = useState(null)
    const [cochera, setCochera] = useState(null)
    const [nombre, setNombre] = useState(null)
  useEffect(() => {
    if (!user) return;

    const fetchPerfil = async () => {
      const data = await obtenerDatosUsuario(user.uid);
      setDireccion(data.direccion);
      setDetalle(`${data.depto} + ${data.cochera}`)
      setDepto(data.depto)
      setCochera(data.cochera)
      setNombre(data.nombre)
    };

    fetchPerfil();
  }, [user]);
        
  return (
  <div>
    <div className={styles.tablaCuentasContainer}>
      <div className={styles.tituloTablaContainer}>
        <div className={styles.tituloTabla}>
          {formatearMes(planilla.mes).toUpperCase()}
        </div>
          
        <button
          onClick={() => setMostrarModal(true)}
          className={styles.ingresarDatosButton}
          >
          <span><FiEdit/></span>
          <span>Ingresar datos</span>
        </button>

        <div>
          {/* <CopiarBoton label={'email'} texto={textos.paraPortapapeles.MAIL_COMPROBANTE} />
          <CopiarBoton label={'asunto'} texto={textos.paraPortapapeles.ASUNTO(formatearMes(mesAnterior), direccion, detalle)} />
          <CopiarBoton label={'cuerpo'} texto={textos.paraPortapapeles.CUERPO(depto, cochera, `$${fmt(valores.exp1)}`, `$${fmt(valores.exp2)}`, `$${fmt(resultados.expensas)}`, nombre)} /> */}
        <CopiarDropdown
          opciones={[
            { label: "Destinatario", texto: textos.paraPortapapeles.MAIL_COMPROBANTE },
            {
              label: "Asunto",
              texto: textos.paraPortapapeles.ASUNTO(
                formatearMes(mesAnterior),
                direccion,
                detalle
              ),
            },
            {
              label: "Cuerpo",
              texto: textos.paraPortapapeles.CUERPO(
                depto,
                cochera,
                `$${fmt(valores.exp1)}`,
                `$${fmt(valores.exp2)}`,
                `$${fmt(resultados.expensas)}`,
                nombre
              ),
            },
          ]}
        />

        </div>
      </div>
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
            <th colSpan="4">{valoresMapping.exp1.group.toUpperCase()}</th>
          </tr>
          <tr>
            <td>{valoresMapping.exp1.label}</td>
            <td>${fmt(valores.exp1)}</td>
            <td>{valoresMapping.exp2.label}</td>
            <td>${fmt(valores.exp2)}</td>
          </tr>
          <tr>
            <td>Expensas Total</td>
            <td>${fmt(resultados.expensas)}</td>
          </tr>
        </tbody>
      </table>

      <button className={styles.guardarPlanillaButton} onClick={handleGuardar}>
        Guardar planilla
      </button>
    </div>

    {mostrarModal && (
      <ModalValores
        valores={valores}
        setValores={setValores}
        onClose={() => setMostrarModal(false)}
        mesActual={planilla.mes}
      />
    )}
</div>
  );
}