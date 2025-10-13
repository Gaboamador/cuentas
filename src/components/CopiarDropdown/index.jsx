import { useState, useRef, useEffect } from "react";
import styles from "./estilos/copiarDropdown.module.scss";

export default function CopiarDropdown({ opciones }) {
  const [abierto, setAbierto] = useState(false);
  const dropdownRef = useRef();

  // Cerramos el dropdown al clickear fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (texto) => {
    navigator.clipboard.writeText(texto);
    alert("Copiado al portapapeles!");
    setAbierto(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.botonPrincipal}
        onClick={() => setAbierto(!abierto)}
      >
        Copiar...
        <span className={styles.flecha}>{abierto ? "▲" : "▼"}</span>
      </button>

      {abierto && (
        <div className={styles.menu}>
          {opciones.map((op) => (
            <div
              key={op.label}
              className={styles.item}
              onClick={() => handleClick(op.texto)}
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
