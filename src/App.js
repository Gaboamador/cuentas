import React, {useContext, useState} from 'react';
import UserContext from './context/userContext';
import './App.css';
import styles from './styles/app.module.scss';
import Auth from './components/Auth';
import TablaCuentas from './components/TablaCuentas';
import SelectorMeses from './components/SelectorMeses';
import { obtenerPlanilla } from './utils/firestoreHelper';
import PlanillasSwiper from './components/PlanillasSwiper';


function App() {
  const { user } = useContext(UserContext);
  const [planilla, setPlanilla] = useState(null);

  const handleSeleccionarMes = async (mes) => {
    if (!user || !mes) return;
    const data = await obtenerPlanilla(user.uid, mes);
    setPlanilla(data);
  };

  return (
    <div className={styles.App}>
      <Auth/>
      
      {/* {user && <TablaCuentas />} */}
      {/* {user && (
        <>
          <SelectorMeses onSeleccionarMes={handleSeleccionarMes} />
          {planilla ? (
            <TablaCuentas data={planilla} />
          ) : (
            <p>Seleccione un mes para ver la planilla</p>
          )}
        </>
      )}
      {!user && <p>Debés iniciar sesión para ver las planillas.</p>} */}
      <PlanillasSwiper />
    </div>
  );
}

export default App;
