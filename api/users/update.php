<?php
// Atualizar usuário existente (requer autenticação de admin)
include_once '../config/cors.php';
include_once '../config/auth.php';

$auth = new Auth();
$auth->requireAdmin();

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->name) && !empty($data->email)) {
    $query = "UPDATE usuarios SET name = :name, email = :email";
    
    // Adicionar password apenas se fornecido
    if (!empty($data->password)) {
        $query .= ", password = :password";
    }
    
    $query .= " WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    $id = htmlspecialchars(strip_tags($data->id));
    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));
    
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    
    if (!empty($data->password)) {
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt->bindParam(":password", $password);
    }
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Usuário atualizado com sucesso."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Não foi possível atualizar o usuário."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos."));
}
?>
