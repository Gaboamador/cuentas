import React, { useState, useEffect } from "react";
import valoresMapping from "../../utils/valoresMapping";
import styles from "./estilos/modalValores.module.scss";
import bbva from "../../logos/bbva.svg"
import bna from "../../logos/bnaNEW.svg"
import dolares from "../../logos/dolar.svg"
import expensas from "../../logos/octopusNEW.svg"

export default function ModalValores({ valores, setValores, onClose }) {
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
};


return (
    <div className={styles.modalValoresOverlay}>
        <div className={styles.modalValores}>
            <h3>INGRESAR VALORES</h3>
                <div className={styles.inputs}>
                    {Object.entries(grupos).map(([group, items]) => (
                    <div key={group} className={groupClass[group]}>

                        {/* Logo del grupo */}
                        <div className={styles.groupLogosDiv}>
                        {groupLogos[group] && (
                        <img
                            src={groupLogos[group]}
                            alt={group}
                            className={styles.groupLogo}
                        />
                        )}
                        </div>

                        {items.map(({ key, label }) => (
                        <div key={key} className={styles.inputGroup}>
                            <label>{label}</label>
                            <input
                            type="text"
                            name={key}
                            value={localValores[key] || ""}
                            onChange={handleChange}
                            onBlur={() => handleBlur(key)}
                            onFocus={(e) => e.target.select()}
                            />
                        </div>
                        ))}
                    </div>
                    ))}
                </div>
                <div className={styles.botones}>
                    <button onClick={handleCerrar}>Guardar y cerrar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
        </div>
    </div>
);
}
