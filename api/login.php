<?php

// Access util methods
require_once("api_utils.php");

// Set up return arguments
$rows = [];
$endpoint = "login";

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
  // Prepare SQL statement for login attempt
  $loginSQL = $dbConn->prepare("SELECT UserID, firstName, lastName FROM Users WHERE Login = ? AND Password = ?");
  $loginSQL->bind_param("ss", $inData["login"], $inData["password"]);

  // Execute SQL statement and evaluate result
  try {
    $loginSQL->execute();
    $result = $loginSQL->get_result();

    if ($row = $result->fetch_assoc())
    {
      array_push($rows, $row);
      APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$successStatus);
    }
    else
    {
      throw new Exception("Could Not Find Record");
    }
  } catch(Exception $e) {
    APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, $e->getMessage());
  } finally {
    // Clean up
    $loginSQL->close();
    $dbConn->close();
  }
}

?>