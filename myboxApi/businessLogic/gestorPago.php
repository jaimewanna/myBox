<?php
require_once '../../dataAccess/dalPago.php';
require_once '../../dataAccess/dalPaquete.php';
require_once '../../dataAccess/dalSaldo.php';
require_once '../../dataAccess/dalAlias.php';
require_once '../../dataAccess/dalDeuda.php';
//require_once '../../utilitarios/notificaciones/enviarNotificacion.php';

function obtenerHistorialPagos($datos)
{
    return obtenerPagosClienteHistoricoServicio($datos->clienteId);
}

function calcularDeudaCliente($datos)
{

    $pagosRealizados = obtenerPagosClienteServicio($datos->clienteId);
    $montoPagadoTotal = 0;

    $deuda = consultarPaquetesSinPagarServicio($datos->clienteId);
    $deudaTotal = 0;

    $saldo = 0;

    for ($i = 0; $i < count($pagosRealizados); $i++) {
        $montoPagadoTotal = $montoPagadoTotal + $pagosRealizados[$i]->monto;
    }

    for ($j = 0; $j < count($deuda); $j++) {

        if ($deuda[$j]->total == 0) {
            $deudaTotal += $deuda[$j]->subtotal + $deuda[$j]->movilidad + $deuda[$j]->otros;
        } else {
            $deudaTotal += $deuda[$j]->total;
        }
    }

    $saldo = $deudaTotal - $montoPagadoTotal;
    $saldoAFavor = consultarSalldoClienteServicio($datos->clienteId);

    return ["deuda" => round($deudaTotal, 2),  "pagoTotal" => round($montoPagadoTotal, 2), "saldo" =>  round($saldo, 2), "aFavor" => round($saldoAFavor, 2)];
}

function calcularDeudaClienteV2($datos)
{

    $datosDeuda = consultarDeudaServicio($datos->clienteId);

    return ["deuda" => 0,  "pagoTotal" => 0, "saldo" =>  round($datosDeuda->monto, 2), "aFavor" => round($datosDeuda->saldo, 2)];
}

function recalcularDeudaCliente($id,$tipo = 'alias')
{

    $idCliente = $id;

    if($tipo == 'alias'){
        $idCliente = getClienteByAliasServicio($id);
    }

    $sumas = datosRecalcularDeudaServicio($idCliente);

    $pagos = $sumas[0];
    $deuda = number_format((float)$sumas[1], 2, '.', '');

    if (($deuda - $pagos) >= 0) {
        actualizarDeduaServicio($idCliente, ($deuda - $pagos), 0);
    } else {
        actualizarDeduaServicio($idCliente, 0, ($pagos - $deuda));
    }

    return [$deuda,$pagos];
}

