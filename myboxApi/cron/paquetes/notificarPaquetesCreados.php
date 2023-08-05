<?php

require_once '../../utilitarios/notificaciones/enviarNotificacion.php';
require_once '../../dataAccess/dalPaquete.php';

$paquetes = consultarPaqueteSinNotificar();

echo "Empezo el proceso<br>";

var_dump($paquetes);

foreach ($paquetes as $key => $paquete) {

    $listaClientes = consultarClientePorPaqueteServicio($paquete);

    foreach ($listaClientes as $key => $cliente) {

        var_dump($cliente->nombre);

        if ($cliente->telefono != null) {

            $mensaje = 'Hola ' . $cliente->nombre . " 👋%0A%0A";
            $mensaje .= 'Hoy se creo un paquete con tracking ' . $cliente->empresaEntrega . "*%0A%0A";
            $mensaje .= "Por favor verifícalo en el sistema para que estes informado. 🤗%0A%0A";
            $mensaje .= 'Muchas gracias 🙇‍♀️%0A%0A*mybox*';

            echo $mensaje;

            sendWppMessageMybox($mensaje, $cliente->telefono);
        }
    }

    actualizarPaqueteNotificadaServicio($paquete);
}


echo "Termino el proceso<br>";
