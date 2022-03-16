<?php
    error_reporting(0);
    
    $host = urldecode($_GET['host']);
    $port = urldecode((int)$_GET['port']);
    
    $fp = fsockopen($host, $port, $errno, $errstr, 5);

    if(!$fp){
        echo "telnet connection error: $errno $errstr";

    } else {
        echo "telnet connection test successful\n";

        stream_set_blocking($fp, false);
        
        $ret = send($fp, $delay, "scm\n");
        $prompt = $ret[count($ret) - 1];
        
        echo str_replace("", "\\x1b", $prompt);

        fclose($fp);
    }

    function send ($fp, $delay, $command) {
        //write to socket
        if (fwrite($fp, $command) == false) {
            return "telnet enter shell error";
        }

        //read socket
        usleep(1000000);
        $response = "";
        while (($ret = fgets($fp)) != false) {
            $response .= $ret;
        }
        
        return explode("\n",$response);
    }
?>
