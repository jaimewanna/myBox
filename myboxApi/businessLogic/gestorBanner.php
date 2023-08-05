<?php
require_once '../../dataAccess/dalBanner.php';

function consultarBanner($datos)
{
    return obtenerUltimoBannerServicio($datos->idEmpresa);
}

function guardarBanner($datos)
{

    $idAlias = guardarBannerServicio($datos->url, $datos->idEmpresa);

    if ($idAlias != 0) {
        return ["estado" => 1, "mensaje" => "Banner guardado correctamente"];
    } else {
        return ["estado" => 0, "mensaje" => "El banner no se pudo guardar correctamente"];
    }
}
