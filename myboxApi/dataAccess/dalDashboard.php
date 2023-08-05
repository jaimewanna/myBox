<?php
require_once 'conexion.php';
require_once '../../models/cliente.php';
require_once '../../models/pago.php';
require_once '../../models/caja.php';
require_once '../../models/kilosMensuales.php';
require_once '../../models/lugar.php';
require_once '../../models/vuelo.php';
require_once '../../models/paquete.php';
require_once '../../models/lugarPaqueteDashboard.php';

function obtenerDataClienteDashboardServicio($id)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardDatosCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h);

    while ($stmt->fetch()) {
        $response = new cliente();
        $response->nombre = $a;
        $response->documentoIdentidad = $b;
        $response->email = $c;
        $response->telefono = $d;
        $response->direccion = $e;
        $response->empresaId = $f;
        $response->direccionEntrega = $g;
        $response->empresaEntrega = $h;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getClientePaymentsDashboardsServicio($id)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardPagosPorCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new pago();
        $response->id = $a;
        $response->idEmpresaPago = $b;
        $response->fechaPago = $c;
        $response->monto = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getPackagesPaymentsDashboardsServicio($id)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardPagosPorPaquete(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new pago();
        $response->id = $a;
        $response->idEmpresaPago = $b;
        $response->fechaPago = $c;
        $response->monto = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getKilosMensualesDashboardsServicio($id)
{

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardKilosMesPorCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {
        $response = new kilosMensuales();
        $response->mes = $a;
        $response->monto = $b;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getCajasDashboardServicio($id)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardDatosCajas(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i);

    while ($stmt->fetch()) {
        $response = new caja();
        $response->nombre = $a;
        $response->tracking = $b;
        $response->destino = $c;
        $response->nPaquetes = $d;
        $response->peso = $e;
        $response->fechaEntrega = $f;
        $response->fechaViaje = $g;
        $response->fechaLlegada = $h;
        $response->id = $i;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getLugaresPorClienteServicio($id)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardConsultarLugaresPorCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {
        $response = new lugar();
        $response->id = $a;
        $response->nombre = $b;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getUltimosVuelosServicio($id)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardConsultarUltimosVuelos(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b);

    while ($stmt->fetch()) {
        $response = new vuelo();
        $response->id = $a;
        $response->nombre = $b;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getLugaresPaquetesClienteServicio($id)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardUbicacionPaquetesPorCliente(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d);

    while ($stmt->fetch()) {
        $response = new lugarPaqueteDashboard();
        $response->idVuelo = $a;
        $response->nombreVuelo = $b;
        $response->idPaquete = $c;
        $response->idLugar = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getVuelosPorClienteServicio($id)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'SELECT DISTINCT v.id,v.nombre,v.tracking,v.fechaRegistro from vuelo v JOIN paquete p ON v.id = p.vueloId JOIN alias a ON a.aliasId = p.clienteId JOIN cliente c ON a.clienteId = c.id WHERE c.id = ? and v.estado = 1 ORDER BY v.nombre DESC;';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $id);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c,$d);

    while ($stmt->fetch()) {
        $response = new vuelo();
        $response->id = $a;
        $response->nombre = $b;
        $response->tracking = $c;
        $response->fechaSalida = $d;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function getPaquetesPorCajaServicio($caja, $cliente)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardPaquetesPorCajaPorCliente(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ii', $caja, $cliente);
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

function getPaquetesPorVueloServicio($vuelo, $cliente)
{
    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL dashboardPaquetesPorVueloPorCliente(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('ii', $vuelo, $cliente);
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
