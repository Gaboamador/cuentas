import React, {useContext} from 'react';
import './App.scss';
import GlobalState from './globalState';
import Context from './context';
import styles from './styles/app.module.scss';
import PlanillasSwiper from './components/PlanillasSwiper';
import Header from './common/Header';
import Auth from './components/Auth';
import UserContext from './context/userContext';
import FaviconUpdater from './components/FaviconUpdater';


function App() {
const { user } = useContext(UserContext);
const context = useContext(Context)
  return (
    <GlobalState>
      <div className={styles.App}>
        {/* <FaviconUpdater primary={context.paleta.primario} secondary={context.paleta.secundario} tertiary={context.paleta.terciario} /> */}
        <Header/>
        {!user ? (
        <Auth/>
        ):(
        <PlanillasSwiper/>
        )}
      </div>
    </GlobalState>
  );
}

export default App;
