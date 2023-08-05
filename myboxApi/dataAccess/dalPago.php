<?php

require_once 'conexion.php';
require_once '../../models/pago.php';

function guardarPagoServicio($monto, $cliente, $paquete, $empresaPago)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarPago(?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('diii', $monto, $cliente, $paquete, $empresaPago);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarRegistroPagoServicio($cliente, $monto, $empresaPago, $fechaPago)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'insert into registropagos(idCliente,montoTotal,empresaPagoId) values (?,?,?);';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('idi', $cliente, $monto, $empresaPago);
    

    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarPagoHistoricoServicio($monto, $cliente, $empresaPago, $fecha, $historico)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarPagoHistorico(?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('diisi', $monto, $cliente, $empresaPago, $fecha, $historico);
    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPagosClienteServicio($cliente)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPagosPorCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $cliente);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f);

    while ($stmt->fetch()) {
        $response = new pago();
        $response->id = $a;
        $response->monto = $b;
        $response->cliente = $c;
        $response->paquete = $d;
        $response->idEmpresaPago = $e;
        $response->fechaPago = $f;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerSaldoPaqueteServicio($id)
{

    $response = [];

    $mysqli = conexion();
    $proc = 'CALL obtenerPagosPorPaquete(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {

        $response = ["montoPagado" => $a, "saldo" => $b];
    }

    $stmt->close();
    $mysqli->close();

    return $response;
}

function obtenerPagosClienteHistoricoServicio($cliente)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarHistorialPagosCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $cliente);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f);

    while ($stmt->fetch()) {
        $response = new pago();
        $response->id = $a;
        $response->monto = $b;
        $response->cliente = $c;
        $response->paquete = $d;
        $response->idEmpresaPago = $e;
        $response->fechaPago = $f;

        array_push($responseCall, $response);
    }


    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPagosTotaltesClienteServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPagosTotalesClientes()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f);

    while ($stmt->fetch()) {
        $response = new pago();
        $response->id = $a;
        $response->monto = $b;
        $response->cliente = $c . " " . $d;
        $response->idEmpresaPago = $e;
        $response->fechaPago = $f;

        array_push($responseCall, $response);
    }


    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerHistorialRegistroPagosClienteServicio($cliente)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'SELECT registropagos.`id`,registropagos.`montoTotal`,registropagos.`idCliente`,empresapago.nombre, DATE_FORMAT(fechaRegistro, "%Y-%m-%d") FROM `registropagos` JOIN `empresapago` ON registropagos.empresaPagoId = empresapago.id WHERE idCliente = ?;';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $cliente);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e);

    while ($stmt->fetch()) {
        $response = new pago();
        $response->id = $a;
        $response->monto = $b;
        $response->cliente = $c;
        $response->idEmpresaPago = $d;
        $response->fechaPago = $e;

        array_push($responseCall, $response);
    }


    $stmt->close();
    $mysqli->close();

    return $responseCall;
}