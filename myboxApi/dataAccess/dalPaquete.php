<?php

require_once 'conexion.php';
require_once '../../models/paquete.php';
require_once '../../models/cliente.php';

function guardarPaqueteVueloServicio($tracking, $vuelo, $empresaUserId)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarPaqueteVuelo(?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ssi', $tracking, $vuelo, $empresaUserId);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPaquetesTotalServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesCompleto()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $o, $p, $q, $r, $s, $t, $u, $v, $w, $x, $y, $z);

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
        $response->empresaPagoId = $w;
        $response->fechaRegistro = $x;
        $response->estado = $y;
        $response->pagado = $z;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPaquetesDisplayServicio()
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesDisplay()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l, $m, $n, $o, $p, $q, $r, $s, $t, $u, $v, $w, $x, $y, $z);

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
        $response->empresaPagoId = $w;
        $response->fechaRegistro = $x;
        $response->estado = $y;
        $response->pagado = $z;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPaqueteEspecificoServicio($id)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaqueteEspecifico(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($id_recuperado, $tracking, $cliente, $lugar, $descripcion, $vuelo, $caja, $peso, $subtotal, $movilidad, $otros, $total, $margen, $utilidad, $cambio, $destino, $registro, $estado, $pagado, $precioKilo);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->id = $id_recuperado;
        $response->tracking = $tracking;
        $response->clienteNombre = $cliente;
        $response->lugar = $lugar;
        $response->descripcion = $descripcion;
        $response->vueloId = $vuelo;
        $response->cajaId = $caja;
        $response->peso = $peso;
        $response->subtotal = $subtotal;
        $response->movilidad = $movilidad;
        $response->otros = $otros;
        $response->total = $total;
        $response->margen = $margen;
        $response->utilidad = $utilidad;
        $response->tipoCambio = $cambio;
        $response->destino = $destino;
        $response->fechaRegistro = $registro;
        $response->estado = $estado;
        $response->pagado = $pagado;
        $response->precioKilo = $precioKilo;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPaquetesCompletoResumenServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesCompletoResumen()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->id = $a;
        $response->tracking = $b;
        $response->empresa = $c;
        $response->clienteNombre = $d;
        $response->lugar = $e;
        $response->vueloId = $f;
        $response->total = $g;
        $response->clienteId = $h;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPaquetesDisplayResumenServicio()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesDisplayResumen()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->id = $a;
        $response->tracking = $b;
        $response->empresa = $c;
        $response->clienteNombre = $d;
        $response->lugar = $e;
        $response->vueloId = $f;
        $response->total = $g;
        $response->peso = $h;
        $response->clienteId = $i;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarPaquetesServicio($trackingPaquete, $clientePaquete, $desPaquete, $vueloPaquete, $cajaPaquete, $pesoPaquete, $subtotalPaquete, $movilidadPaquete, $otrosPaquete, $totalPaquete, $margenPaquete, $utlidadPaquete, $cambioPaquete, $idPaquete, $destino, $precioKilo)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarPaquete(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('sisiiddddddddiid', $trackingPaquete, $clientePaquete, $desPaquete, $vueloPaquete, $cajaPaquete, $pesoPaquete, $subtotalPaquete, $movilidadPaquete, $otrosPaquete, $totalPaquete, $margenPaquete, $utlidadPaquete, $cambioPaquete, $idPaquete, $destino, $precioKilo);

    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerPaquetesFranquiciaServicio($empresa)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL obtenerPaquetesFranquicia(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresa);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->id = $a;
        $response->tracking = $b;
        $response->empresa = $c;
        $response->clienteNombre = $d;
        $response->lugar = $e;
        $response->vueloId = $f;
        $response->total = $g;
        $response->peso = $h;
        $response->clienteId = $i;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarTrackingsVueloServicio($idVuelo)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarTrackingsVuelo(?)';
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

function consultarPaquetesSinPagarServicio($idCliente)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesSinPagar(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idCliente);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->id = $a;
        $response->total = $b;
        $response->pagado = $c;
        $response->subtotal = $d;
        $response->movilidad = $e;
        $response->otros = $f;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function actualizarPaquetePagadoServicio($idPaquete)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarPaquetePagado(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idPaquete);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function busquedaPersonalizadaPaquete($proc)
{

    $responseCall = array();

    $mysqli = conexion();
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->id = $a;
        $response->tracking = $b;
        $response->empresa = $c;
        $response->clienteNombre = $d;
        $response->lugar = $e;
        $response->vueloId = $f;
        $response->total = $g;
        $response->peso = $h;
        $response->clienteId = $i;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function revisarTrackingServicio($tracking)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL verificarTrackingExistente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('s', $tracking);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {
        $responseCall = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function eliminarPaqueteServicio($id)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL eliminarPaquete(?)';
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

function guardarDeudaHistorica($cliente, $total, $historicoSP)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL agregarDeudaHistorica(?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('idi', $cliente, $total, $historicoSP);

    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarKilosHistoricosServicio($cliente, $peso, $estado, $historico, $fecha)
{
    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarKilosHistoricos(?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('idiis', $cliente, $peso, $estado, $historico, $fecha);

    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function guardarPaqueteHistoricoServicio($tracking, $cliente, $descripcion, $peso, $subtotal, $movilidad, $otros, $total, $margen, $utilidad, $tipoCambio, $fechaRegistro, $pagado, $historico)
{
    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarPaqueteHistorico(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('sisddddddddsii', $tracking, $cliente, $descripcion, $peso, $subtotal, $movilidad, $otros, $total, $margen, $utilidad, $tipoCambio, $fechaRegistro, $pagado, $historico);

    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function consultarPaqueteSinNotificar()
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarPaquetesSinNotificar()';
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

function actualizarPaqueteNotificadaServicio($idPaquete)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL actualizarPaqueteNotificado(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idPaquete);
    $stmt->execute();

    if ($stmt->fetch()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}



function consultarClientePorPaqueteServicio($idPaquete)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarClientesPorPaquete(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idPaquete);
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

function getPaquetesReportePorEmpresaServicio($empresaId)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL consultarDatosPaquetesPorEmpresa(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresaId);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k, $l);

    while ($stmt->fetch()) {
        $response = new paquete();
        $response->clienteNombre = $a;
        $response->tracking = $b;
        $response->cajaId = $c;
        $response->peso = $d;
        $response->precioKilo = $e;
        $response->subtotal = $f;
        $response->movilidad = $g;
        $response->otros = $h;
        $response->total = $i;
        $response->pagos = $j;
        $response->id = $k;
        $response->lugar = $l;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getEmpresas($empresa)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL obtenerEmpresas(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $empresa);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {
        $response = [
            "id" => $a,
            "nombre" => $b
        ];

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}
