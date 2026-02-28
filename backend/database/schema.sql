-- Bharat Samuh Anudan - Complete Database Schema
-- PostgreSQL 15+ with advanced features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM (
    'super_admin',
    'system_admin', 
    'finance_admin',
    'group_admin',
    'support_admin',
    'member'
);

CREATE TYPE user_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending_verification'
);

CREATE TYPE kyc_status AS ENUM (
    'pending',
    'verified',
    'rejected',
    'under_review'
);

CREATE TYPE group_status AS ENUM (
    'active',
    'inactive',
    'pending_approval',
    'suspended',
    'completed'
);

CREATE TYPE member_role AS ENUM (
    'leader',
    'admin',
    'treasurer',
    'member'
);

CREATE TYPE transaction_type AS ENUM (
    'deposit',
    'withdrawal',
    'transfer',
    'installment',
    'claim_payout',
    'donation',
    'fee',
    'refund'
);

CREATE TYPE transaction_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'cancelled',
    'refunded'
);

CREATE TYPE payment_method AS ENUM (
    'razorpay',
    'upi',
    'bank_transfer',
    'cash',
    'cheque',
    'wallet'
);

CREATE TYPE claim_status AS ENUM (
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'paid'
);

CREATE TYPE document_type AS ENUM (
    'aadhaar',
    'pan_card',
    'passport',
    'voter_id',
    'driving_license',
    'birth_certificate',
    'death_certificate',
    'medical_report',
    'bank_statement',
    'address_proof',
    'photo',
    'nominee_form'
);

CREATE TYPE audit_action AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'VIEW',
    'LOGIN',
    'LOGOUT',
    'APPROVE',
    'REJECT',
    'PAYMENT',
    'EXPORT',
    'IMPORT'
);

-- ============================================
-- CORE TABLES
-- ============================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    
    -- Role & Status
    role user_role DEFAULT 'member',
    status user_status DEFAULT 'pending_verification',
    
    -- Profile
    date_of_birth DATE,
    gender VARCHAR(20),
    profile_photo_url TEXT,
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    location GEOGRAPHY(POINT, 4326),
    
    -- KYC Information
    kyc_status kyc_status DEFAULT 'pending',
    aadhaar_number VARCHAR(12),
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    pan_number VARCHAR(10),
    pan_verified BOOLEAN DEFAULT FALSE,
    
    -- Banking
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(100),
    account_holder_name VARCHAR(200),
    upi_id VARCHAR(100),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_relation VARCHAR(50),
    
    -- Device & Security
    device_tokens TEXT[],
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    referred_by UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_phone CHECK (phone ~ '^[0-9]{10,15}$'),
    CONSTRAINT valid_email CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Profiles Table (Extended User Information)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Occupation
    occupation VARCHAR(100),
    monthly_income DECIMAL(15, 2),
    employer_name VARCHAR(200),
    
    -- Family
    marital_status VARCHAR(20),
    family_members INTEGER DEFAULT 1,
    dependents INTEGER DEFAULT 0,
    
    -- Preferences
    language_preference VARCHAR(10) DEFAULT 'hi',
    notification_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    
    -- Social
    referral_code VARCHAR(20) UNIQUE,
    referral_count INTEGER DEFAULT 0,
    
    -- Government Schemes
    jan_dhan_account BOOLEAN DEFAULT FALSE,
    pmjdy_account BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Nominees Table
CREATE TABLE nominees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Nominee Details
    full_name VARCHAR(200) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(15),
    email VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    
    -- Documents
    aadhaar_number VARCHAR(12),
    document_urls TEXT[],
    
    -- Share Percentage
    share_percentage DECIMAL(5, 2) DEFAULT 100.00,
    is_primary BOOLEAN DEFAULT TRUE,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_share CHECK (share_percentage > 0 AND share_percentage <= 100)
);

