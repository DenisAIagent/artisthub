-- ARTISTHUB CRM DATABASE SCHEMA
-- Professional Multi-Role CRM System
-- Designed for scalability and clean separation of concerns

-- ============================================
-- CORE ENTITIES & AUTHENTICATION
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Artists and Team Members)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artists table (Core entity)
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stage_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    genre VARCHAR(100),
    bio TEXT,
    website_url TEXT,
    spotify_id VARCHAR(100),
    apple_music_id VARCHAR(100),
    instagram_handle VARCHAR(100),
    twitter_handle VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles enumeration
CREATE TYPE user_role AS ENUM (
    'artist',
    'marketing_manager',
    'tour_manager',
    'album_manager',
    'financial_manager',
    'press_officer',
    'admin'
);

-- Team memberships (M:N relationship between users and artists)
CREATE TABLE team_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    joined_at TIMESTAMP,
    UNIQUE(user_id, artist_id, role)
);

-- ============================================
-- MARKETING MODULE
-- ============================================

CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50), -- 'album_launch', 'tour_promotion', 'brand_partnership'
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'paused', 'completed'
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    target_audience JSONB,
    platforms JSONB, -- ['instagram', 'spotify', 'youtube']
    kpis JSONB, -- Key performance indicators
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_media_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'twitter', 'tiktok', 'youtube'
    metric_type VARCHAR(50) NOT NULL, -- 'followers', 'engagement_rate', 'reach'
    value DECIMAL(15,2) NOT NULL,
    recorded_date DATE NOT NULL,
    campaign_id UUID REFERENCES marketing_campaigns(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(artist_id, platform, metric_type, recorded_date)
);

CREATE TABLE audience_demographics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    age_group VARCHAR(20), -- '18-24', '25-34', etc.
    gender VARCHAR(20),
    location VARCHAR(100),
    percentage DECIMAL(5,2),
    recorded_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TOURING MODULE
-- ============================================

CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tour_type VARCHAR(50), -- 'headlining', 'supporting', 'festival'
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'announced', 'on_sale', 'active', 'completed'
    start_date DATE,
    end_date DATE,
    total_budget DECIMAL(12,2),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    capacity INTEGER,
    venue_type VARCHAR(50), -- 'arena', 'theater', 'club', 'festival'
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tour_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id),
    date DATE NOT NULL,
    doors_time TIME,
    show_time TIME,
    ticket_price_min DECIMAL(8,2),
    ticket_price_max DECIMAL(8,2),
    capacity INTEGER,
    tickets_sold INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'on_sale', 'sold_out', 'completed', 'cancelled'
    gross_revenue DECIMAL(12,2),
    production_cost DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tour_logistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_date_id UUID REFERENCES tour_dates(id) ON DELETE CASCADE,
    logistics_type VARCHAR(50) NOT NULL, -- 'transportation', 'accommodation', 'catering', 'security'
    provider VARCHAR(255),
    cost DECIMAL(10,2),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ALBUMS MODULE
-- ============================================

CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    album_type VARCHAR(50), -- 'studio', 'live', 'compilation', 'ep', 'single'
    genre VARCHAR(100),
    release_date DATE,
    label VARCHAR(255),
    producer VARCHAR(255),
    total_tracks INTEGER,
    duration_seconds INTEGER,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'recording', 'mixing', 'mastering', 'released'
    production_budget DECIMAL(12,2),
    marketing_budget DECIMAL(12,2),
    cover_art_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    track_number INTEGER NOT NULL,
    duration_seconds INTEGER,
    isrc VARCHAR(20), -- International Standard Recording Code
    writers JSONB, -- Array of songwriter names
    producers JSONB, -- Array of producer names
    status VARCHAR(50) DEFAULT 'demo', -- 'demo', 'recorded', 'mixed', 'mastered', 'released'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE streaming_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'spotify', 'apple_music', 'youtube_music'
    metric_type VARCHAR(50) NOT NULL, -- 'streams', 'saves', 'playlist_adds'
    value BIGINT NOT NULL,
    recorded_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(track_id, platform, metric_type, recorded_date)
);

CREATE TABLE production_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    milestone VARCHAR(100) NOT NULL, -- 'songwriting', 'pre_production', 'recording', 'mixing'
    planned_date DATE,
    actual_date DATE,
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'delayed'
    notes TEXT,
    responsible_person VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FINANCIAL MODULE
-- ============================================

CREATE TYPE revenue_category AS ENUM (
    'streaming',
    'touring',
    'merchandise',
    'licensing',
    'publishing',
    'endorsements',
    'other'
);

CREATE TYPE expense_category AS ENUM (
    'production',
    'marketing',
    'touring',
    'legal',
    'management',
    'equipment',
    'other'
);

