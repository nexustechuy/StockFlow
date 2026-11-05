-- StockFlow - DML (datos de prueba)
-- Correr después de ddl.sql. Datos inventados para demostrar el sistema.
--
-- Usuarios de prueba (la contraseña se guarda con bcrypt):
--   vendedor@gmail.com         contraseña: vendedor       vendedor
--   repositor@gmail.com        contraseña: repositor      repositor
--   administrador@gmail.com    contraseña: administrador  administrador
--   juan.perez@gmail.com       contraseña: juanperez      vendedor + repositor
--   sofia.gomez@gmail.com      contraseña: sofiagomez     vendedor (inactivo)

USE stockflow;
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ROLES
INSERT INTO rol (id_rol, nombre) VALUES
    (1, 'administrador'),
    (2, 'vendedor'),
    (3, 'repositor');

-- USUARIOS
INSERT INTO usuarios (id_usuario, mail, password, nombre, activo) VALUES
    (1, 'vendedor@gmail.com', '$2b$10$nLf7UmkF4ABguEbEJnp0B.VYMo466hydXittlxjbgKCtFEFC4imA2', 'Lucía Fernández', 1),
    (2, 'repositor@gmail.com', '$2b$10$Z59nfCHwfqghPZ8Ytyg5o.Usngpaz2pl3xOw7NWh5CdFw5rcDS/pq', 'Martín Pereira', 1),
    (3, 'administrador@gmail.com', '$2b$10$xaamu5Z1HcZ4y/g8xb8ZsuzkSxQFczvUtgUHAqQHnSneUc1P9cPVm', 'Carolina Silva', 1),
    (4, 'juan.perez@gmail.com', '$2b$10$nuJQN/72aODtPoNOU.bXX.ESFo.erXYT2InB/Z4t5scUgjJLvWbu2', 'Juan Pérez', 1),
    (5, 'sofia.gomez@gmail.com', '$2b$10$1KcLkoClp5H6.7fQ.pOeVulGPVOgwzoZNY1H/C.p4L4vh.QlnuAli', 'Sofía Gómez', 0);

INSERT INTO usuario_rol (id_usuario_rol, id_usuario, id_rol) VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 3, 1),
    (4, 4, 2),
    (5, 4, 3),
    (6, 5, 2);

-- CATEGORÍAS
INSERT INTO categoria (id_categoria, nombre, descripcion) VALUES
    (1, 'Tarjetas de video', 'Placas de video para gaming y diseño'),
    (2, 'Motherboard', 'Placas madre AMD e Intel'),
    (3, 'Procesadores', 'Procesadores AMD Ryzen e Intel Core'),
    (4, 'Memoria RAM', 'Memorias DDR4 y DDR5'),
    (5, 'Fuentes', 'Fuentes de alimentación certificadas'),
    (6, 'Gabinetes', 'Gabinetes ATX y Micro-ATX'),
    (7, 'Periféricos', 'Teclados, mouse, auriculares y accesorios'),
    (8, 'Monitores', 'Monitores de oficina y gamer'),
    (9, 'Conectores', 'Cables y adaptadores'),
    (10, 'Almacenamiento', 'Discos duros, M.2, SSD y pendrives');

