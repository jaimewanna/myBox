<?php

require_once 'conexion.php';
require_once '../../models/objetoExportacionMasiva.php';

function obtenerDataMasivaServicio(){

    $responseCall = array();

    $mysqli = conexion();
    $proc = 'CALL descargaMasivaDatos()';
    $stmt = $mysqli->prepare($proc);
    $stmt->execute();

    $stmt->bind_result($a, $b, $c, $d, $e, $f, $g, $h, $i, $j, $k,$l,$m,$n,$o,$p,$q,$r,$s,$t,$u,$v);

    while ($stmt->fetch()) {
        $response = new exportacionMasiva();
        $response->fechaRegistro = $a;
        $response->myb = $b;
        $response->nombreCliente = $c;
        $response->tracking = $d;
        $response->precioKilo = $e;
        $response->peso = $f;
        $response->subtotal = $g;
        $response->movilidad = $h;
        $response->otros = $i;
        $response->tipoCambio = $j;
        $response->nombreEmpresa = $k;
        $response->lugar = $l;
        $response->nombreCaja = $m;
        $response->trackingCaja = $n;
        $response->miami= $o;
        $response->asunsion = $p;
        $response->frontera = $q;
        $response->argentina = $r;
        $response->caminoInterior= $s;
        $response->llegabaBs= $t;
        $response->caminoBs = $u;
        $response->pagado = $v;

        array_push($responseCall, $response);
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;

}