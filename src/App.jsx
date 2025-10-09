import React from 'react';
import './App.scss';
import styles from './styles/app.module.scss';
import PlanillasSwiper from './components/PlanillasSwiper';
import Header from './common/Header';


function App() {

  return (
    <div className={styles.App}>
      <Header/>
      <PlanillasSwiper/>
    </div>
  );
}

export default App;
