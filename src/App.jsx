import React, {useContext} from 'react';
import './App.scss';
import styles from './styles/app.module.scss';
import PlanillasSwiper from './components/PlanillasSwiper';
import Header from './common/Header';
import Auth from './components/Auth';
import UserContext from './context/userContext';


function App() {
const { user } = useContext(UserContext);
  return (
    <div className={styles.App}>
      <Header/>
      {!user ? (
      <Auth/>
      ):(
      <PlanillasSwiper/>
      )}
    </div>
  );
}

export default App;
