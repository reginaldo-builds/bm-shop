<?php
// Gerenciar imagens de produtos
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// GET - Listar imagens de um produto
if ($method === 'GET') {
    $product_id = isset($_GET['product_id']) ? $_GET['product_id'] : null;
    
    if ($product_id) {
        $query = "SELECT * FROM produto_imagens WHERE product_id = :product_id ORDER BY order_position ASC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();
        
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($images);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "ID do produto não fornecido."));
    }
}

// POST - Adicionar imagem
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->product_id) && !empty($data->image_url)) {
        $query = "INSERT INTO produto_imagens 
                  SET product_id = :product_id, 
                      image_url = :image_url, 
                      is_primary = :is_primary,
                      order_position = :order_position";
        
        $stmt = $db->prepare($query);
        
        $product_id = htmlspecialchars(strip_tags($data->product_id));
        $image_url = htmlspecialchars(strip_tags($data->image_url));
        $is_primary = isset($data->is_primary) ? $data->is_primary : false;
        $order_position = isset($data->order_position) ? $data->order_position : 0;
        
        $stmt->bindParam(":product_id", $product_id);
        $stmt->bindParam(":image_url", $image_url);
        $stmt->bindParam(":is_primary", $is_primary);
        $stmt->bindParam(":order_position", $order_position);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Imagem adicionada com sucesso.", "id" => $db->lastInsertId()));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Não foi possível adicionar a imagem."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Dados incompletos."));
    }
}

// DELETE - Remover imagem
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $query = "DELETE FROM produto_imagens WHERE id = :id";
        $stmt = $db->prepare($query);
        
        $id = htmlspecialchars(strip_tags($data->id));
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Imagem removida com sucesso."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Não foi possível remover a imagem."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "ID não fornecido."));
    }
}
?>