-- Groups Table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name VARCHAR(200) NOT NULL,
    description TEXT,
    group_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Media
    photo_url TEXT,
    banner_url TEXT,
    documents JSONB DEFAULT '[]',
    
    -- Location
    location VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    coordinates GEOGRAPHY(POINT, 4326),
    
    -- Leadership
    leader_id UUID NOT NULL REFERENCES users(id),
    
    -- Configuration
    max_members INTEGER DEFAULT 1000,
    installment_amount DECIMAL(10, 2) DEFAULT 100.00,
    total_installments INTEGER DEFAULT 32,
    current_installment INTEGER DEFAULT 0,
    
    -- Status
    status group_status DEFAULT 'pending_approval',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Financials
    total_fund DECIMAL(15, 2) DEFAULT 0.00,
    collected_amount DECIMAL(15, 2) DEFAULT 0.00,
    disbursed_amount DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Schedule
    start_date DATE,
    expected_end_date DATE,
    
    -- Approval
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Group Members Table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Role & Status
    role member_role DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Installment Tracking
    installments_paid INTEGER DEFAULT 0,
    total_contributed DECIMAL(15, 2) DEFAULT 0.00,
    last_payment_at TIMESTAMP WITH TIME ZONE,
    
    -- Benefits Received
    is_beneficiary BOOLEAN DEFAULT FALSE,
    beneficiary_installment_number INTEGER,
    benefit_amount DECIMAL(15, 2),
    benefit_received_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(group_id, user_id)
);

-- Installments Table
CREATE TABLE installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    
    -- Schedule
    due_date DATE NOT NULL,
    grace_period_days INTEGER DEFAULT 7,
    
    -- Financials
    amount_per_member DECIMAL(10, 2) DEFAULT 100.00,
    total_expected DECIMAL(15, 2),
    total_collected DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Beneficiary
    beneficiary_id UUID REFERENCES users(id),
    disbursed_amount DECIMAL(15, 2),
    disbursed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(group_id, installment_number)
);

-- Installment Payments Table
CREATE TABLE installment_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    installment_id UUID NOT NULL REFERENCES installments(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES group_members(id) ON DELETE CASCADE,
    
    -- Payment
    amount DECIMAL(10, 2) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Transaction Link
    transaction_id UUID,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallets Table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID UNIQUE REFERENCES groups(id) ON DELETE CASCADE,
    
    -- Wallet Type
    wallet_type VARCHAR(20) NOT NULL CHECK (wallet_type IN ('user', 'group', 'system')),
    
    -- Balance
    balance DECIMAL(15, 2) DEFAULT 0.00,
    locked_balance DECIMAL(15, 2) DEFAULT 0.00,
    total_credited DECIMAL(15, 2) DEFAULT 0.00,
    total_debited DECIMAL(15, 2) DEFAULT 0.00,
    
    -- Limits
    daily_limit DECIMAL(15, 2) DEFAULT 100000.00,
    monthly_limit DECIMAL(15, 2) DEFAULT 1000000.00,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_frozen BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT wallet_owner_check CHECK (
        (wallet_type = 'user' AND user_id IS NOT NULL AND group_id IS NULL) OR
        (wallet_type = 'group' AND group_id IS NOT NULL AND user_id IS NULL) OR
        (wallet_type = 'system' AND user_id IS NULL AND group_id IS NULL)
    )
);

-- Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_ref VARCHAR(50) UNIQUE NOT NULL,
    
    -- Parties
    from_wallet_id UUID REFERENCES wallets(id),
    to_wallet_id UUID REFERENCES wallets(id),
    user_id UUID REFERENCES users(id),
    
    -- Transaction Details
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- Payment Info
    payment_method payment_method,
    payment_gateway_ref VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    
    -- Split Details (for ₹100 installment)
    split_staff DECIMAL(10, 2) DEFAULT 0.00,
    split_group DECIMAL(10, 2) DEFAULT 0.00,
    split_consolidated DECIMAL(10, 2) DEFAULT 0.00,
    split_management DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Description
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_by UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT
);

