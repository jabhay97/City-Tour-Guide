<?php
$con=mysqli_connect("localhost","root","","feedback");
if(!$con){
echo 'NOT CONNECTED TO SERVER';
} else{
	echo 'CONNECTED';
}
if(!mysqli_select_db($con,'feedback')){
	echo 'DATABASE NOT SELECTED';
}

$Full_Name = $_POST['name'];
$Email1 = $_POST['email'];
$feed = $_POST['feed'];


$sql="INSERT INTO feedback(name,email,feed) VALUES ('$Full_Name','$Email1','$feed')";
if(mysqli_query($con,$sql))
{
	echo ' Thanks For The Feedback !!';
}
else{
	echo 'error $sql' . mysqli_error($con);
}
header("refresh:2; url=index.html");
?>
