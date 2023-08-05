<?php

require_once '../../businessLogic/gestorPago.php';
require_once '../../businessLogic/gestorDashboard.php';
require_once '../../dataAccess/dalPago.php';

function array_sort($array, $on, $order=SORT_ASC)
{
    $new_array = array();
    $sortable_array = array();

    if (count($array) > 0) {
        foreach ($array as $k => $v) {
            if (is_array($v)) {
                foreach ($v as $k2 => $v2) {
                    if ($k2 == $on) {
                        $sortable_array[$k] = $v2;
                    }
                }
            } else {
                $sortable_array[$k] = $v;
            }
        }

        switch ($order) {
            case SORT_ASC:
                asort($sortable_array);
            break;
            case SORT_DESC:
                arsort($sortable_array);
            break;
        }

        foreach ($sortable_array as $k => $v) {
            $new_array[$k] = $array[$k];
        }
    }

    return $new_array;
}

$idCliente = 6;

$historial = [];
$pagos = obtenerHistorialRegistroPagosClienteServicio($idCliente);

foreach ($pagos as $pago) {

    array_push($historial,[
        "nombre" => $pago->idEmpresaPago,
        "monto" => $pago->monto,
        "fecha" => $pago->fechaPago
    ]);

    //echo 'Se hizo un pago de '.$pago->monto. ' en la fecha '.$pago->fechaPago.' <br>';
}

$datos = (object) array('id' => $idCliente);

$vuelosPaquetes = getDatosTablasVuelos($datos);

foreach($vuelosPaquetes as $vuelosPaquete){

    $valorVuelo = 0;

    foreach ($vuelosPaquete["paquetes"] as $paquete) {
        $valorVuelo += $paquete->total;
    }

    //echo 'El valor del vuelo es '.$valorVuelo.' y salio el '. $vuelosPaquete["vuelo"]->fechaSalida .'<br>';

    array_push($historial,[
        "nombre" => $vuelosPaquete["vuelo"]->nombre,
        "monto" => $valorVuelo,
        "fecha" => $vuelosPaquete["vuelo"]->fechaSalida
    ]);

}

print_r(array_sort($historial, 'fecha', SORT_DESC));

