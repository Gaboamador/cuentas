import Context from './context'
import {useState, useEffect} from 'react'

function GlobalState(props){

    const root = document.documentElement;
    
    const paleta = {
    primario: getComputedStyle(root).getPropertyValue('--color-primario'),
    secundario: getComputedStyle(root).getPropertyValue('--color-secundario'),
    terciario: getComputedStyle(root).getPropertyValue('--color-terciario'),
    textoClaro: getComputedStyle(root).getPropertyValue('--color-texto-claro'),
    textoOscuro: getComputedStyle(root).getPropertyValue('--color-texto-oscuro'),
    };

    return(
        <Context.Provider value={{
            paleta:paleta,
        }}>
            {props.children}
        </Context.Provider>
    )
}

export default GlobalState;