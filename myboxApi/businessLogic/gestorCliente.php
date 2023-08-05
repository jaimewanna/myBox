<?php
require_once '../../dataAccess/dalCliente.php';
require_once '../../dataAccess/dalAlias.php';


function guardarCliente($datos)
{
    $listaAlias = explode(",", $datos->listaAlias);
    $id = guardarClienteServicio($datos->nombre, $datos->paterno, $datos->materno, $datos->email, $datos->empresaId, $datos->precioKilo, $datos->telefono, $datos->direccion, $datos->documento, $datos->direccionEntrega, $datos->empresaEntrega);

    if ($id != 0) {

        if ($datos->listaAlias != "") {

            $trackingsInvalidos = null;

            $idAliasDefault = guardarAliasServicio($id, $datos->nombre . " " . $datos->paterno);

            for ($i = 0; $i < count($listaAlias); $i++) {

                $idAlias = guardarAliasServicio($id, $listaAlias[$i]);

                if ($idAlias == 0) {
                    $trackingsInvalidos = $trackingsInvalidos . " " . $listaAlias[$i];
                }
            }

            if ($trackingsInvalidos == null) {
                return ["estado" => 1, "mensaje" => "Cliente y alias creados correctamente"];
            } else {
                return ["estado" => 0, "mensaje" => "Se creo el cliente pero no se pudieron crear los sigueientes alias:" . $trackingsInvalidos];
            }
        } else {

            $idAlias = guardarAliasServicio($id, $datos->nombre . " " . $datos->paterno);

            if ($idAlias == 0) {
                return ["estado" => 0, "mensaje" => "No se pudo crear el cliente correctamente"];
            } else {
                return ["estado" => 1, "mensaje" => "Cliente y alias por defecto creados correctamente"];
            }
        }
    } else {

        return ["estado" => 0, "mensaje" => "No se pudo crear el cliente correctamente"];
    }
}

function obtenerTotalAlias($datos)
{

    return consutlarAliasTotalServicio($datos->empresaId);
}

function obtenerTotalClientes()
{

    return obtenerClientesTotalServicio();
}

function obtenerDisplayClientes()
{

    return obtenerClientesDisplayServicio();
}

function actualizarCliente($datos)
{

    $result = actualizarClienteServicio($datos->nombreUpdate, $datos->paternoUpdate, $datos->maternoUpdate, $datos->documentoUpdate, $datos->mybUpdate, $datos->emailUpdate, $datos->empresaUpdate, $datos->kiloUpdate, $datos->telefonoUpdate, $datos->direccionUpdate, $datos->idUpdate, $datos->direccionEntrega, $datos->empresaEntrega);

    if ($result != 0) {

        return ["estado" => 1, "mensaje" => "Cliente actualizado correctamente"];
    } else {

        return ["estado" => 0, "mensaje" => "No se pudo actualizar el cliente correctamente"];
    }
}

function busquedaPersonalizadaClienteGestor($datos)
{

    $valor = $datos->valor;
    $campo = $datos->campo;

    $proc = "SELECT c.id,c.nombre,c.paterno,c.materno,c.documentoIdentidad,c.myb,c.email,e.nombreEmpresa,c.precioKilo,c.telefono,c.direccion,c.estado,c.fechaCreacion,c.direccionEntrega,c.empresaEntrega FROM cliente c JOIN empresa e ON c.empresaId = e.id WHERE " . $campo . " LIKE '%" . $valor . "%' ORDER BY c.nombre ASC";
    $query = "SELECT c.id,c.nombre,c.paterno,c.materno,c.documentoIdentidad,c.myb,c.email,e.nombreEmpresa,c.precioKilo,c.telefono,c.direccion,c.estado,c.fechaCreacion,c.direccionEntrega,c.empresaEntrega FROM cliente c JOIN empresa e ON C.empresaId = E.id WHERE c.id LIKE '%4%'";


    $resultado = busquedaPersonalizadaCliente($proc);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}

function paginacionClienteGestor($datos)
{

    $page = $datos->pagina;
    $items = 15;
    $offset = ($page - 1) * $items;

    $query = "SELECT c.id,c.nombre,c.paterno,c.materno,c.documentoIdentidad,c.myb,c.email,e.nombreEmpresa,c.precioKilo,c.telefono,c.direccion,c.estado,c.fechaCreacion,c.direccionEntrega,c.empresaEntrega FROM cliente c JOIN empresa e ON c.empresaId = e.id WHERE c.estado = 1 ORDER BY c.nombre ASC,c.id DESC LIMIT " . $offset . "," . $items;

    $resultado = busquedaPersonalizadaCliente($query);

    if ($resultado == null || count($resultado) == 0) {
        return [];
    } else {
        return $resultado;
    }
}

function eliminarClienteGestor($datos)
{

    $id = eliminarClienteServicio($datos->id);


    return ["estado" => 1, "mensaje" => "Cliente eliminado exitosamente"];
}

function consultarClientesFranquicia($datos)
{
    return consultarClientesFranquiciaDisplayServicio($datos->idEmpresa);
}
