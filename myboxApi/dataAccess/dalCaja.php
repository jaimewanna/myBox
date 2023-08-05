<?php

require_once 'conexion.php';
require_once '../../models/caja.php';
require_once '../../models/paquete.php';
require_once '../../models/cliente.php';

function obtenerCajasDisplayServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarCajaDisplay()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $i, $j, $k, $l);

    while ($stmt->fetch()) {
        $response = new caja();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->nPaquetes = $d;
        $response->fechaRegistro = $e;
        $response->fechaModificacion = $f;
        $response->estado = $g;
        $response->peso = $i;
        $response->valor = $j;
        $response->fechaEntrega = $k;
        $response->fechaViaje = $l;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function busquedaPersonalizadaCaja($proc)
{

    $responseCall = array();

    $mysqli = conexion();
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $i, $j, $k, $l);

    while ($stmt->fetch()) {
        $response = new caja();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->nPaquetes = $d;
        $response->fechaRegistro = $e;
        $response->fechaModificacion = $f;
        $response->estado = $g;
        $response->peso = $i;
        $response->valor = $j;
        $response->fechaEntrega = $k;
        $response->fechaViaje = $l;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerCajasCompletoServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarCajaCompleto()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l);

    while ($stmt->fetch()) {
        $response = new caja();
        $response->id = $a;
        $response->nombre = $b;
        $response->destino = $c;
        $response->tracking = $d;
        $response->nPaquetes = $e;
        $response->fechaEntrega = $f;
        $response->fechaViaje = $g;
        $response->estadoNotificacion = $h;
        $response->fechaRegistro = $i;
        $response->fechaModificacion = $j;
        $response->estado = $k;
        $response->empresaId = $l;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarCajaServicio($nombre, $tracking, $nPaquetes, $destino, $entrega, $viaje, $empresaUserId)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarCaja(?,?,?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssisssi', $nombre, $tracking, $nPaquetes, $destino, $entrega, $viaje, $empresaUserId);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerCajasFranquiciaServicio($empresaId)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL obtenerCajasFranquicia(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresaId);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $i, $j, $k, $l);

    while ($stmt->fetch()) {
        $response = new caja();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->nPaquetes = $d;
        $response->fechaRegistro = $e;
        $response->fechaModificacion = $f;
        $response->estado = $g;
        $response->peso = $i;
        $response->valor = $j;
        $response->fechaEntrega = $k;
        $response->fechaViaje = $l;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarCajaServicio($nombre, $tracking, $nPaquetes, $idCaja, $entrega, $viaje)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarCaja(?,?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssiiss', $nombre, $tracking, $nPaquetes, $idCaja, $entrega, $viaje);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarCajaPaqueteServicio($trackingCaja, $cadaId)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarCajaPaquete(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('si', $trackingCaja, $cadaId);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarTrackingsCajaServicio($idVuelo)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarTrackingsCaja(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idVuelo);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->tracking = $a;
        $response->id = $b;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarPaquetesDetallePorCaja($idCaja)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesPorCaja(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idCaja);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $o, $p, $q, $r, $s, $t, $u, $v, $w, $x, $y);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->id = $a;
        $response->tracking = $b;
        $response->clienteId = $c;
        $response->lugar = $d;
        $response->descripcion = $e;
        $response->vueloId = $f;
        $response->cajaId = $g;
        $response->peso = $h;
        $response->subtotal = $i;
        $response->movilidad = $j;
        $response->otros = $k;
        $response->total = $l;
        $response->margen = $m;
        $response->utilidad = $n;
        $response->tipoCambio = $o;
        $response->llegadaMiami = $p;
        $response->llegadaAsuncion = $q;
        $response->llegadaFrontera = $r;
        $response->llegadaArgentina = $s;
        $response->caminoInterior = $t;
        $response->llegadaBs = $u;
        $response->caminoBs = $v;
        $response->fechaRegistro = $w;
        $response->estado = $x;
        $response->pagado = $y;

        array_push($responseCall, $response);
    }


    $stmt->close();
    $mysqli->close();

    return $responseCall;
}


function eliminarCajaServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarCaja(?)';
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


function buscarNombreRepetido($nombre)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL VerificarNombreCaja(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $nombre);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarClientesPorCajaServicio($idCaja)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarClientesPorCaja(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idCaja);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new cliente();
        $response->id = $a;
        $response->nombre = $b;
        $response->telefono = $c;
        $response->empresaEntrega = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarCajaNotificadaServicio($idCaja)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarCajaNotificada(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idCaja);
    $stmt->execute();

    if ($stmt->fetch()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarCajaSinNotificar()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarCajasSinNotificar()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        array_push($responseCall, $a);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}
