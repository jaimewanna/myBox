<?php
header('Access-Control-Allow-Origin: *'); 
require_once '../../businessLogic/gestorVuelo.php';

$data = array();

try {

    $data = obtenerTotalVuelos();

    if ($data == null) {
        $respuesta->mensaje .= 'No se pudo obtener la data';
    }
} catch (Exception $e) {
    $respuesta->mensaje .= $e->getMessage();
}

if ($data == null) {
    echo json_encode($respuesta);
} else {
    echo json_encode($data);
}
