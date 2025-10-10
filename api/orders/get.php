<?php
// Listar todos os pedidos
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$order_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($order_id) {
    // Buscar pedido específico com itens
    $query = "SELECT p.*, u.name as customer_name, u.email as customer_email 
              FROM pedidos p 
              LEFT JOIN usuarios u ON p.user_id = u.id 
              WHERE p.id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $order_id);
    $stmt->execute();
    
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($order) {
        // Buscar itens do pedido
        $query_items = "SELECT pi.*, pr.name as product_name 
                       FROM pedido_itens pi 
                       LEFT JOIN produtos pr ON pi.product_id = pr.id 
                       WHERE pi.order_id = :order_id";
        $stmt_items = $db->prepare($query_items);
        $stmt_items->bindParam(":order_id", $order_id);
        $stmt_items->execute();
        $order['items'] = $stmt_items->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($order);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Pedido não encontrado."));
    }
} else {
    // Listar todos os pedidos
    $query = "SELECT p.*, u.name as customer_name, u.email as customer_email,
              (SELECT COUNT(*) FROM pedido_itens WHERE order_id = p.id) as items_count
              FROM pedidos p 
              LEFT JOIN usuarios u ON p.user_id = u.id 
              ORDER BY p.created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($orders);
}
?>
