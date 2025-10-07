import React, { useEffect, useState, useRef, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { obtenerTodasLasPlanillas, guardarPlanilla } from "../../utils/firestoreHelper";
import TablaCuentas from "../TablaCuentas";
import UserContext from "../../context/userContext";

export default function PlanillasSwiper() {
  const { user } = useContext(UserContext);
  const [planillas, setPlanillas] = useState([]);
  const [planillaActivaIndex, setPlanillaActivaIndex] = useState(0);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [nuevoMes, setNuevoMes] = useState("");
  const [nuevoAnio, setNuevoAnio] = useState(new Date().getFullYear());
  const swiperRef = useRef(null);

  const meses = ["01","02","03","04","05","06","07","08","09","10","11","12"];

  // Traer todas las planillas del usuario
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const data = await obtenerTodasLasPlanillas(user.uid);
      const adaptadas = data.map(p => ({
        mes: p.id || p.mes,
        data: p,
        guardada: true
      }));
      
      adaptadas.sort((a,b) => a.mes.localeCompare(b.mes));
      setPlanillas(adaptadas);

      // Mes actual
    const mesActual = new Date().toISOString().slice(0,7); // 'YYYY-MM'

    // Buscar índice de la planilla del mes actual
    let index = adaptadas.findIndex(p => p.mes === mesActual);

    if (index === -1) {
      // Si no existe, buscar la planilla más reciente anterior
      const anteriores = adaptadas.filter(p => p.mes < mesActual);
      if (anteriores.length > 0) {
        index = adaptadas.findIndex(p => p.mes === anteriores[anteriores.length - 1].mes);
      } else {
        // Si no hay ninguna planilla anterior, mostrar la primera
        index = 0;
      }
    }

      // Activar último mes (más reciente)
      setPlanillaActivaIndex(index);
      setTimeout(() => swiperRef.current?.slideTo(index), 100);
    };
    fetchData();
  }, [user]);

  // Crear planilla en blanco localmente
  const crearPlanillaEnBlanco = () => setMostrarSelector(true);

  const confirmarNuevoMes = () => {
    if (!nuevoMes || !nuevoAnio) return;
    const mesFormateado = `${nuevoAnio}-${nuevoMes}`;

    // Verificar duplicado
    if (planillas.some(p => p.mes === mesFormateado)) {
      alert("Ya existe una planilla para ese mes");
      return;
    }

    const nueva = { mes: mesFormateado, data: {}, guardada: false };

    setPlanillas(prev => {
      const nuevoArray = [...prev, nueva].sort((a,b) => a.mes.localeCompare(b.mes));
      const index = nuevoArray.findIndex(p => p.mes === mesFormateado);
      setPlanillaActivaIndex(index);
      setTimeout(() => swiperRef.current?.slideTo(index), 100);
      return nuevoArray;
    });

    setMostrarSelector(false);
  };

  const irAlMes = (mes) => {
    const index = planillas.findIndex(p => p.mes === mes);
    if (index !== -1) {
      setPlanillaActivaIndex(index);
      swiperRef.current?.slideTo(index);
    }
  };

  // Callback para marcar planilla como guardada después de guardar
  const handleGuardarLocal = (mes, data) => {
    setPlanillas(prev =>
      prev.map(p => p.mes === mes ? { ...p, data, guardada: true } : p)
    );
  };

  if (!user) return <p>Inicie sesión para ver sus planillas</p>;

  return (
    <div style={{ width:"100%", maxWidth:"100vw" }}>
      <div style={{ marginBottom:"1rem" }}>
        <button onClick={crearPlanillaEnBlanco}>➕ Planilla en blanco</button>
        <select onChange={(e) => irAlMes(e.target.value)} defaultValue="">
          <option value="">Ir al mes...</option>
          {planillas.map(p => (
            <option key={p.mes} value={p.mes}>{p.mes}</option>
          ))}
        </select>
      </div>

      {mostrarSelector && (
        <div style={{ border:"1px solid #ccc", padding:"1rem", marginBottom:"1rem", display:"inline-block", borderRadius:"8px" }}>
          <h4>Seleccionar mes y año</h4>
          <div style={{ display:"flex", gap:"0.5rem" }}>
            <select value={nuevoMes} onChange={(e) => setNuevoMes(e.target.value)}>
              <option value="">Mes</option>
              {meses.map((m,i) => (
                <option key={m} value={m}>{new Date(0,i).toLocaleString("es-AR",{month:"long"})}</option>
              ))}
            </select>
            <select value={nuevoAnio} onChange={(e)=>setNuevoAnio(e.target.value)}>
              {Array.from({length:6},(_,i)=> new Date().getFullYear()-2+i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={confirmarNuevoMes}>Confirmar</button>
            <button onClick={()=>setMostrarSelector(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <Swiper
        onSwiper={(swiper)=>swiperRef.current = swiper}
        spaceBetween={30}
        slidesPerView={1}
        onSlideChange={(swiper)=>setPlanillaActivaIndex(swiper.activeIndex)}
      >
        {planillas.map((planilla,i)=>(
          <SwiperSlide key={i}>
            <div style={{ padding:"1rem" }}>
              <h3>Planilla: {planilla.mes}</h3>
              <TablaCuentas
                planilla={planilla}
                onGuardar={handleGuardarLocal}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// import React, { useEffect, useState, useRef, useContext } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.css";
// import { obtenerTodasLasPlanillas, guardarPlanilla } from "../../utils/firestoreHelper";
// import TablaCuentas from "../TablaCuentas";
// import UserContext from "../../context/userContext";

// export default function PlanillasSwiper() {
//   const { user } = useContext(UserContext);
//   const [planillas, setPlanillas] = useState([]);
//   const [planillaActivaIndex, setPlanillaActivaIndex] = useState(0);
//   const [mostrarSelector, setMostrarSelector] = useState(false);
//   const [nuevoMes, setNuevoMes] = useState("");
//   const [nuevoAnio, setNuevoAnio] = useState(new Date().getFullYear());
//   const swiperRef = useRef(null);

//   const meses = ["01","02","03","04","05","06","07","08","09","10","11","12"];

//   // Traer todas las planillas del usuario
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;
//       const data = await obtenerTodasLasPlanillas(user.uid);
//       const adaptadas = data.map((p) => ({
//         mes: p.id || p.mes,
//         ...p,
//       }));
//       adaptadas.sort((a, b) => a.mes.localeCompare(b.mes));
//       setPlanillas(adaptadas);
//     };
//     fetchData();
//   }, [user]);

//   // Crear planilla en blanco (seleccionando mes y año)
//   const crearPlanillaEnBlanco = async () => {
//     setMostrarSelector(true);
//   };

//   const confirmarNuevoMes = async () => {
//     if (!nuevoMes || !nuevoAnio) return;
//     const mesFormateado = `${nuevoAnio}-${nuevoMes}`;

//     const nueva = { mes: mesFormateado, userId: user.uid, data: {} };

//     // Guardar en Firestore (crea o actualiza)
//     await guardarPlanilla(user.uid, mesFormateado, {});

//     setPlanillas(prev => {
//       const existe = prev.find(p => p.mes === mesFormateado);
//       let nuevoArray;
//       if (existe) {
//         nuevoArray = prev.map(p => p.mes === mesFormateado ? nueva : p);
//       } else {
//         nuevoArray = [...prev, nueva];
//       }
//       nuevoArray.sort((a, b) => a.mes.localeCompare(b.mes));

//       const index = nuevoArray.findIndex(p => p.mes === mesFormateado);
//       setPlanillaActivaIndex(index);

//       // Mover Swiper al índice
//       setTimeout(() => {
//         if (swiperRef.current) swiperRef.current.slideTo(index);
//       }, 100);

//       return nuevoArray;
//     });

//     setMostrarSelector(false);
//   };

//   const irAlMes = (mes) => {
//     const index = planillas.findIndex(p => p.mes === mes);
//     if (index !== -1 && swiperRef.current) {
//       swiperRef.current.slideTo(index);
//       setPlanillaActivaIndex(index);
//     }
//   };

//   if (!user) return <p>Inicie sesión para ver sus planillas</p>;

//   const mesActivo = planillas[planillaActivaIndex]?.mes || null;

//   return (
//     <div style={{ width: "100%", maxWidth: "100vw" }}>
//       <div style={{ marginBottom: "1rem" }}>
//         <button onClick={crearPlanillaEnBlanco}>➕ Planilla en blanco</button>
//         <select onChange={(e) => irAlMes(e.target.value)} defaultValue="">
//           <option value="">Ir al mes...</option>
//           {planillas.map((p) => (
//             <option key={p.mes} value={p.mes}>
//               {p.mes}
//             </option>
//           ))}
//         </select>
//       </div>

//       {mostrarSelector && (
//         <div
//           style={{
//             border: "1px solid #ccc",
//             padding: "1rem",
//             marginBottom: "1rem",
//             display: "inline-block",
//             borderRadius: "8px",
//           }}
//         >
//           <h4>Seleccionar mes y año</h4>
//           <div style={{ display: "flex", gap: "0.5rem" }}>
//             <select value={nuevoMes} onChange={(e) => setNuevoMes(e.target.value)}>
//               <option value="">Mes</option>
//               {meses.map((m, i) => (
//                 <option key={m} value={m}>
//                   {new Date(0, i).toLocaleString("es-AR", { month: "long" })}
//                 </option>
//               ))}
//             </select>

//             <select value={nuevoAnio} onChange={(e) => setNuevoAnio(e.target.value)}>
//               {Array.from({ length: 6 }, (_, i) => {
//                 const y = new Date().getFullYear() - 2 + i;
//                 return (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 );
//               })}
//             </select>

//             <button onClick={confirmarNuevoMes}>Confirmar</button>
//             <button onClick={() => setMostrarSelector(false)}>Cancelar</button>
//           </div>
//         </div>
//       )}

//       <Swiper
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         spaceBetween={30}
//         slidesPerView={1}
//         onSlideChange={(swiper) => setPlanillaActivaIndex(swiper.activeIndex)}
//       >
//         {planillas.map((planilla, i) => (
//           <SwiperSlide key={i}>
//             <div style={{ padding: "1rem" }}>
//               <h3>Planilla: {planilla.mes}</h3>
//               <TablaCuentas data={planilla.data} mesActivo={mesActivo} />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
