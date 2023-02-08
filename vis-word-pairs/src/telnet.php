<?php
    error_reporting(0);
    
    $host = urldecode($_POST['host']);
    $port = urldecode((int)$_POST['port']);
    $cmd = urldecode($_POST['cmd']);
    $prompt = str_replace("\\x1b", "", urldecode($_POST['prompt']));
    
    $fp = fsockopen($host, $port, $errno, $errstr, 5);

    if(!$fp){
        echo "telnet connection error: $errno $errstr";

    } else {
        // stream_set_blocking($fp, false);
        stream_set_timeout($fp, 0, 2500);
        
        send($fp, $delay, "scm\n", $prompt);
        echo send($fp, $delay, "$cmd", $prompt);

        fclose($fp);
    }

    function send ($fp, $delay, $command, $prompt) {
        // Timeout in seconds. For large servers, it might take
        // more than 5 seconds. But 25 should be enough?!
        $timeout = 25;
        $starttime = time();

        // Write to socket
        if (fwrite($fp, $command) == false) {
            return "telnet.php: Error sending data to CogServer";
        }

        $response = "";
        // Read socket
        while ((time() - $starttime) < $timeout) {
            while (($ret = fgets($fp)) != false) {
                if ($ret == $prompt) {
                    $response = substr($response, 0, -1);
                    return $response;
                }
                
                $response .= $ret;
            }
        }
        
        return "telnet.php: Timed out waiting for CogServer";
    }
?>
