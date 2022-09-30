<?php

// Access util methods
require_once("api_utils.php");

// Set up return arguments
$rows = [];
$endpoint = "edit";

// Get input data
$inData = APIUtils::getRequestInfo();

// APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$successStatus);

// Try to connect to the database
$dbConn = APIUtils::connectToDB();
$sql = "UPDATE Contacts SET lastName= '".$inData["lastName"]."', firstName= '".$inData["firstName"]."',
email= '".$inData["email"]."', phone= '".$inData["phone"]."', address= '".$inData["address"]."',
zip= '".$inData["zip"]."', city= '".$inData["city"]."', state= '".$inData["state"]."' WHERE contactID= '". $inData["contactID"] . "'";
// Check if connection attempt failed
if ($dbConn->connect_error)
{
  APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, "Could Not Connect To Database");
}
else{
     //$editSQL = $dbConn->prepare("UPDATE Contacts SET (lastName, firstName, email, phone, address, zip, city, state) 
      //                          WHERE ContactID = (contactID) VALUES (?,?,?,?,?,?,?,?,?)");
     //$editSQL->bind_param("ssssssss", $inData["lastName"], $inData["firstName"], $inData["email"], $inData["phone"], $inData["address"], $inData["zip"], $inData["city"], $inData["state"], $inData["contactID"]);
    $editSQL = $dbConn->prepare($sql);
}
try {
    if ($editSQL->execute()) {
      APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$successStatus);
    } else {
      throw new Exception("Could Not Change Record");
    }
  } catch (Exception $e) {
    // SQL statement failed
    APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, $e->getMessage());
  } finally {
    // Clean up
    $editSQL->close();
    $dbConn->close();
  }