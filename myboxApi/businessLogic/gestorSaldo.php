<?php
require_once '../../dataAccess/dalSaldo.php';

function consultarSaldoAFavor($datos){

    $response = consultarSalldoClienteServicio($datos->clienteId);

    if($response == null){
        return 0;
    }else{
        return $response;
    }

}