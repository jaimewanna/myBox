<?php

require_once 'conexion.php';
require_once '../../models/usuario.php';
require_once '../../models/cliente.php';

function obtenerInicioSesionServicio($usuario, $password)
{

    $response = new usuario();

    $mysqli = conexion();
    $proc = 'CALL obtenerInicioSesion(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ss', $password, $usuario);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g);

    while ($stmt->fetch()) {
        $response->id = $a;
        $response->usuario = $b;
        $response->password = $c;
        $response->email = $d;
        $response->empresaId = $e;
        $response->fechaRegistro = $f;
        $response->estado = $g;
    }

    $stmt->close();
    $mysqli->close();

    return $response;
}

function obtenerInicioSesionClienteServicio($usuario, $password)
{

    $response = new cliente();

    $mysqli = conexion();
    $proc = 'CALL inicioSesionCliente (?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ss', $usuario, $password);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {
        $response->id = $a;
        $response->empresaId = $b;
    }

    $stmt->close();
    $mysqli->close();

    return $response;
}
