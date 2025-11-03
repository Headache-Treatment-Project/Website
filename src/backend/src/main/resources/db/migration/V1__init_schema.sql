-- V1: 初始化資料庫結構
-- Flyway 遷移腳本

-- 用戶表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'CASE_MANAGER')),
    phone VARCHAR(20),
    gender VARCHAR(10),
    age INTEGER,
    patient_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 頭痛日誌表
CREATE TABLE IF NOT EXISTS headache_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date TIMESTAMP NOT NULL,
    intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 10),
    symptoms VARCHAR(500),
    medication VARCHAR(200),
    notes VARCHAR(500),
    duration_hours INTEGER,
    location VARCHAR(100),
    triggers VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 健康量表表
CREATE TABLE IF NOT EXISTS health_scales (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scale_type VARCHAR(50) NOT NULL CHECK (scale_type IN ('MIDAS', 'HADS', 'BDI', 'PSQI', 'FSS', 'WPI', 'ALLODYNIA', 'PERCEIVED_STRESS')),
    test_date TIMESTAMP NOT NULL,
    score INTEGER NOT NULL,
    level VARCHAR(50),
    answers TEXT,
    interpretation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 索引優化
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_headache_logs_user_id ON headache_logs(user_id);
CREATE INDEX idx_headache_logs_log_date ON headache_logs(log_date);
CREATE INDEX idx_headache_logs_user_date ON headache_logs(user_id, log_date DESC);
CREATE INDEX idx_health_scales_user_id ON health_scales(user_id);
CREATE INDEX idx_health_scales_scale_type ON health_scales(scale_type);
CREATE INDEX idx_health_scales_user_type_date ON health_scales(user_id, scale_type, test_date DESC);
