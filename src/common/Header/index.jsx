import React, {useContext} from "react";
import UserContext from "../../context/userContext";
import styles from "./estilos/header.module.scss";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import logo from '../../logo.svg'


const Header = (props) => {
    const { user } = useContext(UserContext);
        const handleLogout = async () => {
        await signOut(auth);
      };
    
return (
    <header id="header" className={styles.header}>
        <div className={styles.logoTitulo}>
        <img src={logo} alt={""} className={styles.logo}/>
        <div className={styles.titulo}>PayDesk</div>
        </div>
        {user &&
        <>
        <button className={`btn btn--primario ${styles.logOutButton}`} onClick={handleLogout}>Cerrar sesión</button>
        </>
        }
    </header>
)
};

export default Header;
