<?php
header('Access-Control-Allow-Origin: *'); 
require_once '../../businessLogic/gestorPago.php';

$data = array();

try {
    if (isset($_POST)) {

        $json = file_get_contents('php://input');
        $datos = json_decode($json);

        if ($datos != null) {

            $data = calcularDeudaClienteV2($datos);

           if ($data == null) {
                $respuesta->mensaje .= 'No se pudo traer la data';
            }
            
        } else {
            $respuesta->mensaje .= 'No hubo datos';
        }
    } else {
        $respuesta->mensaje .= 'No llegaron datos';
    }
} catch (Exception $e) {
    $respuesta->mensaje .= $e->getMessage();
}

if ($data == null) {
    echo json_encode($respuesta);
} else {
    echo json_encode($data);
}