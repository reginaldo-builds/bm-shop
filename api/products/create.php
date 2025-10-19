<?php
// Criar novo produto (requer autenticação de admin)
include_once '../config/cors.php';
include_once '../config/auth.php';

$auth = new Auth();
$auth->requireAdmin();

$database = new Database();
$db = $database->getConnection();

// Obter dados enviados
$data = json_decode(file_get_contents("php://input"));

// Validar dados obrigatórios
if (
    !empty($data->name) &&
    !empty($data->price) &&
    !empty($data->category_id)
) {
    $query = "INSERT INTO produtos 
              SET name = :name,
                  description = :description, 
                  price = :price, 
                  old_price = :old_price,
                  category_id = :category_id, 
                  stock = :stock,
                  discount = :discount";

    $stmt = $db->prepare($query);

    $name = htmlspecialchars(strip_tags($data->name));
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
    $price = htmlspecialchars(strip_tags($data->price));
    $old_price = isset($data->old_price) ? htmlspecialchars(strip_tags($data->old_price)) : null;
    $category_id = htmlspecialchars(strip_tags($data->category_id));
    $stock = isset($data->stock) ? htmlspecialchars(strip_tags($data->stock)) : 0;
    $discount = isset($data->discount) ? htmlspecialchars(strip_tags($data->discount)) : 0;

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":price", $price);
    $stmt->bindParam(":old_price", $old_price);
    $stmt->bindParam(":category_id", $category_id);
    $stmt->bindParam(":stock", $stock);
    $stmt->bindParam(":discount", $discount);

    if ($stmt->execute()) {
        $product_id = $db->lastInsertId();
        
        // Adicionar imagens se fornecidas
        if (isset($data->images) && is_array($data->images)) {
            $query_img = "INSERT INTO produto_imagens 
                         SET product_id = :product_id, image_url = :image_url, 
                             is_primary = :is_primary, order_position = :order_position";
            $stmt_img = $db->prepare($query_img);
            
            foreach ($data->images as $index => $image_url) {
                $is_primary = ($index === 0) ? 1 : 0;
                $stmt_img->bindParam(":product_id", $product_id);
                $stmt_img->bindParam(":image_url", $image_url);
                $stmt_img->bindParam(":is_primary", $is_primary);
                $stmt_img->bindParam(":order_position", $index);
                $stmt_img->execute();
            }
        }
        
        http_response_code(201);
        echo json_encode(array("message" => "Produto criado com sucesso.", "id" => $product_id));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Não foi possível criar o produto."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos. Nome, preço e categoria são obrigatórios."));
}
?>
