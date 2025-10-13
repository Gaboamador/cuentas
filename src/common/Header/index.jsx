import React, {useContext} from "react";
import UserContext from "../../context/userContext";
import styles from "./estilos/header.module.scss";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";


const Header = (props) => {
    const { user } = useContext(UserContext);
        const handleLogout = async () => {
        await signOut(auth);
      };
    
return (
    <header id="header" className={styles.header}>
        <div className={styles.titulo}>CUENTAS GENERALES</div>
        {user &&
        <>
        {/* <span>{user.email}</span> */}
        <button className={styles.logOutButton} onClick={handleLogout}>Cerrar sesión</button>
        </>
        }
    </header>
)
};

export default Header;