CREATE TABLE revenue_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    source VARCHAR(255) NOT NULL, -- 'Spotify', 'Live Nation', 'Merch Store'
    category revenue_category NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    description TEXT,
    reference_id VARCHAR(255), -- External transaction ID
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    vendor VARCHAR(255) NOT NULL,
    category expense_category NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_date DATE NOT NULL,
    description TEXT,
    receipt_url TEXT,
    reference_id VARCHAR(255),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE royalty_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    source VARCHAR(255) NOT NULL, -- 'BMI', 'ASCAP', 'Record Label'
    statement_period_start DATE NOT NULL,
    statement_period_end DATE NOT NULL,
    gross_amount DECIMAL(12,2) NOT NULL,
    deductions DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    statement_file_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PRESS MODULE
-- ============================================

CREATE TABLE press_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50), -- 'album_release', 'tour_announcement', 'brand_partnership'
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'completed'
    start_date DATE,
    end_date DATE,
    target_publications JSONB, -- Array of target media outlets
    key_messages TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media_coverage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    press_campaign_id UUID REFERENCES press_campaigns(id),
    publication VARCHAR(255) NOT NULL,
    journalist VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    article_url TEXT,
    publication_date DATE,
    media_type VARCHAR(50), -- 'article', 'interview', 'review', 'podcast', 'video'
    sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative'
    reach_estimate INTEGER,
    key_quotes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    press_campaign_id UUID REFERENCES press_campaigns(id),
    publication VARCHAR(255) NOT NULL,
    interviewer VARCHAR(255),
    interview_type VARCHAR(50), -- 'written', 'audio', 'video', 'live'
    scheduled_date TIMESTAMP,
    duration_minutes INTEGER,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    talking_points TEXT,
    transcript_url TEXT,
    published_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ANALYTICS & REPORTING
-- ============================================

CREATE TABLE activity_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'album_release', 'tour_date', 'press_coverage', 'campaign_launch'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_date DATE NOT NULL,
    related_entity_type VARCHAR(50), -- 'album', 'tour', 'campaign', 'press'
    related_entity_id UUID,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- 'monthly_summary', 'tour_performance', 'album_analytics'
    title VARCHAR(255) NOT NULL,
    period_start DATE,
    period_end DATE,
    data JSONB NOT NULL, -- Flexible JSON structure for report data
    generated_by UUID REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Core entity indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_artists_user_id ON artists(user_id);
CREATE INDEX idx_team_memberships_user_artist ON team_memberships(user_id, artist_id);

-- Marketing indexes
CREATE INDEX idx_marketing_campaigns_artist ON marketing_campaigns(artist_id);
CREATE INDEX idx_social_stats_artist_date ON social_media_stats(artist_id, recorded_date);

-- Touring indexes
CREATE INDEX idx_tours_artist ON tours(artist_id);
CREATE INDEX idx_tour_dates_tour ON tour_dates(tour_id);
CREATE INDEX idx_tour_dates_date ON tour_dates(date);

-- Albums indexes
CREATE INDEX idx_albums_artist ON albums(artist_id);
CREATE INDEX idx_tracks_album ON tracks(album_id);
CREATE INDEX idx_streaming_stats_track_date ON streaming_stats(track_id, recorded_date);

-- Financial indexes
CREATE INDEX idx_revenue_artist_date ON revenue_streams(artist_id, transaction_date);
CREATE INDEX idx_expenses_artist_date ON expenses(artist_id, transaction_date);

-- Press indexes
CREATE INDEX idx_press_campaigns_artist ON press_campaigns(artist_id);
CREATE INDEX idx_media_coverage_artist ON media_coverage(artist_id);

-- Timeline indexes
CREATE INDEX idx_activity_timeline_artist_date ON activity_timeline(artist_id, activity_date);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_dates_updated_at BEFORE UPDATE ON tour_dates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_timeline_updated_at BEFORE UPDATE ON production_timeline FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_press_campaigns_updated_at BEFORE UPDATE ON press_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- EMAIL MAILING SERVICE EXTENSION
-- ============================================

-- Contact roles specific to email communication
CREATE TYPE contact_role_enum AS ENUM (
    'marketing',
    'press',
    'tour',
    'album',
    'financial',
    'general',
    'media',
    'venue',
    'label',
    'distributor'
);

-- Email contacts by profession/role
CREATE TABLE email_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    contact_role contact_role_enum NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(200),
    position VARCHAR(200),
    phone VARCHAR(50),
    tags TEXT[], -- segmentation tags
    status contact_status_enum DEFAULT 'active',
    source VARCHAR(100), -- 'imported', 'manual', 'api'
    metadata JSONB, -- profession-specific data
    last_contacted TIMESTAMP,
    email_score INTEGER DEFAULT 0, -- engagement score
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(artist_id, email, contact_role)
);

