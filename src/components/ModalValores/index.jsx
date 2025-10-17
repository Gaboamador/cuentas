import React, { useState, useEffect, useContext } from "react";
import UserContext from '../../context/userContext'
import getValoresMapping from "../../utils/valoresMapping";
import { obtenerDatosUsuario } from "../../utils/firestoreHelper";
import styles from "./estilos/modalValores.module.scss";
import bbva from "../../logos/bbva.svg"
import bna from "../../logos/bna.svg"
import dolares from "../../logos/dolar.svg"
import expensas from "../../logos/octopus.svg"
import mc from "../../logos/mc.svg"
import visa from "../../logos/visa.svg"
import formatearMes from "../../utils/formatearMes";

export default function ModalValores({ valores, setValores, onClose, mesActual }) {
  const { user } = useContext(UserContext);
  const [depto, setDepto] = useState(null)
  const [cochera, setCochera] = useState(null)
  const valoresMapping = getValoresMapping(depto, cochera);
  useEffect(() => {
      if (!user) return;

      const fetchPerfil = async () => {
        const data = await obtenerDatosUsuario(user.uid);
        setDepto(data.depto)
        setCochera(data.cochera)
      };

      fetchPerfil();
    }, [user]);
  const [localValores, setLocalValores] = useState({});

  // Inicializamos valores con formato (coma + puntos) o vacíos
  useEffect(() => {
    const inicial = {};
    Object.keys(valoresMapping).forEach((key) => {
      const val = valores[key];
      if (val !== undefined && val !== null && val !== 0) {
        const partes = val.toString().split(".");
        const entera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const decimal = partes[1] || "";
        inicial[key] = decimal ? `${entera},${decimal}` : entera;
      } else {
        inicial[key] = "";
      }
    });
    setLocalValores(inicial);
  }, [valores]);

  // Convierte texto con puntos y coma a número real
  const parseNumero = (texto) => {
    if (!texto) return 0;
    const normalizado = texto.replace(/\./g, "").replace(",", ".");
    return parseFloat(normalizado) || 0;
  };

  // Formatea número con puntos y coma para mostrar
  const formatNumero = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    const [entera, decimal] = num.toString().split(",");
    const ent = entera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return decimal ? `${ent},${decimal}` : ent;
  };

  // Cambios en tiempo real, coma permitida, puntos solo al perder foco
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^[\d,]*$/.test(value) || value === "") {
      setLocalValores((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Al perder foco, aplicamos puntos automáticamente
  const handleBlur = (name) => {
    setLocalValores((prev) => ({
      ...prev,
      [name]: formatNumero(prev[name]),
    }));
  };

  const handleCerrar = () => {
    const nuevosValores = {};
    Object.keys(localValores).forEach((k) => {
      nuevosValores[k] = parseNumero(localValores[k]);
    });
    setValores(nuevosValores);
    onClose();
  };

const grupos = Object.entries(valoresMapping).reduce((acc, [key, { label, group }]) => {
  if (!acc[group]) acc[group] = [];
  acc[group].push({ key, label });
  return acc;
}, {});

const groupClass = {
  colchon: styles.groupColchon,
  inicio: styles.groupInicio,
  bbva: styles.groupBBVA,
  bna: styles.groupBNA,
  dolares: styles.groupDolares,
  expensas: styles.groupExpensas,
};

const groupLogos = {
  bbva: bbva,
  bna: bna,
  dolares: dolares,
  expensas: expensas,
  MasterCard: mc,
  VISA: visa,
  "VISA (Total resumen)": visa,
};

return (
    <div className={styles.modalValoresOverlay}>
        <div className={styles.modalValores}>
            <div className={styles.modalTitulo}>INGRESAR VALORES - {formatearMes(mesActual)}</div>
                <div className={styles.inputs}>
                    {Object.entries(grupos).map(([group, items]) => (
                    <div key={group} className={`${styles.groups} ${groupClass[group]} ${styles.groupsDiv}`}>

                        <div>
                          {groupLogos[group] && (
                            <div className={styles.groupLogosDiv}>
                              <img
                                  src={groupLogos[group]}
                                  alt={group}
                                  className={styles.groupLogo}
                              />
                            </div>
                          )}
                        </div>

                        {items.map(({ key, label }) => {
                          const hasLogo = !!groupLogos[label];
                          return (
                          <div key={key} className={styles.inputGroup}>
                            <div className={styles.labelLogoWrapper}>
                              {/* {!hasLogo &&
                              <label>{label}</label>
                              } */}
                              {/* <label>{label}</label> */}
                              {hasLogo && (
                                <img
                                  src={groupLogos[label]}
                                  alt={label}
                                  className={styles.labelLogo}
                                />
                              )}
                              <label className={styles.inputLabel}>{label}</label>
                            </div>
                            <input
                              type="text"
                              name={key}
                              value={localValores[key] || ""}
                              onChange={handleChange}
                              onBlur={() => handleBlur(key)}
                              onFocus={(e) => e.target.select()}
                            />
                        </div>
                      )})}
                    </div>
                    ))}
                </div>
                <div className={styles.botones}>
                    <button className={'btn btn--primario'} onClick={handleCerrar}>Guardar y cerrar</button>
                    <button className={'btn btn--primario'} onClick={onClose}>Cancelar</button>
                </div>
        </div>
    </div>
);
}
