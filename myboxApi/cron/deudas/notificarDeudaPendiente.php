<?php
require_once '../../businessLogic/gestorPago.php';
require_once '../../dataAccess/dalCliente.php';
require_once '../../utilitarios/notificaciones/enviarNotificacion.php';
require_once '../../utilitarios/email/sendEmailGeneric.php';

$listaClientes = obtenerClientesTotalServicio();

$error = '';

 foreach ($listaClientes as $index => $cliente) {
    
    $cliente->clienteId = $cliente->id;

    $datosDeuda = calcularDeudaCliente($cliente);    

    $saldo = $datosDeuda["saldo"];

    if ($saldo > 10 && $cliente->telefono != null && ($cliente->empresaId == 1 || $cliente->empresaId == 4 || $cliente->empresaId == 5)) {

       $mensaje = 'Hola ' . $cliente->nombre . " 👋%0A%0A";
        $mensaje .= 'A la fecha tienes un saldo pendiente de *US$' . number_format((float)$saldo, 2, '.', '') . "*%0A%0A";
        $mensaje .= "Si existe algún error en el cálculo, házmelo saber, por el mismo whatsapp que habitualmente nos comunicamos. 🤗%0A%0A";
        $mensaje .= 'Muchas gracias 🙇‍♀️%0A%0A*mybox*';

        $responseNotificacion = sendWppMessageMybox($mensaje, $cliente->telefono);

        echo $responseNotificacion. "<br>";

    }
}