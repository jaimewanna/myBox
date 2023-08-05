<?php
require_once 'conexion.php';
require_once '../../models/log.php';

function guardarLogServicio($cliente, $accion, $region, $pais)
{
    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL 	guardarClienteLog(?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('isss', $cliente, $accion, $region, $pais);


    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarAdminLogServicio($accion, $detalle)
{
    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarAdminLog(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ss', $accion, $detalle);


    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarLogServicio($empresa)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarClienteLogResumen(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresa);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f);

    while ($stmt->fetch()) {
        $response = new log();
        $response->id = $a;
        $response->cliente = $b;
        $response->accion = $c;
        $response->region = $d;
        $response->pais = $e;
        $response->fecha = $f;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarAdminLogServicio()
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarAdminLogResumen()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new log();
        $response->id = $a;
        $response->accion = $b;
        $response->detalle = $c;
        $response->fecha = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarAdminLogPagosServicio()
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarLogAdminPAgos()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new log();
        $response->id = $a;
        $response->accion = $b;
        $response->detalle = $c;
        $response->fecha = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}
