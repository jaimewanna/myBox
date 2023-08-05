<?php
require_once '../../dataAccess/dalUsuario.php';
require_once '../../dataAccess/dalConfiguracionCliente.php';

function iniciarSesion($data)
{

    $usuario =  obtenerInicioSesionServicio($data->usuario, $data->password);

    if ($usuario != null) {
        return $usuario;
    } else {
        return ["estado" => 0, "mensaje" => "No se pudo iniciar sesion"];
    }
}

function iniciarSesionCliente($data)
{

    $usuario =  obtenerInicioSesionClienteServicio($data->usuario, $data->password);

    if ($usuario != null) {
        $response = consultarconfiguracionrClienteServicio($usuario->id, $usuario->empresaId);
        return $response;
    } else {
        return ["estado" => 0, "mensaje" => "No se pudo iniciar sesion"];
    }
}
