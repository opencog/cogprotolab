<?php
    $dir = urldecode($_POST['dir']);
    $fls = urldecode($_POST['files']);

    if ($dir == "vis") {
        $dirstr = "../scripts/scm/visualization";
    
    } else if ($dir == "pre"){
        $dirstr = "../scripts/scm/predefined";
    }

    $arr = scandir($dirstr);
    chdir($dirstr);
    for ($i = 0; $i < count($arr); $i++) {
        if (!is_dir($arr[$i])) {
            unlink($arr[$i]);
        }
    }

    $allfiles = json_decode($fls, true);
    $fnames = array_keys($allfiles);
    for ($i = 0; $i < count($allfiles); $i++) {            
        $myfile = fopen($fnames[$i], "w") or die("Unable to open file!");
        fwrite($myfile, $allfiles[$fnames[$i]]);
        fclose($myfile);
    }
    
    if ($dir == "vis") {
        echo "Changes to visualization scripts are permanently memorized.";
        
    } else if ($dir == "pre"){
        echo "Changes to predefined scripts are permanently memorized.";
    }
?>
