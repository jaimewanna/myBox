<?php
require_once '../../dataAccess/dalCliente.php';
require_once '../../dataAccess/dalAlias.php';

function consultarAliasCliente($datos)
{
    return consutlarAliasPorIdServicio($datos->clienteId);
}

function guardarAliasCliente($datos)
{
    $listaAlias = explode(",", $datos->listaAlias);
    $id = $datos->idCliente;

    if ($datos->listaAlias != "") {

        $trackingsInvalidos = null;
        for ($i = 0; $i < count($listaAlias); $i++) {

            $idAlias = guardarAliasServicio($id, $listaAlias[$i]);

            if ($idAlias == 0) {
                $trackingsInvalidos = $trackingsInvalidos . " " . $listaAlias[$i];
            }
        }

        if ($trackingsInvalidos == null) {
            return ["estado" => 1, "mensaje" => "Alias creados correctamente"];
        } else {
            return ["estado" => 0, "mensaje" => "Se creo el cliente pero no se pudieron crear los sigueientes alias:" . $trackingsInvalidos];
        }
    } else {
        return ["estado" => 1, "mensaje" => "No se envio ningun alias"];
    }
}

function editarAlias($datos)
{

    $listaMybs = verificarMybIgualesServicio($datos->myb);

    if (count($listaMybs) == 0 || verificarPertenenciaMybs($listaMybs, $datos->id)) {
        $id = editarAliasServicio($datos->id, $datos->nombre, $datos->myb);

        if ($id != 0) {
            return ["estado" => 1, "mensaje" => "Alias actualizado correctamente"];
        } else {
            return ["estado" => 0, "mensaje" => "No se pudo crear el alias correctamente"];
        }
    } else {

        return ["estado" => 0, "mensaje" => "No se pudo editar el alias porque el MYB ya existe"];
    }
}

function eliminarAlias($datos)
{
    $listaAlias = consutlarAliasPorIdServicio($datos->clienteId);

    if (count($listaAlias) > 1) {
        $id = eliminarAliasServicio($datos->id);

        if ($id != 0) {
            return ["estado" => 1, "mensaje" => "Alias eliminado correctamente"];
        } else {
            return ["estado" => 0, "mensaje" => "No se pudo eliminar el alias correctamente"];
        }
    } else {

        return ["estado" => 0, "mensaje" => "No se pudo eliminar el alias porque es el único"];
    }
}

function verificarPertenenciaMybs($listaMybs, $id)
{

    $perteneceMybs = false;

    for ($i = 0; $i < count($listaMybs); $i++) {

        if ($listaMybs[$i]->id == $id) {
            $perteneceMybs = true;
            break;
        }
    }

    return $perteneceMybs;
}
