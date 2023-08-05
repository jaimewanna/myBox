
let myboxInstance = 'instance22063'
let baboxInstance = ''
let myboxToken = 'irkso68m9o8tvysg'
let baboxToken = ''

function notificacionDeuda(nombreCliente, monto, destinatario, empresa) {

    mensaje = `
    Hola ${nombreCliente}

    A la fecha tiene un saldo pendiente de US$ ${monto}
    Si existe algún error en el cálculo, háganoslo saber, por el mismo whatsapp que habitualmente nos comunicamos.

    Muchas gracias.    
    `

    if (empresa == 3) {
        envioNotificacionWpp(mensaje, destinatario, baboxInstance, baboxToken)
    } else {
        envioNotificacionWpp(mensaje, destinatario, myboxInstance, myboxToken)
    }
}

function notificacionCreacionCaja(nombreCliente, destinatario, empresa) {

    mensaje = `
    Hola ${nombreCliente}

    Hoy se formaron nuevas cajas para ser enviadas.  
    Por favor verifícalo en el sistema para que estes informado. 
    
    Muchas gracias.    
    `

    if (empresa == 3) {
        envioNotificacionWpp(mensaje, destinatario, baboxInstance, baboxToken)
    } else {
        envioNotificacionWpp(mensaje, destinatario, myboxInstance, myboxToken)
    }
}

function envioNotificacionWpp(mensaje, destinatario, instancia, token) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.ultramsg.com/" + instancia + "/messages/chat",
        "method": "POST",
        "headers": {},
        "data": {
            "token": token,
            "to": destinatario,
            "body": mensaje,
            "priority": "10",
            "referenceId": ""
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}