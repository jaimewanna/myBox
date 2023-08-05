<?php
require_once '../../dataAccess/dalLog.php';

function guardarLog($datos)
{

    $id = guardarLogServicio($datos->cliente, $datos->accion, $datos->region, $datos->pais);

    if ($id === 0) {
        return ["estado" => 0, "mensaje" => "No se guardo el log"];
    } else {
        return ["estado" => 1, "mensaje" => "Se guardo el log"];
    }
}

function consultarLog($datos)
{
    return consultarLogServicio($datos->idEmpresa);
}

function guardarAdminLog($datos)
{

    $id = guardarAdminLogServicio($datos->accion, $datos->detalle);

    if ($id === 0) {
        return ["estado" => 0, "mensaje" => "No se guardo el log"];
    } else {
        return ["estado" => 1, "mensaje" => "Se guardo el log"];
    }
}

function consultarAdminLog()
{
    return consultarAdminLogServicio();
}

function consultarAdminLogPagos()
{
    return consultarAdminLogPagosServicio();
}
