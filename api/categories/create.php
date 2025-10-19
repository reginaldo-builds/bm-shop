<?php
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name)) {
    $query = "INSERT INTO categorias SET name = :name, description = :description";
    $stmt = $db->prepare($query);

    $name = htmlspecialchars(strip_tags($data->name));
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Categoria criada com sucesso.", "id" => $db->lastInsertId()));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Não foi possível criar a categoria."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Nome da categoria é obrigatório."));
}
?>
