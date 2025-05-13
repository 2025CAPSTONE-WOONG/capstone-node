CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    major VARCHAR(100),
    goal VARCHAR(100),
    emotion VARCHAR(50),
    sleep_score INT DEFAULT NULL,
    stress_level INT DEFAULT NULL,
    tutorial_completed BOOLEAN DEFAULT FALSE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    routine_recommendation_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- ===========================
-- 📌 웨어러블 센서 데이터
-- ===========================
CREATE TABLE biometrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    heart_rate INT,
    hrv INT,
    movement ENUM('still', 'active'),
    timestamp TIMESTAMP,
    user_agent VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===========================
-- 📌 루틴 (Routine)
-- ===========================
CREATE TABLE routines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status ENUM('active', 'completed', 'missed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===========================
-- 📌 감정 로그 (Emotion Log)
-- ===========================
CREATE TABLE emotion_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    emotion VARCHAR(50),
    confidence DECIMAL(5, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===========================
-- 📌 루틴 피드백 (Routine Feedback)
-- ===========================
CREATE TABLE routine_feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    routine_id BIGINT NOT NULL,
    focus_score DECIMAL(5, 2),
    interruption_count INT DEFAULT 0,
    emotion_summary VARCHAR(255),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

-- ===========================
-- 📌 리포트 (Report)
-- ===========================
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    report_type ENUM('daily', 'weekly') NOT NULL,
    content JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===========================
-- 📌 사회적 연결 추천 (Social Recommendations)
-- ===========================
CREATE TABLE social_recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(255),
    type ENUM('community', 'activity'),
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);