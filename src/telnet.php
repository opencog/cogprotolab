<?php
    $host = urldecode($_GET['host']);
    $port = urldecode((int)$_GET['port']);
    $delay = urldecode((int)$_GET['delay']);
    $cmd = urldecode($_GET['cmd']);
    
    $fp = fsockopen($host, $port, $errno, $errstr, 5);

    if(!$fp){
        echo "connection error";

    } else {
        stream_set_blocking($fp, false);
        
        send($fp, $delay, "scm\n");
        echo send($fp, $delay, "$cmd");

        fclose($fp);
    }

    function send ($fp, $delay, $command) {
        //write to socket
        if (fwrite($fp, $command) === false) {
            return "command send error";
        }

        usleep($delay);
        
        //read socket
        $response = "";
        while (($ret = fgets($fp)) !== false) {
            $response .= $ret;
        }

        return $response;
    }
?>
