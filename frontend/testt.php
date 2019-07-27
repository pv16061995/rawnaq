<?php 
// ini_set('session.save_path', 'public_html/tmp');
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
echo "<pre>";
// print_r(scandir('public_html/tmp'));
print_r(scandir('/opt/alt/php72/var/lib/php/session'));

print_r(scandir('/home/s9zlx8fn0uq2/public_html/frontend/uploads/2018/11/'));

$image_path = '/home/s9zlx8fn0uq2/public_html/frontend/uploads/2018/11/los-angeles.jpg';

print_r(getimagesize($image_path));

if(isset($_REQUEST['submit'])){
	echo "<pre>"; print_r($_POST);
	$_SESSION['username'] = $_POST['username'];
	$_SESSION['password'] = $_POST['password'];

}
if(isset($_SESSION['username'])){
	echo "<pre>"; print_r($_SESSION);
}

if ( ! is_writable(dirname("/opt/alt/php72/var/lib/php/session"))) {

    echo '/opt/alt/php72/var/lib/php/session must writable!!!<br/>';
}

if ( ! is_writable(dirname("/tmp/"))) {

    echo '/home/s9zlx8fn0uq2/tmp/ must writable!!!<br/>';
}

?>
<form method="post">
<input type="text" name="username" />
<input type="password" name="password" />
<input type="submit" name="submit" />
</form>