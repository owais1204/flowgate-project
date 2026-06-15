CREATE DATABASE flowgate_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(50)
);

CREATE TABLE workflows (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    department VARCHAR(100),
    status VARCHAR(50),
    submitted_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE approvals (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER,
    approver_id INTEGER,
    decision VARCHAR(50),
    comments TEXT,
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflow_logs (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER,
    action VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
