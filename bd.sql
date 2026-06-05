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

CREATE TABLE face_signatures (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    embedding TEXT NOT NULL
);

describe face_signatures;