-- PRODUCTOS (algunos sin stock o bajo el mínimo para ver las alertas)
INSERT INTO producto (id_producto, codigo, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, estado_producto, id_categoria) VALUES
    (1, '7730000000001', 'NVIDIA GeForce RTX 3060', 'Tarjeta gráfica NVIDIA GeForce RTX 3060 12GB', 8500, 11000, 2, 3, 1, 1),
    (2, '7730000000002', 'AMD Radeon RX 7800 XT', 'Tarjeta gráfica AMD Radeon RX 7800 XT 16GB', 20000, 25000, 8, 3, 1, 1),
    (3, '7730000000003', 'NVIDIA GeForce RTX 4070 Ti Super', 'Tarjeta gráfica NVIDIA GeForce RTX 4070 Ti Super 16GB', 30000, 36000, 5, 2, 1, 1),
    (4, '7730000000004', 'ASUS Prime B550M', 'Placa madre ASUS Prime B550M (AM4)', 4500, 6000, 10, 3, 1, 2),
    (5, '7730000000005', 'MSI B650 Gaming Plus', 'Placa madre MSI B650 Gaming Plus (AM5)', 7500, 9500, 7, 2, 1, 2),
    (6, '7730000000006', 'Gigabyte Z790 AORUS Elite', 'Placa madre Gigabyte Z790 AORUS Elite (LGA1700)', 10000, 13000, 5, 2, 1, 2),
    (7, '7730000000007', 'ASRock B760M Pro', 'Placa madre ASRock B760M Pro (LGA1700)', 5500, 7000, 9, 3, 1, 2),
    (8, '7730000000008', 'AMD Ryzen 5 5600', 'Procesador AMD Ryzen 5 5600, 6 núcleos', 5000, 6500, 10, 3, 1, 3),
    (9, '7730000000009', 'Intel Core i7-14700K', 'Procesador Intel Core i7-14700K, 20 núcleos', 18000, 22000, 5, 2, 1, 3),
    (10, '7730000000010', 'AMD Ryzen 7 5700X3D', 'Procesador AMD Ryzen 7 5700X3D, 8 núcleos', 9500, 12000, 7, 2, 1, 3),
    (11, '7730000000011', 'Intel Core i3-12100F', 'Procesador Intel Core i3-12100F, 4 núcleos', 3500, 4500, 12, 3, 1, 3),
    (12, '7730000000012', 'AMD Ryzen 3 3200G', 'Procesador AMD Ryzen 3 3200G con gráficos integrados', 3200, 3500, 10, 2, 1, 3),
    (13, '7730000000013', 'Kingston FURY Beast 16GB DDR4', 'Memoria RAM Kingston FURY Beast de 16GB DDR4', 1800, 2500, 15, 4, 1, 4),
    (14, '7730000000014', 'Corsair Vengeance RGB 32GB DDR5', 'Memoria RAM Corsair Vengeance RGB de 32GB DDR5', 4000, 5500, 10, 3, 1, 4),
    (15, '7730000000015', 'XPG Spectrix D50 16GB DDR4', 'Memoria RAM XPG Spectrix D50 de 16GB DDR4', 2000, 2800, 0, 3, 1, 4),
    (16, '7730000000016', 'Teamgroup T-Force Delta 32GB DDR5', 'Memoria RAM Teamgroup T-Force Delta de 32GB DDR5', 3800, 5200, 9, 3, 1, 4),
    (17, '7730000000017', 'EVGA 700W Gold', 'Fuente de alimentación EVGA de 700W con certificación Gold', 3500, 4500, 7, 2, 1, 5),
    (18, '7730000000018', 'Corsair 650W Bronze', 'Fuente de alimentación Corsair de 650W con certificación Bronze', 2500, 3500, 9, 3, 1, 5),
    (19, '7730000000019', 'Thermaltake 500W', 'Fuente de alimentación Thermaltake de 500W', 1800, 2500, 12, 3, 1, 5),
    (20, '7730000000020', 'MSI MAG 850W Gold', 'Fuente de alimentación MSI MAG de 850W con certificación Gold', 4500, 6000, 6, 2, 1, 5),
    (21, '7730000000021', 'Cooler Master MasterBox', 'Gabinete Cooler Master MasterBox', 3000, 4000, 8, 2, 1, 6),
    (22, '7730000000022', 'DeepCool CC560', 'Gabinete DeepCool CC560', 2800, 3800, 0, 3, 1, 6),
    (23, '7730000000023', 'Lian Li PC-O11 Dynamic', 'Gabinete Lian Li PC-O11 Dynamic', 6500, 8500, 13, 2, 1, 6),
    (24, '7730000000024', 'MSI MAG FORGE', 'Gabinete MSI MAG FORGE', 3200, 4300, 8, 3, 1, 6),
    (25, '7730000000025', 'Mouse Logitech G203', 'Mouse gamer Logitech G203', 800, 1120, 20, 5, 1, 7),
    (26, '7730000000026', 'Teclado USB', 'Teclado USB estándar', 1500, 2190, 26, 5, 1, 7),
    (27, '7730000000027', 'Auriculares Bluetooth', 'Auriculares inalámbricos Bluetooth', 2500, 3400, 15, 4, 1, 7),
    (28, '7730000000028', 'Teclado VSG Mintaka Mecánico', 'Teclado mecánico VSG Mintaka', 2500, 3500, 11, 2, 1, 7),
    (29, '7730000000029', 'Auriculares VSG Shake', 'Auriculares VSG Shake', 1800, 2500, 10, 3, 1, 7),
    (30, '7730000000030', 'Mousepad SteelSeries XL', 'Mousepad SteelSeries tamaño XL', 1200, 1700, 12, 3, 1, 7),
    (31, '7730000000031', 'Monitor 27" 4K', 'Monitor de 27 pulgadas con resolución 4K', 8500, 12300, 6, 2, 1, 8),
    (32, '7730000000032', 'Monitor Gamer MSI 24"', 'Monitor gamer MSI de 24 pulgadas', 6000, 8000, 0, 2, 1, 8),
    (33, '7730000000033', 'Monitor Curvo ViewSonic 27"', 'Monitor curvo ViewSonic de 27 pulgadas', 6500, 8500, 7, 2, 1, 8),
    (34, '7730000000034', 'Monitor Gigabyte 27"', 'Monitor Gigabyte de 27 pulgadas', 6000, 8000, 10, 2, 1, 8),
    (35, '7730000000035', 'Monitor ZOWIE BenQ 24"', 'Monitor ZOWIE BenQ de 24 pulgadas', 7500, 9500, 5, 2, 1, 8),
    (36, '7730000000036', 'Monitor Gamer Teros 21.5"', 'Monitor Teros TE-2128S FHD, 100 Hz, 1 ms, panel IPS', 3100, 3900, 10, 3, 1, 8),
    (37, '7730000000037', 'Cable HDMI 2m', 'Cable HDMI de 2 metros', 600, 890, 30, 8, 1, 9),
    (38, '7730000000038', 'Cable DisplayPort 2m', 'Cable DisplayPort de 2 metros', 400, 700, 22, 7, 1, 9),
    (39, '7730000000039', 'Adaptador USB-C a HDMI', 'Adaptador USB-C a HDMI', 500, 900, 20, 5, 1, 9),
    (40, '7730000000040', 'Cable USB-C a USB-C', 'Cable USB-C a USB-C de 1 metro', 300, 600, 25, 7, 1, 9),
    (41, '7730000000041', 'SSD M.2 Kingston NV2', 'Disco sólido M.2 NVMe Kingston NV2', 8000, 8500, 13, 3, 1, 10);

