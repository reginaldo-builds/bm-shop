<?php
// Estatísticas do dashboard
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$stats = array();

// Total de produtos
$query = "SELECT COUNT(*) as total FROM produtos";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['total_products'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Total de pedidos
$query = "SELECT COUNT(*) as total FROM pedidos";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['total_orders'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Total de usuários
$query = "SELECT COUNT(*) as total FROM usuarios";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['total_users'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Total de categorias
$query = "SELECT COUNT(*) as total FROM categorias";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['total_categories'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Receita total
$query = "SELECT SUM(total_amount) as revenue FROM pedidos WHERE status != 'cancelled'";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['total_revenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'] ?? 0;

// Produtos com baixo estoque
$query = "SELECT COUNT(*) as total FROM produtos WHERE stock < 10";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['low_stock_products'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Pedidos recentes
$query = "SELECT p.*, u.name as customer_name 
          FROM pedidos p 
          LEFT JOIN usuarios u ON p.user_id = u.id 
          ORDER BY p.created_at DESC LIMIT 5";
$stmt = $db->prepare($query);
$stmt->execute();
$stats['recent_orders'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($stats);
?>
