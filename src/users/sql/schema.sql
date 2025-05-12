-- ================================
-- User Table
-- ================================
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL,
    major VARCHAR(100),
    goal VARCHAR(255),
    emotion VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ================================
-- Routine Table
-- ================================
CREATE TABLE routines (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ================================
-- Routine Feedback Table
-- ================================
CREATE TABLE routine_feedbacks (
    id VARCHAR(50) PRIMARY KEY,
    routine_id VARCHAR(50) REFERENCES routines(id) ON DELETE CASCADE,
    interrupt_count INT DEFAULT 0,
    focus_score FLOAT DEFAULT 0.0,
    emotion_summary TEXT,
    lia_feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ================================
-- Emotion Log Table
-- ================================
CREATE TABLE emotion_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    emotion VARCHAR(50),
    confidence FLOAT DEFAULT 0.0
);

-- ================================
-- Report Table
-- ================================
CREATE TABLE reports (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    summary JSON,
    created_at TIMESTAMP DEFAULT NOW()
); 