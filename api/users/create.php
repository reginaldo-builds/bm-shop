<?php
// Criar novo usuário (requer autenticação de admin)
include_once '../config/cors.php';
include_once '../config/auth.php';

$auth = new Auth();
$auth->requireAdmin();

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    // Verificar se email já existe
    $check_query = "SELECT id FROM usuarios WHERE email = :email";
    $check_stmt = $db->prepare($check_query);
    $email = htmlspecialchars(strip_tags($data->email));
    $check_stmt->bindParam(":email", $email);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Email já cadastrado."));
        exit();
    }
    
    $query = "INSERT INTO usuarios SET name = :name, email = :email, password = :password";
    $stmt = $db->prepare($query);
    
    $name = htmlspecialchars(strip_tags($data->name));
    $password = password_hash($data->password, PASSWORD_DEFAULT);
    
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $password);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Usuário criado com sucesso.", "id" => $db->lastInsertId()));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Não foi possível criar o usuário."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos."));
}
?>