-- VARIANTES
INSERT INTO tipo_variante (id_tipo_variante, nombre) VALUES
    (1, 'Color'),
    (2, 'Almacenamiento');

INSERT INTO variante (id_variante, valor, id_producto, id_tipo_variante) VALUES
    (1, 'Negro', 36, 1),
    (2, 'Blanco', 36, 1),
    (3, '500GB', 41, 2),
    (4, '1TB', 41, 2),
    (5, 'Negro', 28, 1),
    (6, 'Blanco', 28, 1);

-- VENTAS (subtotal = cantidad x precio, total = suma de subtotales)
INSERT INTO venta (id_venta, fecha_hora, total, id_usuario, nombre_cliente) VALUES
    (1, '2026-09-12 10:15:00', 3880, 1, 'Pedro Sánchez'),
    (2, '2026-09-18 16:40:00', 10500, 1, 'Diego Martínez'),
    (3, '2026-09-25 11:05:00', 22000, 4, 'Valentina López'),
    (4, '2026-10-02 18:20:00', 17500, 1, 'Andrés Castro'),
    (5, '2026-10-09 12:30:00', 8890, 3, 'Camila Rodríguez'),
    (6, '2026-10-15 17:45:00', 36000, 4, 'Federico Suárez'),
    (7, '2026-10-22 16:36:00', 3940, 1, 'Mariana Acosta'),
    (8, '2026-10-27 10:50:00', 6000, 1, 'Gonzalo Ríos'),
    (9, '2026-10-30 19:10:00', 27000, 4, 'Lucas Méndez'),
    (10, '2026-11-02 11:25:00', 8500, 1, 'Florencia Díaz'),
    (11, '2026-11-03 15:00:00', 10300, 3, 'Sebastián Torres'),
    (12, '2026-11-04 17:30:00', 31000, 1, 'Agustina Morales'),
    (13, '2026-11-05 10:05:00', 3310, 4, 'Rodrigo Vega'),
    (14, '2026-11-05 12:40:00', 5200, 1, 'Paula Herrera');

