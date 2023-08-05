<?php

require_once 'conexion.php';
require_once '../../models/deuda.php';

function generarDeudaServicio($id, $monto, $saldo){

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL generarDeudaCliente(?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('idd', $id, $monto, $saldo);
    
    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;

}

function consultarDeudaServicio($id){

    $response = new deuda();

    $mysqli = conexion();
    $proc = 'CALL consultarDeudaCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response->id = $a;
        $response->monto = $b;
        $response->saldo = $c;
        $response->estado = $d;
    }

    $stmt->close();
    $mysqli->close();

    return $response;

}

function actualizarDeduaServicio($id,$monto, $saldo){

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarDeudaCliente(?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('idd', $id, $monto, $saldo);
    
    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;

}

function datosRecalcularDeudaServicio($id){

    $pago = 0;
    $paquete = 0;

    $mysqli = conexion();
    $proc = 'select (select sum(montoTotal) from myboxpy0_tracking.registropagos where idCliente = '.$id.') as pagos,
            (select ROUND(sum(total),2) from myboxpy0_tracking.paquete join myboxpy0_tracking.alias on paquete.clienteId = alias.aliasId where alias.clienteId = '.$id.' and paquete.estado = 1) as paquetes from dual
            ';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {
        $pago = $a;
        $paquete = $b;
    }

    $stmt->close();
    $mysqli->close();

    return [$pago,$paquete];


}

function reinicioDeudaServicio($idCliente,$saldo){

    $respuesta = 0;

    $mysqli = conexion();
    $proc = 'insert into registropagos(idCliente,montoTotal,empresaPagoId) values ('.$idCliente.','.$saldo.',11)';
    $stmt = $mysqli->prepare($proc);    

    if ($stmt->execute()) {
        $respuesta = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $respuesta;

}