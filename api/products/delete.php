<?php
// Deletar produto (requer autenticação de admin)
include_once '../config/cors.php';
include_once '../config/auth.php';

$auth = new Auth();
$auth->requireAdmin();

$database = new Database();
$db = $database->getConnection();

// Obter dados enviados
$data = json_decode(file_get_contents("php://input"));

// Validar ID
if (!empty($data->id)) {
    $query = "DELETE FROM produtos WHERE id = :id";
    $stmt = $db->prepare($query);

    $id = htmlspecialchars(strip_tags($data->id));
    $stmt->bindParam(":id", $id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Produto deletado com sucesso."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Não foi possível deletar o produto."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "ID não fornecido."));
}
?>
