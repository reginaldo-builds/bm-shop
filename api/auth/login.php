<?php
// Sistema de autenticação com JWT
include_once '../config/cors.php';
include_once '../config/database.php';
include_once '../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

// Obter dados enviados
$data = json_decode(file_get_contents("php://input"));

// Validar dados
if (!empty($data->email) && !empty($data->password)) {
    $query = "SELECT * FROM usuarios WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    
    $email = htmlspecialchars(strip_tags($data->email));
    $stmt->bindParam(":email", $email);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($data->password, $user['password'])) {
        // Criar token JWT
        $payload = array(
            "user_id" => $user['id'],
            "email" => $user['email'],
            "is_admin" => $user['is_admin'],
            "iat" => time(),
            "exp" => time() + (7 * 24 * 60 * 60) // Token válido por 7 dias
        );
        
        $token = JWT::encode($payload);
        
        // Login bem-sucedido
        http_response_code(200);
        echo json_encode(array(
            "message" => "Login realizado com sucesso.",
            "token" => $token,
            "user" => array(
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "is_admin" => $user['is_admin']
            )
        ));
    } else {
        // Credenciais inválidas
        http_response_code(401);
        echo json_encode(array("message" => "Email ou senha incorretos."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Email e senha são obrigatórios."));
}
?>
