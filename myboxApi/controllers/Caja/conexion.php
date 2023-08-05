<?php

    function conexion(){
        $entorno = "prod";
        $mysqli = null;
        
        if($entorno == "dev"){
            $mysqli = new mysqli("localhost", "root", "", "mybox");
        }else{
            $mysqli = new mysqli("localhost", "myboxpy0_trackingAdmin", "Hi5x55MB~T,q", "myboxpy0_tracking");
        }

        if($mysqli->connect_error){
            die('Se produjo un error de conexi贸n: (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
        }

        $mysqli->set_charset('utf8');
        return $mysqli;
    }

?>