function agregarPago($datos)
{
    $respuesta = null;
    $montoPago = round(floatval($datos->montoPago), 2);

    $paquetesSinPagar = consultarPaquetesSinPagarServicio($datos->clienteId);

    $datosDeuda = consultarDeudaServicio($datos->clienteId);

    if (($datosDeuda->monto - $montoPago) < 0) {
        actualizarDeduaServicio($datos->clienteId, 0, ($montoPago - $datosDeuda->monto));
    } else {
        actualizarDeduaServicio($datos->clienteId, ($datosDeuda->monto - $montoPago), 0);
    }

    guardarRegistroPagoServicio($datos->clienteId, $montoPago, $datos->empresaPago, null);
    anularSaldoClienteServicio($datos->clienteId);

    //return $paquetesSinPagar;

    foreach ($paquetesSinPagar as $paquete) {

        if ($montoPago <= 0 && $montoPago != null) {
            break;
        }

        $paquete->total = round(floatval($paquete->total), 2);

        if ($paquete->total == 0) {
            actualizarPaquetePagadoServicio($paquete->id);
            continue;
        }

        $auxPaquete = obtenerSaldoPaqueteServicio($paquete->id);

        if (is_null($auxPaquete["saldo"])) {
            $auxPaquete["saldo"] = round(floatval($paquete->total), 2);
        } else {
            $auxPaquete["saldo"] = round(floatval($auxPaquete["saldo"]), 2);
        }

        if (is_null($auxPaquete["montoPagado"])) {
            $auxPaquete["montoPagado"] = 0;
        } else {
            $auxPaquete["montoPagado"] = round(floatval($auxPaquete["montoPagado"]), 2);
        }

        if ($paquete->total == $auxPaquete["montoPagado"]) {
            actualizarPaquetePagadoServicio($paquete->id);
            continue;
        }

        if ($auxPaquete["saldo"] <= 0) {
            actualizarPaquetePagadoServicio($paquete->id);
            continue;
        }

        $montoPago = round(floatval($montoPago - $auxPaquete["saldo"]), 2);

        if ($montoPago < 0) {

            guardarPagoServicio($auxPaquete["saldo"] + $montoPago, $datos->clienteId, $paquete->id, $datos->empresaPago);
            $respuesta = 'Se pago parto del paquete ' . $auxPaquete["saldo"] + $montoPago;
        } else if ($montoPago > 0) {

            guardarPagoServicio($auxPaquete["saldo"], $datos->clienteId, $paquete->id, $datos->empresaPago);
            actualizarPaquetePagadoServicio($paquete->id);
            $respuesta = 'Se pago el paquete';
        } else if ($montoPago == 0) {


            guardarPagoServicio($auxPaquete["saldo"], $datos->clienteId, $paquete->id, $datos->empresaPago);
            actualizarPaquetePagadoServicio($paquete->id);
            $respuesta = 'Monto exacto para pagar';
        }
    }

    if ($montoPago > 0) {
        guardarSaldo($montoPago, $datos->clienteId);
    }

    /*for ($j = 0; $j < count($paquetesSinPagar); $j++) {

        $paquetesSinPagar[$j]->total = round(floatval($paquetesSinPagar[$j]->total),2);

        if ($paquetesSinPagar[$j]->total == 0){
            actualizarPaquetePagadoServicio($paquetesSinPagar[$j]->id);
            continue;
        } 

        $auxPaquete = obtenerSaldoPaqueteServicio($paquetesSinPagar[$j]->id);

        $auxPaquete["saldo"] = round(floatval($auxPaquete["saldo"]),2);
        $auxPaquete["montoPagado"] = round(floatval($auxPaquete["montoPagado"]),2);

        if (is_null($auxPaquete["saldo"])) {
            $auxPaquete["saldo"] = round(floatval($paquetesSinPagar[$j]->total),2);
        }             

        if ($paquetesSinPagar[$j]->total == $auxPaquete["montoPagado"]){
            actualizarPaquetePagadoServicio($paquetesSinPagar[$j]->id);
            continue;
        } 

        return [$auxPaquete,$paquetesSinPagar[$j]];

        if($auxPaquete["saldo"] < 0){
            $respuesta = 'El saldo era cero o era menos que 0 -- '.$auxPaquete["saldo"];
            actualizarPaquetePagadoServicio($paquetesSinPagar[$j]->id);
            continue;
        }          

        if (($auxPaquete["saldo"] - $montoPago) < 0) {

            $respuesta = 'Se pago el paquete y sobro ' . ($montoPago - $auxPaquete["saldo"]);
            $montoPago = $montoPago - $auxPaquete["saldo"];
            
            $auxPaquete["saldo"] != 0 ? guardarPagoServicio($auxPaquete["saldo"], $datos->clienteId, $paquetesSinPagar[$j]->id, $datos->empresaPago) : '';
            
        } else if (($auxPaquete["saldo"] - $montoPago) > 0) {

            $montoPago != 0 ?  guardarPagoServicio($montoPago, $datos->clienteId, $paquetesSinPagar[$j]->id, $datos->empresaPago) : '';
            $respuesta = 'Se pago parte del paquete';
            return ["estado" => 1, "mensaje" => $respuesta];

        } else if (($auxPaquete["saldo"] - $montoPago) == 0) {

            if ($montoPago != 0) {
                guardarPagoServicio($montoPago, $datos->clienteId, $paquetesSinPagar[$j]->id, $datos->empresaPago);
                actualizarPaquetePagadoServicio($paquetesSinPagar[$j]->id);
            }
            $respuesta = 'Monto exacto para pagar';
            return ["estado" => 1, "mensaje" => $respuesta];
        }
    }*/

    return ["estado" => 1, "mensaje" => $respuesta];
}

function generarPagoHistorico($datos)
{

    $id = 0;
    $respuesta = null;
    $clienteAlias = consutlarAliasPorIdServicio($datos->clienteId);
    $cliente = $clienteAlias[0]->id;
    $total = $datos->monto;
    $datosDeuda = consultarDeudaServicio($datos->clienteId);
    $mensaje = '';

    if ($datos->accion == "1") {
        $id = guardarDeudaHistorica($cliente, $total, 1);
        $mensaje = actualizarDeduaServicio($datos->clienteId, ($datosDeuda->monto + $total), 0);
    } else {
        $id = guardarSaldo($total, $datos->clienteId);
    }

    if ($id > 0) {
        $respuesta = ["estado" => 1, "mensaje" => ($datosDeuda->monto + $total), "montoPasado" => $datosDeuda->monto, "montoNuevo" => $total];
    } else {
        $respuesta = ["estado" => 0, "mensaje" => "No se pudo guardar la operacion correctamente"];
    }

    return $respuesta;
}

function guardarPagoHistoricoConFecha($datos)
{
    $id = 0;
    $clienteAlias = consutlarAliasPorIdServicio($datos->clienteId);
    $cliente = $clienteAlias[0]->id;
    $fechaAux = date('Y-m-d H:i:s', strtotime($datos->fecha));

    $id = guardarPagoHistoricoServicio($datos->monto, $datos->clienteId, $datos->empresaPago, $fechaAux, $datos->historico);

    if ($id > 0) {
        $respuesta = ["estado" => 1, "mensaje" => "Operacion guardada exitosamente"];
    } else {
        $respuesta = ["estado" => 0, "mensaje" => "No se pudo guardar la operacion correctamente"];
    }

    return $respuesta;
}

function historialPagoClientesTotales()
{
    return obtenerPagosTotaltesClienteServicio();
}

function reiniciarDeuda($datos)
{

    $idCliente = $datos->clienteId;
    $saldo = $datos->saldo;

    $reinicio = reinicioDeudaServicio($idCliente,$saldo);

    if($reinicio == 1){
        recalcularDeudaCliente($idCliente,"cliente");
        $respuesta = ["estado" => 1, "mensaje" => "Operacion guardada exitosamente", "datosAux" => [$deuda,$pagos]];
    }else{
        $respuesta = ["estado" => 0, "mensaje" => "No se pudo guardar la operacion correctamente"];
    }

    return $respuesta;

}