INSERT INTO detalle_venta (id_detalle_venta, id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
    (1, 1, 37, 2, 890, 1780),
    (2, 1, 38, 3, 700, 2100),
    (3, 2, 17, 1, 4500, 4500),
    (4, 2, 18, 1, 3500, 3500),
    (5, 2, 19, 1, 2500, 2500),
    (6, 3, 9, 1, 22000, 22000),
    (7, 4, 8, 1, 6500, 6500),
    (8, 4, 4, 1, 6000, 6000),
    (9, 4, 13, 2, 2500, 5000),
    (10, 5, 34, 1, 8000, 8000),
    (11, 5, 37, 1, 890, 890),
    (12, 6, 3, 1, 36000, 36000),
    (13, 7, 25, 2, 1120, 2240),
    (14, 7, 30, 1, 1700, 1700),
    (15, 8, 28, 1, 3500, 3500),
    (16, 8, 29, 1, 2500, 2500),
    (17, 9, 10, 1, 12000, 12000),
    (18, 9, 5, 1, 9500, 9500),
    (19, 9, 14, 1, 5500, 5500),
    (20, 10, 33, 1, 8500, 8500),
    (21, 11, 41, 1, 8500, 8500),
    (22, 11, 39, 2, 900, 1800),
    (23, 12, 2, 1, 25000, 25000),
    (24, 12, 20, 1, 6000, 6000),
    (25, 13, 26, 1, 2190, 2190),
    (26, 13, 25, 1, 1120, 1120),
    (27, 14, 40, 3, 600, 1800),
    (28, 14, 27, 1, 3400, 3400);

-- COMPRAS (4 repuestas y 2 pendientes para ver el aviso en Reposiciones)
INSERT INTO compra (id_compra, id_usuario, fecha_hora, total, estado) VALUES
    (1, 3, '2026-09-05 09:30:00', 43500, 'repuesta'),
    (2, 3, '2026-09-20 09:15:00', 20000, 'repuesta'),
    (3, 3, '2026-10-10 10:00:00', 43000, 'repuesta'),
    (4, 3, '2026-10-28 14:10:00', 28000, 'repuesta'),
    (5, 3, '2026-11-03 09:40:00', 27200, 'pendiente'),
    (6, 3, '2026-11-04 16:20:00', 18000, 'pendiente');

INSERT INTO detalle_compra (id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal) VALUES
    (1, 1, 1, 3, 8500, 25500),
    (2, 1, 13, 10, 1800, 18000),
    (3, 2, 37, 20, 600, 12000),
    (4, 2, 25, 10, 800, 8000),
    (5, 3, 8, 5, 5000, 25000),
    (6, 3, 4, 4, 4500, 18000),
    (7, 4, 34, 4, 6000, 24000),
    (8, 4, 38, 10, 400, 4000),
    (9, 5, 15, 8, 2000, 16000),
    (10, 5, 22, 4, 2800, 11200),
    (11, 6, 32, 3, 6000, 18000);

-- GASTOS
INSERT INTO gastos (id_gastos, id_compra, descripcion, monto, fecha) VALUES
    (1, 1, 'Compra #1', 43500, '2026-09-05'),
    (2, 2, 'Compra #2', 20000, '2026-09-20'),
    (3, 3, 'Compra #3', 43000, '2026-10-10'),
    (4, 4, 'Compra #4', 28000, '2026-10-28'),
    (5, 5, 'Compra #5', 27200, '2026-11-03'),
    (6, 6, 'Compra #6', 18000, '2026-11-04');

-- REPOSICIONES
INSERT INTO reposicion (id_reposicion, fecha_hora, comentario, cantidad, id_producto, id_usuario) VALUES
    (1, '2026-09-06 10:00:00', 'Compra #1', 3, 1, 2),
    (2, '2026-09-06 10:00:00', 'Compra #1', 10, 13, 2),
    (3, '2026-09-17 15:25:00', 'Ingreso por devolución de proveedor', 8, 23, 2),
    (4, '2026-09-21 11:20:00', 'Compra #2', 20, 37, 2),
    (5, '2026-09-21 11:20:00', 'Compra #2', 10, 25, 2),
    (6, '2026-09-23 18:13:00', NULL, 4, 28, 2),
    (7, '2026-10-05 11:50:00', 'Conteo de inventario: diferencia a favor', 6, 26, 4),
    (8, '2026-10-11 09:45:00', 'Compra #3', 5, 8, 2),
    (9, '2026-10-11 09:45:00', 'Compra #3', 4, 4, 2),
    (10, '2026-10-19 10:10:00', 'Mercadería que estaba en depósito', 5, 27, 2),
    (11, '2026-10-29 10:30:00', 'Compra #4', 4, 34, 2),
    (12, '2026-10-29 10:30:00', 'Compra #4', 10, 38, 2);
