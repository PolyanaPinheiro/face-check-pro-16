-- Database: facial

-- DROP DATABASE IF EXISTS facial;

CREATE DATABASE facial
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE usuario (
    id_usuario SERIAL NOT NULL,           -- Cria o ID automático
    nome VARCHAR(100) NOT NULL,
    imagem_registro TEXT NOT NULL,        -- TEXT aceita o texto gigante do Base64 completo

    PRIMARY KEY (id_usuario)
);

