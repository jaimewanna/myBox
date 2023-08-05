<?php

require_once 'conexion.php';
require_once '../../models/saldo.php';

function anularSaldoClienteServicio($cliente)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL anularSaldoCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $cliente);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarSalldoClienteServicio($cliente)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL consultarSaldoAFavorCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $cliente);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarSaldo($monto, $cliente)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarSaldo(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('di', $monto, $cliente);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}
