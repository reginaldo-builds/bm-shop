<?php
// Atualizar produto existente
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->id) &&
    !empty($data->name) &&
    !empty($data->price) &&
    !empty($data->category_id)
) {
    $query = "UPDATE produtos 
              SET name = :name,
                  description = :description, 
                  price = :price, 
                  old_price = :old_price,
                  category_id = :category_id, 
                  stock = :stock,
                  discount = :discount
              WHERE id = :id";

    $stmt = $db->prepare($query);

    $id = htmlspecialchars(strip_tags($data->id));
    $name = htmlspecialchars(strip_tags($data->name));
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
    $price = htmlspecialchars(strip_tags($data->price));
    $old_price = isset($data->old_price) ? htmlspecialchars(strip_tags($data->old_price)) : null;
    $category_id = htmlspecialchars(strip_tags($data->category_id));
    $stock = isset($data->stock) ? htmlspecialchars(strip_tags($data->stock)) : 0;
    $discount = isset($data->discount) ? htmlspecialchars(strip_tags($data->discount)) : 0;

    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":price", $price);
    $stmt->bindParam(":old_price", $old_price);
    $stmt->bindParam(":category_id", $category_id);
    $stmt->bindParam(":stock", $stock);
    $stmt->bindParam(":discount", $discount);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Produto atualizado com sucesso."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Não foi possível atualizar o produto."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos."));
}
?>
