<?php

require_once 'conexion.php';
require_once '../../models/configuracionCliente.php';

function guardarpasswordClienteServicio($password, $token, $clienteId)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarPasswordCliente(?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssi', $password, $token, $clienteId);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function eliminarpasswordClienteServicio($clienteId)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarPasswordCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $clienteId);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarconfiguracionrClienteServicio($clienteId, $empresa = "")
{

    $response = new configuracionCliente();

    $mysqli = conexion();
    $proc = 'CALL consultarConfiguracionCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $clienteId);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f);

    while ($stmt->fetch()) {
        $response->id = $a;
        $response->clienteId = $b;
        $response->favorito = $c;
        $response->password = $d;
        $response->token = $e;
        $response->caducidad = $f;
        $response->empresa = $empresa;
    }

    $stmt->close();
    $mysqli->close();

    return $response;
}
