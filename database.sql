-- Banco de Dados BM Sistemas - Atualizado
-- Script de criação completo

CREATE DATABASE IF NOT EXISTS bm_sistemas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bm_sistemas;

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2) NULL,
    category_id INT,
    stock INT DEFAULT 0,
    discount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Imagens de Produtos
CREATE TABLE IF NOT EXISTS produto_imagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    order_position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES produtos(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    shipping_address TEXT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (customer_email),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES produtos(id),
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir categorias de exemplo
INSERT INTO categorias (name, description) VALUES
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Periféricos', 'Periféricos para computador'),
('Monitores', 'Monitores e displays'),
('Armazenamento', 'Dispositivos de armazenamento');

-- Inserir produtos de exemplo
INSERT INTO produtos (name, description, price, old_price, category_id, stock, discount) VALUES
('Notebook Dell Inspiron', 'Notebook Dell Inspiron 15 com processador Intel Core i7, 16GB RAM, SSD 512GB, tela Full HD 15.6"', 3499.99, 3999.99, 1, 15, 12),
('Mouse Logitech MX Master', 'Mouse sem fio ergonômico com 7 botões programáveis, sensor de alta precisão e bateria recarregável', 349.99, 449.99, 2, 30, 22),
('Teclado Mecânico Keychron', 'Teclado mecânico 87 teclas com switches Blue, retroiluminação RGB e conexão Bluetooth', 599.99, 799.99, 2, 20, 25),
('Monitor LG 27"', 'Monitor LG UltraGear 27" Full HD 144Hz, 1ms, IPS, FreeSync Premium', 1299.99, 1599.99, 3, 12, 19),
('Webcam Logitech C920', 'Webcam Full HD 1080p com microfone estéreo, ideal para streaming e videoconferências', 449.99, 549.99, 2, 25, 18),
('SSD Samsung 1TB', 'SSD Samsung 870 EVO 1TB SATA III, velocidades de até 560MB/s leitura', 499.99, 649.99, 4, 40, 23);

-- Inserir imagens de exemplo
INSERT INTO produto_imagens (product_id, image_url, is_primary, order_position) VALUES
(1, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', FALSE, 2),
(2, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800', FALSE, 2),
(3, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800', TRUE, 1);

-- Inserir usuário admin de exemplo
-- Senha: admin123 (use password_hash no PHP para gerar senhas reais)
INSERT INTO usuarios (name, email, password, is_admin) VALUES
('Administrador', 'admin@bmsistemas.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);
