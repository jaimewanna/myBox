<?php
require_once '../../dataAccess/dalDashboard.php';

require_once '../../businessLogic/gestorPago.php';
require_once '../../dataAccess/dalPago.php';

function getDataClienteDashboard($datos)
{

    return obtenerDataClienteDashboardServicio($datos->id);
}

function getClientePaymentsDashboards($datos)
{

    return getClientePaymentsDashboardsServicio($datos->id);
}

function getPackagesPaymentsDashboards($datos)
{

    return getPackagesPaymentsDashboardsServicio($datos->id);
}

function getKilosMensuales($datos)
{

    $kilos = getKilosMensualesDashboardsServicio($datos->id);

    return $kilos;
}

function getCajasDashboard($datos)
{

    return getCajasDashboardServicio($datos->id);
}

function getDatosTablaUbicaciones($datos)
{

    $response = [
        'lugares' => getLugaresPorClienteServicio($datos->id),
        'vuelos' => getUltimosVuelosServicio($datos->id),
        'paquetes' => getLugaresPaquetesClienteServicio($datos->id)
    ];

    return $response;
}

function getDatosTablasVuelos($datos)
{

    $vuelos = getVuelosPorClienteServicio($datos->id);
    $response = [];

    for ($i = 0; $i < count($vuelos); $i++) {

        $aux = [
            "vuelo" => $vuelos[$i],
            "paquetes" => getPaquetesPorVueloServicio($vuelos[$i]->id, $datos->id)
        ];

        array_push($response, $aux);
    }

    return $response;
}

function getDatosPaquetesPorCaja($datos)
{
    $response = getPaquetesPorCajaServicio($datos->caja, $datos->cliente);
    $data = [];

    $aux = [
        "vuelo" => ["nombre" => ''],
        "paquetes" => $response
    ];

    array_push($data, $aux);

    return $data;
}

function getHistorialDeudaPagos($datos)
{
    $idCliente = $datos->id;

    $historial = [];
    $pagos = obtenerHistorialRegistroPagosClienteServicio($idCliente);

    foreach ($pagos as $pago) {

        array_push($historial, [
            "nombre" => $pago->idEmpresaPago,
            "monto" => $pago->monto,
            "fecha" => $pago->fechaPago,
            "peso" => '--',
            "subtotal" => '--',
            "movilidad" => '--',
            "otros" => '--',
        ]);
    }

    $datos = (object) array('id' => $idCliente);

    $vuelosPaquetes = getDatosTablasVuelos($datos);

    foreach ($vuelosPaquetes as $vuelosPaquete) {

        $valorVuelo = 0;

        $valorPeso = 0;
        $valorSubTotal = 0;
        $valorMovilidad = 0;
        $valorOtros = 0;

        foreach ($vuelosPaquete["paquetes"] as $paquete) {
            $valorVuelo += $paquete->total;
            $valorPeso += $paquete->peso;
            $valorSubTotal += $paquete->subtotal;
            $valorMovilidad += $paquete->movilidad;
            $valorOtros += $paquete->otros;
        }

        array_push($historial, [
            "nombre" => $vuelosPaquete["vuelo"]->nombre,
            "monto" => number_format((float)$valorVuelo, 2, '.', ''),
            "peso" => number_format((float)$valorPeso, 2, '.', ''),
            "subtotal" => number_format((float)$valorSubTotal, 2, '.', ''),
            "movilidad" => number_format((float)$valorMovilidad, 2, '.', ''),
            "otros" => number_format((float)$valorOtros, 2, '.', ''),
            "fecha" => $vuelosPaquete["vuelo"]->fechaSalida
        ]);
    }

    return $historial;
}
