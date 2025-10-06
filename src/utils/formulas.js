// src/utils/formulas.js
export const calcularFormulas = (valores = {}) => {
  // Destructuring con valores por defecto
  const {
    colchon= 0,
    visaBBVATotalResumen= 0,
    dbRg5617= 0,
    visaBBVA = 0,
    visaBNA= 0,
    mcBBVA= 0,
    mcBNA= 0,
    valorUSD= 0,
    dolares= 0,
    exp1= 0,
    exp2= 0,
    cajaAhorroActual= 0,
  } = valores;

  // Normalizar a Number
  const n = (x) => Number(x || 0);
  
  const vColchon = n(colchon);
  const vVisaBBVATotalResumen = n(visaBBVATotalResumen);
  const vDbRg5617 = n(dbRg5617);
  const vVisaBBVA = n(visaBBVA);
  const vVisaBNA = n(visaBNA);
  const vMcBBVA = n(mcBBVA);
  const vMcBNA = n(mcBNA);
  const vValorUSD = n(valorUSD);
  const vDolares = n(dolares);
  const vExp1 = n(exp1);
  const vExp2 = n(exp2);
  const vCajaAhorroActual = n(cajaAhorroActual);

  // Cálculos según Excel
  // VISA BBVA = Total resumen - DB. RG 5617
  const visaBBVANetoCalculado = vVisaBBVATotalResumen - vDbRg5617;
  
  // COSTO DOLARES = DOLARES * VALOR USD
  const costoDolares = vDolares * vValorUSD;
  
  // EXPENSAS TOTAL = Expensas_1 + Expensas_2
  const expensasTotal = vExp1 + vExp2;
  
  // SUMA TOTAL = SUMA(C10;F10;C15;F15;C19;C22)
  // C10 = VISA BBVA neto, F10 = MC BBVA, C15 = VISA BNA, F15 = MC BNA, 
  // C19 = COSTO DOLARES, C22 = EXPENSAS TOTAL
  const sumaTotal = visaBBVANetoCalculado + vMcBBVA + vVisaBNA + vMcBNA + costoDolares + expensasTotal;
  
  // DIVIDIDO = SUMA TOTAL / 2
  const dividido = sumaTotal / 2;
  
  // REDONDEADO = MULTIPLO.SUPERIOR(dividido; 5000)
  const redondeado = Math.ceil(dividido / 5000) * 5000;
  
  // BNA → BBVA = SUMA(Colchón; VISA BBVA neto; MC BBVA) - SUMA(Caja ahorro actual; REDONDEADO)
  const bnaBBVA = (vColchon + visaBBVANetoCalculado + vMcBBVA) - (vCajaAhorroActual + redondeado);

  return {
    // Resultados principales
    sumaTotal,
    dividido,
    redondeado,
    bnaBBVA,
    
    // BBVA
    visaBBVANeto: visaBBVANetoCalculado,
    totalResumenBBVA: vVisaBBVATotalResumen,
    dbRg5617: vDbRg5617,
    mcBBVA: vMcBBVA,
    
    // BNA
    visaBNA: vVisaBNA,
    mcBNA: vMcBNA,
    
    // Dólares
    costoDolares,
    
    // Expensas
    expensas: expensasTotal,
    
    // Valores auxiliares
    colchon: vColchon,
    cajaAhorroActual: vCajaAhorroActual,
    dolares: vDolares,
    valorUSD: vValorUSD
  };
};