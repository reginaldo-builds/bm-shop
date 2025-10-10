<?php
// Listar todas as categorias ou uma categoria específica
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$category_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($category_id) {
    $query = "SELECT * FROM categorias WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $category_id);
    $stmt->execute();
    
    $category = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($category) {
        echo json_encode($category);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Categoria não encontrada."));
    }
} else {
    $query = "SELECT * FROM categorias ORDER BY name ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($categories);
}
?>
