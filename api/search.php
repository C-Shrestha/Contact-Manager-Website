<?php

// Access util methods
require_once("api_utils.php");

// Set up return arguments
$rows = [];
$endpoint = "search";

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
  // Prepare SQL statement for search attempt
  $searchSQL = $dbConn->prepare("SELECT * FROM Contacts WHERE UserID = ? AND (firstName LIKE ? OR lastName LIKE ?)");
  $firstNamePattern = '%' . $inData["firstName"] . '%';
  $lastNamePattern = '%' . $inData["lastName"] . '%';
  $searchSQL->bind_param("sss", $inData["userID"], $firstNamePattern, $lastNamePattern);

  // Execute SQL statement and evaluate result
  try {
    $searchSQL->execute();
    $result = $searchSQL->get_result();

    while ($row = $result->fetch_assoc()) {
      array_push($rows, $row);
    }
    APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$successStatus);
  } catch(Exception $e) {
    APIUtils::sendJsonResultInfo($rows, $endpoint, APIUtils::$failStatus, $e->getMessage());
  } finally {
    // Clean up
    $searchSQL->close();
    $dbConn->close();
  }
}

?>