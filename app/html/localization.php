<?php
session_start();
$language = "en";

if(isset($_COOKIE["language"])) {
	$language = $_COOKIE["language"];
}

putenv("LANG=$language");
if($language === "de") {
	setlocale(LC_ALL, "de_DE.UTF-8");
} else if($language === "en") {
	setlocale(LC_ALL, "en_US.UTF-8");
}

bindtextdomain($language, "../locales");
bind_textdomain_codeset($language, 'UTF-8');
textdomain($language);
?>
