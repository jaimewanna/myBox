<?php

require_once '../../utilitarios/notificaciones/enviarNotificacion.php';
require_once '../../dataAccess/dalCaja.php';

$cajas = consultarCajaSinNotificar();

foreach ($cajas as $key => $caja) {

    $listaClientes = consultarClientesPorCajaServicio($caja);

    foreach ($listaClientes as $key => $cliente) {

        var_dump($cliente->nombre);

        if ($cliente->telefono != null) {

            $mensaje = 'Hola ' . $cliente->nombre . " 👋%0A%0A";
            $mensaje .= 'Hoy se formó en Asunción la caja ' . $cliente->empresaEntrega . "*%0A%0A";
            $mensaje .= "Por favor verifícalo en el sistema para que estes informado. 🤗%0A%0A";
            $mensaje .= 'Muchas gracias 🙇‍♀️%0A%0A*mybox*';

            echo $mensaje;

            sendWppMessageMybox($mensaje, $cliente->telefono);
        }
    }

    actualizarCajaNotificadaServicio($caja);
}
