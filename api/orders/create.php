<?php
// Criar novo pedido
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Obter dados enviados
$data = json_decode(file_get_contents("php://input"));

// Validar dados obrigatórios
if (
    !empty($data->customer_name) &&
    !empty($data->customer_email) &&
    !empty($data->items) &&
    !empty($data->total)
) {
    try {
        // Iniciar transação
        $db->beginTransaction();
        
        // Inserir pedido
        $query = "INSERT INTO pedidos 
                  SET customer_name = :customer_name,
                      customer_email = :customer_email,
                      customer_phone = :customer_phone,
                      shipping_address = :shipping_address,
                      payment_method = :payment_method,
                      total = :total,
                      status = 'pending'";
        
        $stmt = $db->prepare($query);
        
        // Sanitizar dados
        $customer_name = htmlspecialchars(strip_tags($data->customer_name));
        $customer_email = htmlspecialchars(strip_tags($data->customer_email));
        $customer_phone = isset($data->customer_phone) ? htmlspecialchars(strip_tags($data->customer_phone)) : null;
        $shipping_address = isset($data->shipping_address) ? htmlspecialchars(strip_tags($data->shipping_address)) : null;
        $payment_method = isset($data->payment_method) ? htmlspecialchars(strip_tags($data->payment_method)) : 'credit_card';
        $total = htmlspecialchars(strip_tags($data->total));
        
        $stmt->bindParam(":customer_name", $customer_name);
        $stmt->bindParam(":customer_email", $customer_email);
        $stmt->bindParam(":customer_phone", $customer_phone);
        $stmt->bindParam(":shipping_address", $shipping_address);
        $stmt->bindParam(":payment_method", $payment_method);
        $stmt->bindParam(":total", $total);
        
        $stmt->execute();
        $order_id = $db->lastInsertId();
        
        // Inserir itens do pedido
        $query_items = "INSERT INTO pedido_itens 
                        SET order_id = :order_id,
                            product_id = :product_id,
                            quantity = :quantity,
                            price = :price";
        
        $stmt_items = $db->prepare($query_items);
        
        foreach ($data->items as $item) {
            $stmt_items->bindParam(":order_id", $order_id);
            $stmt_items->bindParam(":product_id", $item->product_id);
            $stmt_items->bindParam(":quantity", $item->quantity);
            $stmt_items->bindParam(":price", $item->price);
            $stmt_items->execute();
        }
        
        // Confirmar transação
        $db->commit();
        
        http_response_code(201);
        echo json_encode(array(
            "message" => "Pedido criado com sucesso.",
            "order_id" => $order_id
        ));
        
    } catch (Exception $e) {
        // Reverter transação em caso de erro
        $db->rollBack();
        http_response_code(503);
        echo json_encode(array("message" => "Erro ao criar pedido: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos."));
}
?>
