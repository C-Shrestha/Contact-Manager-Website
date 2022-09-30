<?php

class APIUtils {
  private static $dbHost = "localhost";
  private static $dbUser = "TheBeast";
  private static $dbPass = "WeLoveCOP4331";
  private static $dbName = "COP4331";

  public static $successStatus = "success";
  public static $failStatus = "fail";

  public static function getRequestInfo()
  {
    return json_decode(file_get_contents('php://input'), true);
  }

  public static function connectToDB()
  {
    return new mysqli(self::$dbHost, self::$dbUser, self::$dbPass, self::$dbName);
  }

  public static function sendJsonResultInfo($rows, $endpoint, $status, $error = "")
  {
    echo self::genJsonResultInfo($rows, $endpoint, $status, $error);
  }

  private static function genJsonResultInfo($rows, $endpoint, $status, $error)
  {
    $result = array("rows"=>$rows, "endpoint"=>$endpoint, "status"=>$status, "error"=>$error);
    return json_encode($result);
  }
}

?>