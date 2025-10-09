import React from "react";
import styles from "./estilos/header.module.scss";
import Auth from "../../components/Auth";


const Header = (props) => {
return (
    <header id="header" className={styles.header}>
        <div className={styles.titulo}>CUENTAS GENERALES</div>
        <Auth/>
    </header>
)
};

export default Header;
