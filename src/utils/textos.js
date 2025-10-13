const textos = {
    paraPortapapeles: {
        MAIL_COMPROBANTE: "pagoexpensasbyz@gmail.com",
        ASUNTO: (mes, dir, detalle) => `Comprobante expensas (${mes}) - ${dir}, ${detalle}`,
        CUERPO: (depto, cochera, expDepto, expCochera, expTotal, nombre) => `La transferencia realizada corresponde al importe de las expensas del ${depto} (${expDepto}), y de la ${cochera} (${expCochera}). La suma de ambos importes constituye el monto total transferido de ${expTotal}, el cual se acredita con el comprobante adjunto.\nAtentamente.\n${nombre}.`,
    },
};
export default textos;