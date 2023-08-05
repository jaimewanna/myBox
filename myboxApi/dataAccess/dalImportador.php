<?php

require_once 'conexion.php';
//require_once '../../models/log.php';

function buscarClientePorNombre($nombreCliente)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL buscarAliasClientePorNombre(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $nombreCliente);
    $stmt->execute();

    $stmt->bind_result($a);

    if ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function buscarCajaPorNombre($nombreCaja)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL buscarCajaPorNombre(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $nombreCaja);
    $stmt->execute();

    $stmt->bind_result($a);

    if ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}


function buscarVueloPorNombre($nombreVuelo)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL buscarVueloPorNombre(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $nombreVuelo);
    $stmt->execute();

    $stmt->bind_result($a);

    if ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}


function guardarPaqueteImportacion($tracking, $cliente, $descripcion, $peso, $subtotal, $movilidad, $otros, $total, $margen, $utilidad, $tipoCambio, $fecharegistro, $pagado, $historico, $destino, $vuelo, $caja, $precioKilo)
{
    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarPaqueteHistorico(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('sisddddddddsiiiiid', $tracking, $cliente, $descripcion, $peso, $subtotal, $movilidad, $otros, $total, $margen, $utilidad, $tipoCambio, $fecharegistro, $pagado, $historico, $destino, $vuelo, $caja, $precioKilo);
    $stmt->execute();

    $stmt->bind_result($a);

    if ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}
