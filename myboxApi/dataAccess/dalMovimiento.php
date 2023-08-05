<?php

require_once 'conexion.php';
require_once '../../models/movimiento.php';

function guardarMovimientoServicio($lugar, $paquete)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarMovimiento(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ii', $lugar, $paquete);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarMovimientoCajaServicio($idCajaSP, $idLugarSP, $fechaSp)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarRelacionCajaMovimiento(?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('sis', $idCajaSP, $idLugarSP, $fechaSp);
    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function eliminarMovimientoCajaServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarCajaMovimiento(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $id);


    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarMovimientoServicio($idMovimiento, $fecha, $paquete, $lugar)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL 	actualizarFechaMovimiento(?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('iiss', $idMovimiento, $fecha, $paquete, $lugar);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarMovimientoMasivoServicio($idlugar, $paquete, $fecha, $lugar)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarMovimientoMasivo(?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('iiss', $idlugar, $paquete, $fecha, $lugar);

    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarMovimientosPaqueteServicio($idPaquete)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarMovimientosPorPaquete(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idPaquete);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c);

    while ($stmt->fetch()) {
        $response = new movimiento();
        $response->id = $a;
        $response->lugar = $b;
        $response->fechaMovimiento = $c;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarMovimientosPaqueteServicioEspecial($idPaquete)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarMovimientosPorPaquete(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idPaquete);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c);

    while ($stmt->fetch()) {
        $response = new movimiento();
        $response->id = $a;
        $response->lugar = $b;
        $response->fechaMovimiento = $c;

        $responseCall[str_replace(' ', '', $b)] = $response;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarMovimientosEntidadServicio($nombreEntidad)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarRelacionCajaMovimiento(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $nombreEntidad);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new movimiento();
        $response->id = $a;
        $response->idPaquete = $b;
        $response->lugar = $c;
        $response->fechaMovimiento = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}


function convertirNombreAIdServicio($nombre)
{

    $response = 0;

    $mysqli = conexion();
    $proc = 'CALL lugarNombreAId(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $nombre);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $response = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $response;
}

function eliminarMovimientoDestinoServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarMovimientosDestino(?)';
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