-- Email campaign management
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    subject VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    template_id UUID REFERENCES email_templates(id),
    contact_role contact_role_enum NOT NULL,
    status campaign_status_enum DEFAULT 'draft',
    send_type VARCHAR(50) DEFAULT 'immediate', -- 'immediate', 'scheduled', 'drip'
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    recipient_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    bounce_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email templates by profession
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    contact_role contact_role_enum NOT NULL,
    category VARCHAR(100), -- 'press_release', 'tour_announcement', 'album_promo'
    subject_template VARCHAR(300),
    content_template TEXT NOT NULL,
    variables JSONB, -- available merge variables
    is_default BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual email sends tracking
CREATE TABLE email_sends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES email_contacts(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status send_status_enum DEFAULT 'pending',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    first_opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    bounce_reason TEXT,
    unsubscribed_at TIMESTAMP,
    tracking_id VARCHAR(100) UNIQUE,
    provider_message_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email replies integration
CREATE TABLE email_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_send_id UUID REFERENCES email_sends(id),
    contact_id UUID NOT NULL REFERENCES email_contacts(id),
    artist_id UUID NOT NULL REFERENCES artists(id),
    thread_id VARCHAR(255), -- for conversation tracking
    subject VARCHAR(300),
    content TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email interaction tracking
CREATE TABLE email_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES email_contacts(id),
    artist_id UUID NOT NULL REFERENCES artists(id),
    interaction_type interaction_type_enum NOT NULL,
    campaign_id UUID REFERENCES email_campaigns(id),
    send_id UUID REFERENCES email_sends(id),
    user_agent TEXT,
    ip_address INET,
    location VARCHAR(100),
    device_type VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email list segmentation
CREATE TABLE email_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    contact_role contact_role_enum NOT NULL,
    criteria JSONB, -- segmentation criteria
    is_dynamic BOOLEAN DEFAULT FALSE, -- auto-update based on criteria
    contact_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- List membership (M:N between contacts and lists)
CREATE TABLE email_list_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES email_lists(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES email_contacts(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by UUID REFERENCES users(id),
    UNIQUE(list_id, contact_id)
);

-- Email automation workflows
CREATE TABLE email_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    contact_role contact_role_enum NOT NULL,
    trigger_type VARCHAR(50), -- 'contact_added', 'date_based', 'behavior_based'
    trigger_config JSONB,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'stopped'
    steps JSONB, -- workflow steps configuration
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email analytics aggregated by day
CREATE TABLE email_analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id),
    contact_role contact_role_enum NOT NULL,
    date DATE NOT NULL,
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    emails_unsubscribed INTEGER DEFAULT 0,
    replies_received INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(artist_id, contact_role, date)
);

-- Required enums for email service
CREATE TYPE contact_status_enum AS ENUM ('active', 'unsubscribed', 'bounced', 'invalid', 'suppressed');
CREATE TYPE campaign_status_enum AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'completed', 'paused', 'cancelled');
CREATE TYPE send_status_enum AS ENUM ('pending', 'sent', 'delivered', 'bounced', 'opened', 'clicked', 'replied', 'unsubscribed');
CREATE TYPE interaction_type_enum AS ENUM ('email_sent', 'email_opened', 'email_clicked', 'reply_received', 'unsubscribed', 'bounced', 'forwarded');

-- Indexes for email service performance
CREATE INDEX idx_email_contacts_artist_role ON email_contacts(artist_id, contact_role);
CREATE INDEX idx_email_contacts_email ON email_contacts(email);
CREATE INDEX idx_email_contacts_status ON email_contacts(status);
CREATE INDEX idx_email_campaigns_artist_role ON email_campaigns(artist_id, contact_role);
CREATE INDEX idx_email_sends_tracking ON email_sends(tracking_id);
CREATE INDEX idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX idx_email_sends_contact ON email_sends(contact_id);
CREATE INDEX idx_email_sends_status ON email_sends(status);
CREATE INDEX idx_email_interactions_contact ON email_interactions(contact_id);
CREATE INDEX idx_email_interactions_artist_date ON email_interactions(artist_id, created_at);
CREATE INDEX idx_email_replies_contact ON email_replies(contact_id);
CREATE INDEX idx_email_replies_assigned ON email_replies(assigned_to, processed);
CREATE INDEX idx_email_analytics_artist_role_date ON email_analytics_daily(artist_id, contact_role, date);

-- Triggers for email-related tables
CREATE TRIGGER update_email_contacts_updated_at BEFORE UPDATE ON email_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_lists_updated_at BEFORE UPDATE ON email_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_workflows_updated_at BEFORE UPDATE ON email_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();