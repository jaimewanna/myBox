<?php
require_once '../../dataAccess/dalDeuda.php';
require_once '../../dataAccess/dalCliente.php';
require_once '../../businessLogic/gestorPago.php';


$listaClientes = obtenerClientesTotalServicio();

$error = '';

 foreach ($listaClientes as $index => $cliente) {
    
    $cliente->clienteId = $cliente->id;

    $datosDeuda = calcularDeudaCliente($cliente);    

    $saldo = $datosDeuda["saldo"];
    $aFavor = $datosDeuda["aFavor"];

    generarDeudaServicio($cliente->clienteId, number_format((float)$saldo, 2, '.', ''), number_format((float)$aFavor, 2, '.', ''));
}

