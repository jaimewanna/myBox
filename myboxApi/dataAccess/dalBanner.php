<?php

require_once 'conexion.php';
require_once '../../models/banner.php';

function guardarBannerServicio($url, $idEmpresa)
{

    $responseCall = 0;

    $mysqli = conexion();
    $proc = 'CALL guardarBanner(?,?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('si', $url, $idEmpresa);

    if ($stmt->execute()) {
        $responseCall = 1;
    }

    $stmt->close();
    $mysqli->close();

    return $responseCall;
}

function obtenerUltimoBannerServicio($idEmpresa)
{

    $response = new banner();

    $mysqli = conexion();
    $proc = 'CALL consultarUltimoBanner(?)';
    $stmt = $mysqli->prepare($proc);
    $stmt->bind_param('i', $idEmpresa);
    $stmt->execute();

    $stmt->bind_result($a);

    while ($stmt->fetch()) {

        $response->url = $a;
    }

    $stmt->close();
    $mysqli->close();

    return $response;
}
