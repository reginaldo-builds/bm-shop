<?php
// Middleware de autenticação
include_once 'jwt.php';
include_once 'database.php';

class Auth {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Verificar token e retornar dados do usuário
    public function authenticate() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : 
                     (isset($headers['authorization']) ? $headers['authorization'] : null);

        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(array("message" => "Token não fornecido."));
            exit();
        }

        // Remover "Bearer " do token
        $token = str_replace('Bearer ', '', $authHeader);
        
        $decoded = JWT::decode($token);
        
        if (!$decoded) {
            http_response_code(401);
            echo json_encode(array("message" => "Token inválido ou expirado."));
            exit();
        }

        // Verificar se o token expirou
        if (isset($decoded['exp']) && $decoded['exp'] < time()) {
            http_response_code(401);
            echo json_encode(array("message" => "Token expirado."));
            exit();
        }

        // Verificar se o usuário ainda existe
        $query = "SELECT id, name, email, is_admin FROM usuarios WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":id", $decoded['user_id']);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(array("message" => "Usuário não encontrado."));
            exit();
        }

        return $user;
    }

    // Verificar se usuário é admin
    public function requireAdmin() {
        $user = $this->authenticate();
        
        if (!$user['is_admin']) {
            http_response_code(403);
            echo json_encode(array("message" => "Acesso negado. Apenas administradores."));
            exit();
        }

        return $user;
    }
}
?>
