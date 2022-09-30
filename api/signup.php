<?php

// Access util methods
require_once("api_utils.php");

// Set up return arguments
$rows = [];
$endpoint = "signup";

// Get input data
$inData = APIUtils::getRequestInfo();

// Try to connect to the database
$dbConn = APIUtils::connectToDB();

// Check if connection attempt failed
if ($dbConn->connect_error)
{
  APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, "Could Not Connect To Database");
}
else
{
  // Prepare SQL statement for signup attempt
  $signupSQL = $dbConn->prepare("INSERT INTO Users (Login, Password, firstName, lastName) VALUES (?, ?, ?, ?)");
  $signupSQL->bind_param("ssss", $inData["login"], $inData["password"], $inData["firstName"], $inData["lastName"]);

  // Execute SQL statement and evaluate result
  try {
    if ($signupSQL->execute()) {
      APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$successStatus);
    } else {
      throw new Exception("Could Not Insert Record");
    }
  } catch (Exception $e) {
    // SQL statement failed
    APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, $e->getMessage());
  } finally {
    // Clean up
    $signupSQL->close();
    $dbConn->close();
  }
}

?>