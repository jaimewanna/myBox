<?php
header('Access-Control-Allow-Origin: *'); 
require_once '../../businessLogic/gestorAlias.php';

$data = array();
$respuesta = "";
try {
    if (isset($_POST)) {

        $json = file_get_contents('php://input');
        $datos = json_decode($json);

        if ($datos != null) {

            $data = guardarAliasCliente($datos);

           if ($data == null) {
                $respuesta= 'No se pudo traer la data';
            }
            
        } else {
            $respuesta= 'No hubo datos';
        }
    } else {
        $respuesta= 'No llegaron datos';
    }
} catch (Exception $e) {
    $respuesta= $e->getMessage();
}

if ($data == null) {
    echo json_encode($respuesta);
} else {
    echo json_encode($data);
}
