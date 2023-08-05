<?php

require_once 'conexion.php';
require_once '../../models/vuelo.php';
require_once '../../models/paquete.php';

function guardarVueloServicio($nombre, $tracking, $nPaquetes, $fechaSalida, $empresaUserId)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarVuelo(?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssisi', $nombre, $tracking, $nPaquetes, $fechaSalida, $empresaUserId);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerVuelosTotalServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarVuelosCompleto()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i);

    while ($stmt->fetch()) {
        $response = new vuelo();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->nPaquetes = $d;
        $response->fechaSalida = $e;
        $response->fechaRegistro = $f;
        $response->fechaModificacion = $g;
        $response->estado = $h;
        $response->empresaId = $i;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerVuelosDisplayServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarVuelosDisplay()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j);

    while ($stmt->fetch()) {
        $response = new vuelo();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->nPaquetes = $d;
        $response->fechaSalida = $e;
        $response->fechaRegistro = $f;
        $response->fechaModificacion = $g;
        $response->estado = $h;
        $response->peso = $i;
        $response->valor = $j;


        array_push($responseCall, $response);
    }


    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerVuelosFranquiciaServicio($empresaId)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL obtenerVuelosFranquicia(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresaId);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j);

    while ($stmt->fetch()) {
        $response = new vuelo();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->nPaquetes = $d;
        $response->fechaSalida = $e;
        $response->fechaRegistro = $f;
        $response->fechaModificacion = $g;
        $response->estado = $h;
        $response->peso = $i;
        $response->valor = $j;


        array_push($responseCall, $response);
    }


    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarVueloServicio($nombre, $tracking, $nVuelo, $fechaVuelo, $idVuelo)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarVuelo(?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssisi', $nombre, $tracking, $nVuelo, $fechaVuelo, $idVuelo);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarPaquetesDetallePorVuelo($idVuelo)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesPorVuelo(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idVuelo);
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

function busquedaPersonalizadaVuelo($proc)
{

    $responseCall = array();

    $mysqli = conexion();
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j);

    while ($stmt->fetch()) {
        $response = new vuelo();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->nPaquetes = $d;
        $response->fechaSalida = $e;
        $response->fechaRegistro = $f;
        $response->fechaModificacion = $g;
        $response->estado = $h;
        $response->peso = $i;
        $response->valor = $j;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function eliminarVueloServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarVuelo(?)';
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