-- Death Claims Table
CREATE TABLE death_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_ref VARCHAR(50) UNIQUE NOT NULL,
    
    -- Claimant
    claimant_id UUID NOT NULL REFERENCES users(id),
    nominee_id UUID REFERENCES nominees(id),
    group_id UUID NOT NULL REFERENCES groups(id),
    
    -- Deceased Info
    deceased_name VARCHAR(200) NOT NULL,
    deceased_relationship VARCHAR(50),
    date_of_death DATE NOT NULL,
    place_of_death VARCHAR(200),
    cause_of_death TEXT,
    
    -- Claim Details
    claim_amount DECIMAL(15, 2) NOT NULL,
    claim_status claim_status DEFAULT 'submitted',
    
    -- Documents
    death_certificate_url TEXT,
    medical_certificate_url TEXT,
    police_report_url TEXT,
    other_documents JSONB DEFAULT '[]',
    
    -- Bank Details for Payout
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(100),
    account_holder_name VARCHAR(200),
    
    -- Processing
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    paid_by UUID REFERENCES users(id),
    paid_at TIMESTAMP WITH TIME ZONE,
    transaction_id UUID REFERENCES transactions(id),
    
    -- Rejection
    rejected_by UUID REFERENCES users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Document Info
    document_type document_type NOT NULL,
    document_number VARCHAR(100),
    document_url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    
    -- OCR Data
    extracted_data JSONB DEFAULT '{}',
    confidence_score DECIMAL(5, 2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Actor
    user_id UUID REFERENCES users(id),
    user_role VARCHAR(50),
    
    -- Action
    action audit_action NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    
    -- Details
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    
    -- Action
    action_url TEXT,
    action_text VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Push
    push_sent BOOLEAN DEFAULT FALSE,
    push_delivered BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Config Table
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    config_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    is_editable BOOLEAN DEFAULT TRUE,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fraud Detection Table
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Alert Details
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    
    -- Related Entities
    user_id UUID REFERENCES users(id),
    transaction_id UUID REFERENCES transactions(id),
    group_id UUID REFERENCES groups(id),
    
    -- Detection
    risk_score DECIMAL(5, 2),
    triggered_rules JSONB DEFAULT '[]',
    evidence JSONB DEFAULT '{}',
    
    -- Resolution
    assigned_to UUID REFERENCES users(id),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_kyc ON users(kyc_status);
CREATE INDEX idx_users_created ON users(created_at);

-- Groups indexes
CREATE INDEX idx_groups_code ON groups(group_code);
CREATE INDEX idx_groups_leader ON groups(leader_id);
CREATE INDEX idx_groups_status ON groups(status);
CREATE INDEX idx_groups_location ON groups USING GIST(coordinates);

-- Group Members indexes
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_active ON group_members(group_id, is_active);

-- Transactions indexes
CREATE INDEX idx_transactions_ref ON transactions(transaction_ref);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_from ON transactions(from_wallet_id);
CREATE INDEX idx_transactions_to ON transactions(to_wallet_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created ON transactions(created_at);

-- Death Claims indexes
CREATE INDEX idx_death_claims_claimant ON death_claims(claimant_id);
CREATE INDEX idx_death_claims_group ON death_claims(group_id);
CREATE INDEX idx_death_claims_status ON death_claims(claim_status);

-- Audit Logs indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_members_updated_at BEFORE UPDATE ON group_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_death_claims_updated_at BEFORE UPDATE ON death_claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Wallet balance update trigger
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Credit to wallet
        IF NEW.to_wallet_id IS NOT NULL THEN
            UPDATE wallets 
            SET balance = balance + NEW.amount,
                total_credited = total_credited + NEW.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.to_wallet_id;
        END IF;
        
        -- Debit from wallet
        IF NEW.from_wallet_id IS NOT NULL THEN
            UPDATE wallets 
            SET balance = balance - NEW.amount,
                total_debited = total_debited + NEW.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.from_wallet_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_update_wallet_balance
    AFTER UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_balance();

-- Generate Group Code Function
CREATE OR REPLACE FUNCTION generate_group_code(p_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    v_base VARCHAR(10);
    v_suffix VARCHAR(6);
    v_code VARCHAR(20);
BEGIN
    -- Take first 4 letters of group name (uppercase, alphanumeric only)
    v_base := UPPER(REGEXP_REPLACE(LEFT(p_name, 4), '[^A-Za-z0-9]', '', 'g'));
    
    -- Generate random 4-character suffix
    v_suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
    
    v_code := v_base || '-' || v_suffix;
    
    -- Check if code exists, if so regenerate
    WHILE EXISTS(SELECT 1 FROM groups WHERE group_code = v_code) LOOP
        v_suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4));
        v_code := v_base || '-' || v_suffix;
    END LOOP;
    
    RETURN v_code;
END;
$$ language 'plpgsql';

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert system wallets
INSERT INTO wallets (id, wallet_type, balance, is_active) VALUES
    (uuid_generate_v4(), 'system', 0.00, TRUE),
    (uuid_generate_v4(), 'system', 0.00, TRUE),
    (uuid_generate_v4(), 'system', 0.00, TRUE),
    (uuid_generate_v4(), 'system', 0.00, TRUE);

-- Insert default system config
INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
    ('installment_amount', '100', 'number', 'Default installment amount in INR'),
    ('max_group_members', '1000', 'number', 'Maximum members per group'),
    ('total_installments', '32', 'number', 'Total installments in a group cycle'),
    ('split_staff_percentage', '20', 'number', 'Staff wallet split percentage'),
    ('split_group_percentage', '50', 'number', 'Group wallet split percentage'),
    ('split_consolidated_percentage', '10', 'number', 'Consolidated wallet split percentage'),
    ('split_management_percentage', '20', 'number', 'Management wallet split percentage'),
    ('claim_processing_days', '7', 'number', 'Days to process death claims'),
    ('kyc_required', 'true', 'boolean', 'Require KYC for transactions'),
    ('maintenance_mode', 'false', 'boolean', 'System maintenance mode'),
    ('sms_provider', 'twilio', 'string', 'SMS service provider'),
    ('email_sender', 'noreply@bharatsamuhanudan.org', 'string', 'Default email sender');

-- ============================================
-- VIEWS
-- ============================================

-- User Dashboard View
CREATE VIEW v_user_dashboard AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.phone,
    u.kyc_status,
    w.balance as wallet_balance,
    COUNT(DISTINCT gm.group_id) as total_groups,
    COUNT(DISTINCT CASE WHEN gm.is_beneficiary THEN gm.group_id END) as benefits_received,
    COALESCE(SUM(gm.total_contributed), 0) as total_contributed
FROM users u
LEFT JOIN wallets w ON w.user_id = u.id
LEFT JOIN group_members gm ON gm.user_id = u.id AND gm.is_active = TRUE
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.first_name, u.last_name, u.phone, u.kyc_status, w.balance;

-- Group Summary View
CREATE VIEW v_group_summary AS
SELECT 
    g.id as group_id,
    g.name,
    g.group_code,
    g.status,
    g.max_members,
    g.total_fund,
    g.current_installment,
    COUNT(DISTINCT gm.user_id) as current_members,
    COUNT(DISTINCT CASE WHEN gm.role = 'leader' THEN gm.user_id END) as has_leader,
    COUNT(DISTINCT CASE WHEN gm.is_beneficiary THEN gm.user_id END) as beneficiaries_count
FROM groups g
LEFT JOIN group_members gm ON gm.group_id = g.id AND gm.is_active = TRUE
WHERE g.deleted_at IS NULL
GROUP BY g.id, g.name, g.group_code, g.status, g.max_members, g.total_fund, g.current_installment;

-- Transaction Summary View
CREATE VIEW v_transaction_summary AS
SELECT 
    DATE_TRUNC('day', t.created_at) as date,
    t.type,
    t.status,
    COUNT(*) as count,
    SUM(t.amount) as total_amount
FROM transactions t
GROUP BY DATE_TRUNC('day', t.created_at), t.type, t.status
ORDER BY date DESC;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE death_claims ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_self_access ON users
    FOR ALL
    USING (id = current_setting('app.current_user_id')::UUID OR 
           current_setting('app.user_role') = 'super_admin');

-- Users can only see their own wallet
CREATE POLICY wallet_owner_access ON wallets
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID OR 
           current_setting('app.user_role') IN ('super_admin', 'finance_admin'));

-- Group members can see group transactions
CREATE POLICY transaction_group_access ON transactions
    FOR SELECT
    USING (
        user_id = current_setting('app.current_user_id')::UUID OR
        EXISTS (
            SELECT 1 FROM group_members gm
            JOIN wallets w ON w.group_id = gm.group_id
            WHERE gm.user_id = current_setting('app.current_user_id')::UUID
            AND (w.id = transactions.from_wallet_id OR w.id = transactions.to_wallet_id)
        ) OR
        current_setting('app.user_role') IN ('super_admin', 'finance_admin')
    );
