<?php

require_once 'conexion.php';
require_once '../../models/alias.php';

function guardarAliasServicio($id, $nombre)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarAlias(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('is', $id, $nombre);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}


function consutlarAliasPorIdServicio($id)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarAliasPorCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new alias();
        $response->id = $a;
        $response->clienteId = $b;
        $response->nombre = $c;
        $response->myb = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consutlarAliasTotalServicio($empresaId)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarAliasTotales(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresaId);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h);

    while ($stmt->fetch()) {
        $response = new alias();
        $response->id = $a;
        $response->clienteId = $b;
        $response->nombre = $c;
        $response->myb = $d;
        $response->documentoIdentidad = $e;
        $response->email = $f;
        $response->empresaId = $g;
        $response->precioKilo = $h;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function verificarMybIgualesServicio($myb)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL verificarMyb(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $myb);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $response = new alias();
        $response->id = $a;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function editarAliasServicio($id, $nombre, $myb)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL editarAlias(?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('iss', $id, $nombre, $myb);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function eliminarAliasServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarAlias(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getClienteByAliasServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'Select cliente.id from alias join cliente on alias.clienteId = cliente.id where alias.aliasId = '.$id;
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}
