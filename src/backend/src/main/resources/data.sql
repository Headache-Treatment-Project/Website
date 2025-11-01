-- 測試資料（僅供開發環境使用）
-- 密碼都是 "password123" 經過 BCrypt 加密

-- 插入測試用戶
INSERT INTO users (email, password, name, role, phone, age, patient_id, is_active) VALUES
('patient1@example.com', '$2a$10$XQO8.n9y5GNQb6qQjBKv8.dJZJZ.jEOXN7jZ7Z7Z7Z7Z7Z7Z7Z7Zu', '張小明', 'PATIENT', '0912345678', 30, 'P001', TRUE),
('patient2@example.com', '$2a$10$XQO8.n9y5GNQb6qQjBKv8.dJZJZ.jEOXN7jZ7Z7Z7Z7Z7Z7Z7Z7Zu', '李小華', 'PATIENT', '0923456789', 28, 'P002', TRUE),
('doctor1@example.com', '$2a$10$XQO8.n9y5GNQb6qQjBKv8.dJZJZ.jEOXN7jZ7Z7Z7Z7Z7Z7Z7Z7Zu', '王醫師', 'DOCTOR', '0934567890', 45, NULL, TRUE),
('manager1@example.com', '$2a$10$XQO8.n9y5GNQb6qQjBKv8.dJZJZ.jEOXN7jZ7Z7Z7Z7Z7Z7Z7Z7Zu', '陳個管師', 'CASE_MANAGER', '0945678901', 35, NULL, TRUE)
ON CONFLICT (email) DO NOTHING;

-- 注意：實際使用時，請使用 BCrypt 生成真實的密碼雜湊
-- 可以使用以下 Java 代碼生成：
-- BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
-- String hashedPassword = encoder.encode("password123");
