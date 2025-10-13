// src/components/Auth.jsx
import React, { useState, useContext } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import UserContext from "../../context/userContext";
import styles from './estilos/auth.module.scss'

export default function Auth() {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleRegister = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

    const handleLogout = async () => {
    await signOut(auth);
  };

  // if (user) return (
  //   <div>
  //     <p>Bienvenido, {user.email}</p>
  //     <button onClick={handleLogout}>Cerrar sesión</button>
  //   </div>
  // );

  return (
    <div>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p className={styles.notLoggedIn}>Inicie sesión para ver sus planillas</p>
      {/* <button onClick={handleRegister}>Registrar</button> */}
    </div>
  );
}
