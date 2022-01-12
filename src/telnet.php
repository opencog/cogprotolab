<?php
    $host = urldecode($_GET['host']);
    $port = urldecode((int)$_GET['port']);
    $cmd = urldecode($_GET['cmd']);
    
    $fp = fsockopen($host, $port, $errno, $errstr, 5);

    if(!$fp){
        echo "telnet connection error";

    } else {
        stream_set_blocking($fp, false);
        
        send($fp, $delay, "scm\n");
        echo send($fp, $delay, "$cmd");

        fclose($fp);
    }

    function send ($fp, $delay, $command) {
        //write to socket
        if (fwrite($fp, $command) == false) {
            return "telnet command send error";
        }

        //read socket
        while (true) {
            usleep(25000);
            $response = "";
            while (($ret = fgets($fp)) != false) {
                if (substr($ret, -25) == "[0;34mguile[1;34m> [0m") {
                    $response = substr($response, 0, -1);
                    return $response;
                }
                
                $response .= $ret;
            }
        }
    }
?>
