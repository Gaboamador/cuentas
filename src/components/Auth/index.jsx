import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import styles from './estilos/auth.module.scss'

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authTitle}>Inicie sesión para ver sus planillas</div>
      <div className={styles.authInputContainer}>
        <div className={`${styles.authInputGroup}`}>
          <label className={styles.authLabel}>Correo electrónico</label>
            <div className={styles.passwordWrapper}>
              <input className={styles.authInput} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
        </div>
        <div className={`${styles.authInputGroup}`}>
          <label className={styles.authLabel}>Contraseña</label>
          <div className={styles.passwordWrapper}>
            <input className={styles.authInput} placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} />
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
      </div>
      <button className={`btn btn--primario ${styles.loginButton}`} onClick={handleLogin}>Login</button>
    </div>
  );
}
