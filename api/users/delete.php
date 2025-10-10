<?php
// Deletar usuário
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $query = "DELETE FROM usuarios WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $id = htmlspecialchars(strip_tags($data->id));
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Usuário deletado com sucesso."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Não foi possível deletar o usuário."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "ID não fornecido."));
}
?>
