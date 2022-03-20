<?php
    error_reporting(0);
    
    $host = urldecode($_GET['host']);
    $port = urldecode((int)$_GET['port']);
    
    $fp = fsockopen($host, $port, $errno, $errstr, 5);

    if(!$fp){
        echo "telnet connection error: $errno $errstr";

    } else {
        stream_set_blocking($fp, false);
        
        $ret = send($fp, $delay, "scm\n");
        $prompt = $ret[count($ret) - 1];
        
        echo str_replace("", "\\x1b", $prompt);

        fclose($fp);
    }

    function send ($fp, $delay, $command) {
        //$delay = 1000000;
        $delay = 1;
        $timeout = 5;
        $starttime = time();
        
        //write to socket
        if (fwrite($fp, $command) == false) {
            return "telnet enter shell error";
        }

        //read socket
        //usleep($delay);
        sleep($delay);

        $response = "";
        while (($ret = fgets($fp)) != false && (time() - $starttime) < $timeout) {
            $response .= $ret;
        }
        
        return explode("\n",$response);
    }
?>
