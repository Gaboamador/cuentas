export default function formatearMes(mesString) {
  const [year, month] = mesString.split("-");
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return `${meses[parseInt(month, 10) - 1]} ${year}`;
}