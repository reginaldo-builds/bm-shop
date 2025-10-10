<?php
// Listar todos os usuários ou um usuário específico
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($user_id) {
    $query = "SELECT id, name, email, created_at FROM usuarios WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $user_id);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Usuário não encontrado."));
    }
} else {
    $query = "SELECT id, name, email, created_at FROM usuarios ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
}
?>
