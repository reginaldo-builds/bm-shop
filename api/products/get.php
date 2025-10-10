<?php
// Listar todos os produtos ou um produto específico
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Verificar se é busca por ID específico
$product_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($product_id) {
    // Buscar produto específico com imagens e categoria
    $query = "SELECT p.*, c.name as category_name 
              FROM produtos p 
              LEFT JOIN categorias c ON p.category_id = c.id 
              WHERE p.id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $product_id);
    $stmt->execute();
    
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($product) {
        // Buscar imagens do produto
        $query_images = "SELECT * FROM produto_imagens WHERE product_id = :product_id ORDER BY order_position ASC";
        $stmt_images = $db->prepare($query_images);
        $stmt_images->bindParam(":product_id", $product_id);
        $stmt_images->execute();
        $product['images'] = $stmt_images->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($product);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Produto não encontrado."));
    }
} else {
    // Listar todos os produtos com imagem principal e categoria
    $query = "SELECT p.*, c.name as category_name,
              (SELECT image_url FROM produto_imagens WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
              FROM produtos p 
              LEFT JOIN categorias c ON p.category_id = c.id 
              ORDER BY p.id DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
}
?>
