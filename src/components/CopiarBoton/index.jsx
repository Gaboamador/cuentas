import React, { useState } from "react";
import styles from './estilos/copiarBoton.module.scss'

function CopiarBoton({ label, texto }) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch (err) {
      console.error("Error al copiar: ", err);
    }
  };

  return (
    <button onClick={handleCopy} className={styles.botonCopiar}>
      {copiado ? "Copiado!" : `Copiar ${label}`}
    </button>
  );
}

export default CopiarBoton;
