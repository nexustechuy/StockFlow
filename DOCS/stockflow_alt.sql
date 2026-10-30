-- Base de datos de StockFlow (estructura y datos).
-- Para cargarla: en HeidiSQL, Archivo > Cargar archivo SQL y ejecutar.
-- Si alguien cambia la base, que la exporte de nuevo, reemplace este archivo y avise.

-- Configuración de MySQL para la importación (no tocar)

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Base de datos `stockflow`

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `StockFlow` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `StockFlow`;

-- Tabla `categoria`

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `categoria`

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Tarjetas de video',NULL),(2,'Motherboard',NULL),(3,'Procesadores',NULL),(4,'Memoria RAM',NULL),(5,'Fuentes',NULL),(6,'Gabinetes',NULL),(7,'Periféricos',NULL),(8,'Monitores',NULL),(9,'Conectores',NULL),(10,'Almacenamiento','Discos Duros, M.2, SSD, Pendrives');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `cliente`

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `cliente`

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `compra`

DROP TABLE IF EXISTS `compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compra` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `total` decimal(20,6) DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `id_usuario_compra` (`id_usuario`),
  CONSTRAINT `id_usuario_compra` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `compra`

LOCK TABLES `compra` WRITE;
/*!40000 ALTER TABLE `compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `compra` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `detalle_compra`

DROP TABLE IF EXISTS `detalle_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_compra` (
  `id_detalle_compra` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `costo_unitario` decimal(20,6) NOT NULL,
  `subtotal` decimal(20,6) NOT NULL,
  PRIMARY KEY (`id_detalle_compra`),
  KEY `id_compra_detalle` (`id_compra`),
  KEY `id_producto_detalle_compra` (`id_producto`),
  CONSTRAINT `id_compra_detalle` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`),
  CONSTRAINT `id_producto_detalle_compra` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `detalle_compra`

LOCK TABLES `detalle_compra` WRITE;
/*!40000 ALTER TABLE `detalle_compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_compra` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `detalle_pedido`

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id_detalle_pedido` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(20,6) DEFAULT NULL,
  `subtotal` decimal(20,6) DEFAULT NULL,
  PRIMARY KEY (`id_detalle_pedido`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_producto_detalle_pedido` (`id_producto`),
  CONSTRAINT `id_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  CONSTRAINT `id_producto_detalle_pedido` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `detalle_pedido`

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `detalle_venta`

DROP TABLE IF EXISTS `detalle_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_venta` (
  `id_detalle_venta` int NOT NULL AUTO_INCREMENT,
  `id_venta` int DEFAULT NULL,
  `id_producto` int NOT NULL DEFAULT '0',
  `cantidad` int NOT NULL DEFAULT '0',
  `precio_unitario` decimal(20,6) NOT NULL DEFAULT (0),
  `subtotal` decimal(20,6) NOT NULL DEFAULT (0),
  PRIMARY KEY (`id_detalle_venta`),
  KEY `id_producto` (`id_producto`),
  KEY `id_venta` (`id_venta`),
  CONSTRAINT `id_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `id_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `detalle_venta`

LOCK TABLES `detalle_venta` WRITE;
/*!40000 ALTER TABLE `detalle_venta` DISABLE KEYS */;
INSERT INTO `detalle_venta` VALUES (1,2,38,2,890.000000,1780.000000),(2,2,39,3,700.000000,2100.000000),(3,3,17,1,4500.000000,4500.000000),(4,3,18,1,3500.000000,3500.000000),(5,3,19,1,2500.000000,2500.000000),(6,4,10,1,22000.000000,22000.000000),(7,5,38,2,890.000000,1780.000000),(8,6,38,1,890.000000,890.000000);
/*!40000 ALTER TABLE `detalle_venta` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `gastos`

DROP TABLE IF EXISTS `gastos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos` (
  `id_gastos` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `descripcion` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto` decimal(20,6) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id_gastos`) USING BTREE,
  UNIQUE KEY `id_compra_gastos` (`id_compra`),
  CONSTRAINT `id_compra_gastos` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `gastos`

LOCK TABLES `gastos` WRITE;
/*!40000 ALTER TABLE `gastos` DISABLE KEYS */;
/*!40000 ALTER TABLE `gastos` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `pedido`

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `total` decimal(20,6) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario_pedido` (`id_usuario`),
  CONSTRAINT `id_usuario_pedido` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `pedido`

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `producto`

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(600) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio_compra` decimal(20,0) DEFAULT NULL,
  `precio_venta` decimal(20,0) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `stock_minimo` int DEFAULT NULL,
  `estado_producto` tinyint DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `id_categoria` (`id_categoria`) USING BTREE,
  CONSTRAINT `id_cat` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `producto`

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,NULL,'NVIDIA GeForce RTX 3060','Tarjeta gráfica NVIDIA GeForce RTX 3060',8500,11000,2,3,1,1),(2,NULL,'AMD Radeon RX 7800 XT','Tarjeta gráfica AMD Radeon RX 7800 XT',20000,25000,8,3,1,1),(3,NULL,'NVIDIA GeForce RTX 4070 Ti Super','Tarjeta gráfica NVIDIA GeForce RTX 4070 Ti Super',30000,36000,5,2,1,1),(5,NULL,'ASUS Prime B550M','Placa madre ASUS Prime B550M',4500,6000,10,3,1,2),(6,NULL,'MSI B650 Gaming Plus','Placa madre MSI B650 Gaming Plus',7500,9500,7,2,1,2),(7,NULL,'Gigabyte Z790 AORUS Elite','Placa madre Gigabyte Z790 AORUS Elite',10000,13000,5,2,1,2),(8,NULL,'ASROCK B760M Pro','Placa madre ASROCK B760M Pro',5500,7000,9,3,1,2),(9,NULL,'AMD Ryzen 5 5600','Procesador AMD Ryzen 5 5600',5000,6500,10,3,1,3),(10,NULL,'Intel Core i7-14700K','Procesador Intel Core i7-14700K',18000,22000,5,2,1,3),(11,NULL,'AMD Ryzen 7 5700X3D','Procesador AMD Ryzen 7 5700X3D',9500,12000,7,2,1,3),(12,NULL,'Intel Core i3-12100F','Procesador Intel Core i3-12100F',3500,4500,12,3,1,3),(13,NULL,'Kingston FURY Beast 16GB DDR4','Memoria RAM Kingston FURY Beast de 16GB DDR4',1800,2500,15,4,1,4),(14,NULL,'Corsair Vengeance RGB 32GB DDR5','Memoria RAM Corsair Vengeance RGB de 32GB DDR5',4000,5500,10,3,1,4),(15,NULL,'XPG Spectrix D50 16GB DDR4','Memoria RAM XPG Spectrix D50 de 16GB DDR4',2000,2800,0,3,1,4),(16,NULL,'Teamgroup T-Force Delta 32GB DDR5','Memoria RAM Teamgroup T-Force Delta de 32GB DDR5',3800,5200,9,3,1,4),(17,NULL,'EVGA 700W Gold','Fuente de alimentación EVGA de 700W con certificación Gold',3500,4500,7,2,1,5),(18,NULL,'Corsair 650W Bronze','Fuente de alimentación Corsair de 650W con certificación Bronze',2500,3500,9,3,1,5),(19,NULL,'Thermaltake 500W','Fuente de alimentación Thermaltake de 500W',1800,2500,11,3,1,5),(20,NULL,'MSI MAG 850W Gold','Fuente de alimentación MSI MAG de 850W con certificación Gold',4500,6000,6,2,1,5),(21,NULL,'Cooler Master MasterBox','Gabinete Cooler Master MasterBox',3000,4000,8,2,1,6),(22,NULL,'DeepCool CC560','Gabinete DeepCool CC560',2800,3800,0,3,1,6),(23,NULL,'Lian Li PC-O11 Dynamic','Gabinete Lian Li PC-O11 Dynamic',6500,8500,13,2,1,6),(24,NULL,'MSI MAG FORGE','Gabinete MSI MAG FORGE',3200,4300,9,3,1,6),(25,NULL,'Mouse G203','Mouse Logitech G203',800,1120,20,5,1,7),(26,NULL,'Teclado USB','Teclado USB estándar',1500,2190,26,5,1,7),(27,NULL,'Auriculares Bluetooth','Auriculares inalámbricos Bluetooth',2500,3400,15,4,1,7),(29,NULL,'Teclado VSG Mintaka Mecánico','Teclado mecánico VSG Mintaka',2500,3500,11,2,1,7),(30,NULL,'Auriculares VSG Shake','Auriculares VSG Shake',1800,2500,10,3,1,7),(31,NULL,'Mousepad SteelSeries XL','Mousepad SteelSeries tamaño XL',1200,1700,12,3,1,7),(33,NULL,'Monitor 27\" 4K','Monitor de 27 pulgadas con resolución 4K',8500,12300,6,2,1,8),(34,NULL,'Monitor Gamer MSI 24\"','Monitor gamer MSI de 24 pulgadas',6000,8000,0,2,1,8),(35,NULL,'Monitor Curvo ViewSonic 27\"','Monitor curvo ViewSonic de 27 pulgadas',6500,8500,7,2,1,8),(36,NULL,'Monitor Gigabyte 27\"','Monitor Gigabyte de 27 pulgadas',6000,8000,8,2,1,8),(37,NULL,'Monitor ZOWIE BenQ 24\"','Monitor ZOWIE BenQ de 24 pulgadas',7500,9500,5,2,1,8),(38,NULL,'Cable HDMI 2m','Cable HDMI de 2 metros',600,890,25,8,1,9),(39,NULL,'Cable DisplayPort 2m','Cable DisplayPort de 2 metros',400,700,22,7,1,9),(40,NULL,'Adaptador USB-C a HDMI','Adaptador USB-C a HDMI',500,900,20,5,1,9),(41,NULL,'Cable USB-C a USB-C','Cable USB-C a USB-C',300,600,25,7,1,9),(43,NULL,'Monitor Gamer Teros 21.5\'\'','Descubre el monitor Teros TE-2128S, una opción excepcional para quienes buscan calidad y rendimiento. Con una resolución FHD de 1920 x 1080, disfrutarás de imágenes nítidas y vibrantes. Su tiempo de respuesta de 1ms y frecuencia de actualización de 100 Hz lo convierten en un aliado perfecto para los gamers, ofreciendo una experiencia de juego fluida y sin interrupciones. Gracias a su tecnología de panel IPS, experimentarás ángulos de visión amplios, lo que lo hace ideal para compartir contenido.',3900,3900,10,5,1,8),(44,NULL,'Disco Solido Ssd M2 Kingston','Disco solido ssd m2 de almacenamiento',8000,8500,0,0,1,10),(45,NULL,'Procesador gamer AMD Ryzen 3 3200G','Procesador AMD',3200,3500,10,0,1,3),(47,NULL,'teclado','teclado usb gamer',0,0,9,5,1,7),(48,NULL,'vbmxvbm','gasdbgawe',0,0,13,5,1,7),(49,NULL,'nuevo producto','nuevo producto',2,2,41,16,1,4);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `reposicion`

DROP TABLE IF EXISTS `reposicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reposicion` (
  `id_reposicion` int NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime DEFAULT NULL,
  `comentario` varchar(250) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_reposicion`),
  KEY `id_producto_repo` (`id_producto`),
  KEY `id_usuario_repo` (`id_usuario`),
  CONSTRAINT `id_producto_repo` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `id_usuario_repo` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `reposicion`

LOCK TABLES `reposicion` WRITE;
/*!40000 ALTER TABLE `reposicion` DISABLE KEYS */;
INSERT INTO `reposicion` VALUES (1,'2026-09-17 03:25:10','Reposición',8,23,2),(2,'2026-09-17 21:13:05',NULL,4,29,2),(3,'2026-09-23 23:50:09','nueva reposicion',6,26,2);
/*!40000 ALTER TABLE `reposicion` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `rol`

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `rol`

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'administrador'),(4,'cliente'),(3,'repositor'),(2,'vendedor');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `tipo_variante`

DROP TABLE IF EXISTS `tipo_variante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_variante` (
  `id_tipo_variante` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_variante`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `tipo_variante`

LOCK TABLES `tipo_variante` WRITE;
/*!40000 ALTER TABLE `tipo_variante` DISABLE KEYS */;
INSERT INTO `tipo_variante` VALUES (2,'Almacenamiento'),(1,'Color');
/*!40000 ALTER TABLE `tipo_variante` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `usuario_rol`

DROP TABLE IF EXISTS `usuario_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_rol` (
  `id_usuario_rol` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id_usuario_rol`),
  UNIQUE KEY `usuario_rol_unico` (`id_usuario`,`id_rol`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `usuario_rol`

LOCK TABLES `usuario_rol` WRITE;
/*!40000 ALTER TABLE `usuario_rol` DISABLE KEYS */;
INSERT INTO `usuario_rol` VALUES (1,1,2),(2,2,3),(3,3,1),(4,7,1);
/*!40000 ALTER TABLE `usuario_rol` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `usuarios`

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `activo` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `usuarios`

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'vendedor@gmail.com','$2b$10$A3ukDImSyD40ObHmi1/p9envnlyjeaF1G.I10pLP.zqb0af9dBYba',NULL,1),(2,'repositor@gmail.com','$2b$10$V5zkNx.1ozUviPeQPXLoG.d7QeJVlEwcK3iC0/ZDR6ELLauv9ULn6',NULL,1),(3,'administrador@gmail.com','$2b$10$mQ9z4dxw.VZD0mkqJQrLYut34/lC/m8SOvmxQWHfpl/zR0SbREia6',NULL,1),(7,'juanperez@gmail.com','$2b$10$CpuF5TZO8v50iRmVINClAOcZXOdVH6pvJ/j8YobT7QWmoiaglU6KC','Juan Perez',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `variante`

DROP TABLE IF EXISTS `variante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variante` (
  `id_variante` int NOT NULL AUTO_INCREMENT,
  `valor` varchar(50) DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `id_tipo_variante` int NOT NULL,
  PRIMARY KEY (`id_variante`),
  KEY `id_producto_variante` (`id_producto`),
  KEY `id_tipo_variante` (`id_tipo_variante`),
  CONSTRAINT `id_producto_variante` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `id_tipo_variante` FOREIGN KEY (`id_tipo_variante`) REFERENCES `tipo_variante` (`id_tipo_variante`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `variante`

LOCK TABLES `variante` WRITE;
/*!40000 ALTER TABLE `variante` DISABLE KEYS */;
INSERT INTO `variante` VALUES (1,'Blanco',43,1),(2,'500gb',44,2),(3,'Negro',47,1),(4,'Negro',49,1),(5,'Negro',43,1),(6,'1 Tera',44,2);
/*!40000 ALTER TABLE `variante` ENABLE KEYS */;
UNLOCK TABLES;

-- Tabla `venta`

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime DEFAULT NULL,
  `total` decimal(20,6) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_cliente` int DEFAULT NULL,
  `nombre_cliente` varchar(150) DEFAULT NULL,
  `id_pedido` int DEFAULT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_cliente_ventas` (`id_cliente`),
  KEY `id_pedido_ventas` (`id_pedido`),
  CONSTRAINT `id_cliente_ventas` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `id_pedido_ventas` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  CONSTRAINT `id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Datos de `venta`

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
INSERT INTO `venta` VALUES (2,'2026-09-17 03:18:11',3880.000000,1,NULL,'Pedro Sánchez',NULL),(3,'2026-09-17 21:32:44',10500.000000,1,NULL,'Diego',NULL),(4,'2026-09-23 23:51:04',22000.000000,1,NULL,'joaquito',NULL),(5,'2026-10-22 16:36:56',1780.000000,1,NULL,'pedro',NULL),(6,'2026-10-22 16:45:31',890.000000,1,NULL,'pepa',NULL);
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;


-- Se restaura la configuración original de MySQL (no tocar)
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Fin del script
