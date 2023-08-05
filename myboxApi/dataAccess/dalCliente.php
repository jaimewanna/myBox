<?php

require_once 'conexion.php';
require_once '../../models/cliente.php';

function guardarClienteServicio($nombre, $paterno, $materno, $email, $empresaId, $precioKilo, $telefono, $direccion, $documento, $direccionEntrega, $empresaEntrega)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarCliente(?,?,?,?,?,?,?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssssidsssss', $nombre, $paterno, $materno, $email, $empresaId, $precioKilo, $telefono, $direccion, $documento, $direccionEntrega, $empresaEntrega);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerClientesTotalServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarClienteCompleto()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $s);

    while ($stmt->fetch()) {
        $response = new cliente();
        $response->id = $a;
        $response->nombre = $b;
        $response->paterno = $c;
        $response->materno = $d;
        $response->documentoIdentidad = $e;
        $response->myb = $f;
        $response->email = $g;
        $response->empresaId = $h;
        $response->precioKilo = $i;
        $response->telefono = $j;
        $response->direccion = $k;
        $response->estado = $l;
        $response->fechaCreacion = $m;
        $response->direccionEntrega = $n;
        $response->empresaEntrega = $s;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerClientesDisplayServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarClientesDisplay()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $s);

    while ($stmt->fetch()) {
        $response = new cliente();
        $response->id = $a;
        $response->nombre = $b;
        $response->paterno = $c;
        $response->materno = $d;
        $response->documentoIdentidad = $e;
        $response->myb = $f;
        $response->email = $g;
        $response->empresaId = $h;
        $response->precioKilo = $i;
        $response->telefono = $j;
        $response->direccion = $k;
        $response->estado = $l;
        $response->fechaCreacion = $m;
        $response->direccionEntrega = $n;
        $response->empresaEntrega = $s;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarClientesFranquiciaDisplayServicio($empresa)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarClientesFranquiciaDisplay(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresa);

    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $s);

    while ($stmt->fetch()) {
        $response = new cliente();
        $response->id = $a;
        $response->nombre = $b;
        $response->paterno = $c;
        $response->materno = $d;
        $response->documentoIdentidad = $e;
        $response->myb = $f;
        $response->email = $g;
        $response->empresaId = $h;
        $response->precioKilo = $i;
        $response->telefono = $j;
        $response->direccion = $k;
        $response->estado = $l;
        $response->fechaCreacion = $m;
        $response->direccionEntrega = $n;
        $response->empresaEntrega = $s;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarClienteServicio($nombreUpdate, $paternoUpdate, $maternoUpdate, $documentoUpdate, $mybUpdate, $emailUpdate, $empresaUpdate, $kiloUpdate, $telefonoUpdate, $direccionUpdate, $idUpdate, $direccionEntrega, $empresaEntrega)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarCliente(?,?,?,?,?,?,?,?,?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssssssidssiss', $nombreUpdate, $paternoUpdate, $maternoUpdate, $documentoUpdate, $mybUpdate, $emailUpdate, $empresaUpdate, $kiloUpdate, $telefonoUpdate, $direccionUpdate, $idUpdate, $direccionEntrega, $empresaEntrega);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function busquedaPersonalizadaCliente($proc)
{

    $responseCall = array();

    $mysqli = conexion();
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $s);

    while ($stmt->fetch()) {
        $response = new cliente();
        $response->id = $a;
        $response->nombre = $b;
        $response->paterno = $c;
        $response->materno = $d;
        $response->documentoIdentidad = $e;
        $response->myb = $f;
        $response->email = $g;
        $response->empresaId = $h;
        $response->precioKilo = $i;
        $response->telefono = $j;
        $response->direccion = $k;
        $response->estado = $l;
        $response->fechaCreacion = $m;
        $response->direccionEntrega = $n;
        $response->empresaEntrega = $s;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function eliminarClienteServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarCliente(?)';
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

function consultarClienteNombrePaqueteServicio($idPaquete)
{

    $response = new cliente();

    $mysqli = conexion();
    $proc = 'CALL consultarNombreClientePaquete(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idPaquete);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $response->nombre = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $response;
}
