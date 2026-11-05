-- StockFlow - DDL (estructura de la base)
-- Crea la base y todas las tablas desde cero. Anda en MySQL y MariaDB.
-- Ojo: borra las tablas si ya existen. No correrlo en el servidor real.
-- Después de este script se corre dml.sql (datos de prueba).

CREATE DATABASE IF NOT EXISTS stockflow
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE stockflow;

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS gastos;
DROP TABLE IF EXISTS detalle_compra;
DROP TABLE IF EXISTS compra;
DROP TABLE IF EXISTS detalle_venta;
DROP TABLE IF EXISTS venta;
DROP TABLE IF EXISTS reposicion;
DROP TABLE IF EXISTS variante;
DROP TABLE IF EXISTS tipo_variante;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS usuario_rol;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS usuarios;
-- tablas viejas que ya no se usan
DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedido;

SET FOREIGN_KEY_CHECKS = 1;

-- USUARIOS Y ROLES

CREATE TABLE usuarios (
    id_usuario  INT          NOT NULL AUTO_INCREMENT,
    mail        VARCHAR(100) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    nombre      VARCHAR(100) NOT NULL,
    activo      TINYINT      NOT NULL DEFAULT 1,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuarios_mail (mail),
    CONSTRAINT chk_usuarios_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE rol (
    id_rol  INT         NOT NULL AUTO_INCREMENT,
    nombre  VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_rol),
    UNIQUE KEY uq_rol_nombre (nombre)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- un usuario puede tener varios roles
CREATE TABLE usuario_rol (
    id_usuario_rol  INT NOT NULL AUTO_INCREMENT,
    id_usuario      INT NOT NULL,
    id_rol          INT NOT NULL,
    PRIMARY KEY (id_usuario_rol),
    UNIQUE KEY uq_usuario_rol (id_usuario, id_rol),
    KEY idx_usuario_rol_rol (id_rol),
    CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_usuario_rol_rol     FOREIGN KEY (id_rol)     REFERENCES rol (id_rol)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- CATÁLOGO
-- los precios van en pesos sin centavos: DECIMAL(20,0)

CREATE TABLE categoria (
    id_categoria  INT          NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(50)  NOT NULL,
    descripcion   VARCHAR(250) NULL,
    PRIMARY KEY (id_categoria),
    UNIQUE KEY uq_categoria_nombre (nombre)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE producto (
    id_producto      INT           NOT NULL AUTO_INCREMENT,
    codigo           VARCHAR(50)   NOT NULL,
    nombre           VARCHAR(100)  NOT NULL,
    descripcion      VARCHAR(600)  NULL,
    precio_compra    DECIMAL(20,0) NOT NULL,
    precio_venta     DECIMAL(20,0) NOT NULL,
    stock            INT           NOT NULL DEFAULT 0,
    stock_minimo     INT           NOT NULL DEFAULT 0,
    estado_producto  TINYINT       NOT NULL DEFAULT 1,
    id_categoria     INT           NOT NULL,
    PRIMARY KEY (id_producto),
    UNIQUE KEY uq_producto_codigo (codigo),
    KEY idx_producto_categoria (id_categoria),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria),
    CONSTRAINT chk_producto_precio_compra CHECK (precio_compra >= 0),
    CONSTRAINT chk_producto_precio_venta  CHECK (precio_venta >= 0),
    CONSTRAINT chk_producto_stock         CHECK (stock >= 0),
    CONSTRAINT chk_producto_stock_minimo  CHECK (stock_minimo >= 0),
    CONSTRAINT chk_producto_estado        CHECK (estado_producto IN (0, 1))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE tipo_variante (
    id_tipo_variante  INT         NOT NULL AUTO_INCREMENT,
    nombre            VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_tipo_variante),
    UNIQUE KEY uq_tipo_variante_nombre (nombre)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- una fila por valor (ej: Color = Negro, Color = Blanco)
CREATE TABLE variante (
    id_variante       INT         NOT NULL AUTO_INCREMENT,
    valor             VARCHAR(50) NOT NULL,
    id_producto       INT         NOT NULL,
    id_tipo_variante  INT         NOT NULL,
    PRIMARY KEY (id_variante),
    KEY idx_variante_producto (id_producto),
    KEY idx_variante_tipo (id_tipo_variante),
    CONSTRAINT fk_variante_producto FOREIGN KEY (id_producto)      REFERENCES producto (id_producto),
    CONSTRAINT fk_variante_tipo     FOREIGN KEY (id_tipo_variante) REFERENCES tipo_variante (id_tipo_variante)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- VENTAS
-- total y subtotal se guardan a propósito: son la foto del precio

CREATE TABLE venta (
    id_venta        INT           NOT NULL AUTO_INCREMENT,
    fecha_hora      DATETIME      NOT NULL,
    total           DECIMAL(20,0) NOT NULL,
    id_usuario      INT           NOT NULL,
    nombre_cliente  VARCHAR(150)  NOT NULL,
    PRIMARY KEY (id_venta),
    KEY idx_venta_usuario (id_usuario),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    CONSTRAINT chk_venta_total CHECK (total >= 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE detalle_venta (
    id_detalle_venta  INT           NOT NULL AUTO_INCREMENT,
    id_venta          INT           NOT NULL,
    id_producto       INT           NOT NULL,
    cantidad          INT           NOT NULL,
    precio_unitario   DECIMAL(20,0) NOT NULL,
    subtotal          DECIMAL(20,0) NOT NULL,
    PRIMARY KEY (id_detalle_venta),
    KEY idx_detalle_venta_venta (id_venta),
    KEY idx_detalle_venta_producto (id_producto),
    CONSTRAINT fk_detalle_venta_venta    FOREIGN KEY (id_venta)    REFERENCES venta (id_venta),
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
    CONSTRAINT chk_detalle_venta_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detalle_venta_precio   CHECK (precio_unitario >= 0),
    CONSTRAINT chk_detalle_venta_subtotal CHECK (subtotal >= 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- COMPRAS A PROVEEDORES Y GASTOS
-- La compra queda 'pendiente' hasta que el repositor la repone

CREATE TABLE compra (
    id_compra   INT           NOT NULL AUTO_INCREMENT,
    id_usuario  INT           NOT NULL,
    fecha_hora  DATETIME      NOT NULL,
    total       DECIMAL(20,0) NOT NULL,
    estado      VARCHAR(20)   NOT NULL DEFAULT 'pendiente',
    PRIMARY KEY (id_compra),
    KEY idx_compra_usuario (id_usuario),
    CONSTRAINT fk_compra_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    CONSTRAINT chk_compra_total  CHECK (total >= 0),
    CONSTRAINT chk_compra_estado CHECK (estado IN ('pendiente', 'repuesta'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE detalle_compra (
    id_detalle_compra  INT           NOT NULL AUTO_INCREMENT,
    id_compra          INT           NOT NULL,
    id_producto        INT           NOT NULL,
    cantidad           INT           NOT NULL,
    costo_unitario     DECIMAL(20,0) NOT NULL,
    subtotal           DECIMAL(20,0) NOT NULL,
    PRIMARY KEY (id_detalle_compra),
    KEY idx_detalle_compra_compra (id_compra),
    KEY idx_detalle_compra_producto (id_producto),
    CONSTRAINT fk_detalle_compra_compra   FOREIGN KEY (id_compra)   REFERENCES compra (id_compra),
    CONSTRAINT fk_detalle_compra_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
    CONSTRAINT chk_detalle_compra_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detalle_compra_costo    CHECK (costo_unitario >= 0),
    CONSTRAINT chk_detalle_compra_subtotal CHECK (subtotal >= 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- registro contable de cada compra (una sola por compra)
CREATE TABLE gastos (
    id_gastos    INT           NOT NULL AUTO_INCREMENT,
    id_compra    INT           NOT NULL,
    descripcion  VARCHAR(150)  NOT NULL,
    monto        DECIMAL(20,0) NOT NULL,
    fecha        DATE          NOT NULL,
    PRIMARY KEY (id_gastos),
    UNIQUE KEY uq_gastos_compra (id_compra),
    CONSTRAINT fk_gastos_compra FOREIGN KEY (id_compra) REFERENCES compra (id_compra),
    CONSTRAINT chk_gastos_monto CHECK (monto >= 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- REPOSICIONES (entradas de stock)

CREATE TABLE reposicion (
    id_reposicion  INT          NOT NULL AUTO_INCREMENT,
    fecha_hora     DATETIME     NOT NULL,
    comentario     VARCHAR(250) NULL,
    cantidad       INT          NOT NULL,
    id_producto    INT          NOT NULL,
    id_usuario     INT          NOT NULL,
    PRIMARY KEY (id_reposicion),
    KEY idx_reposicion_producto (id_producto),
    KEY idx_reposicion_usuario (id_usuario),
    CONSTRAINT fk_reposicion_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
    CONSTRAINT fk_reposicion_usuario  FOREIGN KEY (id_usuario)  REFERENCES usuarios (id_usuario),
    CONSTRAINT chk_reposicion_cantidad CHECK (cantidad > 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
