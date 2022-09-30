<?php

// Access util methods
require_once("api_utils.php");

// Set up return arguments
$rows = [];
$endpoint = "delete";

// Get input data
$inData = APIUtils::getRequestInfo();

$ContactID = $inData['contactID'];


// Try to connect to the database
$dbConn = APIUtils::connectToDB();

// Check if connection attempt failed
if ($dbConn->connect_error)
{
  APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, "Could Not Connect To Database");
}
else{
    $deleteSQL = $dbConn->prepare("DELETE FROM Contacts WHERE ContactID= '" . $ContactID . "'");
}
try {
    if ($deleteSQL->execute()) {
      APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$successStatus);
    } else {
      throw new Exception("Could Not Delete Record");
    }
  } catch (Exception $e) {
    // SQL statement failed
    APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, $e->getMessage());
  } finally {
    // Clean up
    $deleteSQL->close();
    $dbConn->close();
  }