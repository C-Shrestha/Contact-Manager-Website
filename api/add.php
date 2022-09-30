<?php

// Access util methods
require_once("api_utils.php");

// Set up return arguments
$rows = [];
$endpoint = "add";

// Get input data
$inData = APIUtils::getRequestInfo();
$LastName = $inData['lastName'];
$FirstName = $inData['firstName'];
$Email = $inData['email'];
$Phone = $inData['phone'];
$Address = $inData['address'];
$Zip =  $inData['zip'];
$City = $inData['city'];
$State = $inData['state'];
$ContactID = $inData['contactID'];
$UserID = $inData['userID'];

// Try to connect to the database
$dbConn = APIUtils::connectToDB();

// Check if connection attempt failed
if ($dbConn->connect_error)
{
  APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, "Could Not Connect To Database");
}
else
{
    $addSQL = $dbConn->prepare("INSERT INTO Contacts (lastName, firstName, email, phone, address, zip, city, state, userID) 
                                VALUES ('" . $LastName . "','" . $FirstName . "',
                                        '" . $Email . "','" . $Phone . "',
                                        '" . $Address . "','" . $Zip . "','" . $City . "','" . $State . "'
                                        ,'" . $UserID . "')");
}
try {
    if ($addSQL->execute()) {
      APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$successStatus);
    } else {
      throw new Exception("Could Not Insert Record");
    }
  } catch (Exception $e) {
    // SQL statement failed
    APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, $e->getMessage());
  } finally {
    // Clean up
    $addSQL->close();
    $dbConn->close();
  }