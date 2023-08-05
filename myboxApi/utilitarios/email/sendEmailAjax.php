<?php
require_once '../../models/respuesta.php';
require_once 'templates/confirmOrderPickUp.php';

$respuesta = new Respuesta();
$data = array();

try {
    if (isset($_POST)) {
        $json = file_get_contents('php://input');
        $datos = json_decode($json);
        $headers .= "Content-type: text/html\r\n";
        $body = file_get_contents('templates/confirmOrderPickUp.html');
        
       $aux = mail($datos->to,$datos->subject,$body,$headers);
       
       if($aux){
            $respuesta->mensaje = 'Se envio el correo exitosamente';
            $respuesta->codigo = "200";
            echo json_encode($respuesta);
       }else{
            $respuesta->mensaje = 'No se envio el correo exitosamente';
            $respuesta->codigo = "500";
            echo json_encode($respuesta);
       }
        
    } else {
        $respuesta->mensaje .= 'No llegaron datos';
        $respuesta->codigo = "500";
        echo json_encode($respuesta);
    }
    
} catch (Exception $e) {
    $respuesta->mensaje .= $e->getMessage();
}

