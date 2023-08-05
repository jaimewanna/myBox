<?php
header('Access-Control-Allow-Origin: *');
require_once '../../businessLogic/gestorLog.php';

$data = array();
$respuesta = "";
try {

    $data = consultarAdminLogPagos();

    if ($data == null) {
        $respuesta = 'No se pudo obtener la data';
    }
} catch (Exception $e) {
    $respuesta = $e->getMessage();
}

if ($data == null) {
    echo json_encode($respuesta);
} else {
    echo json_encode($data);
}
