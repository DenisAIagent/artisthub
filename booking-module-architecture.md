# 🎪 Module Booking Professionnel - Architecture Bob Booking

## Vue d'ensemble

Module de booking intégré au CRM ArtistHub reproduisant les fonctionnalités avancées de Bob Booking pour la gestion complète des tournées, venues et contrats.

## 🎯 Fonctionnalités Clés (Basées sur Bob Booking)

### Gestion de Venues Avancée
- **Base de données venues complète** avec géolocalisation
- **Profils détaillés** : capacité, équipement, contacts multiples
- **Historique relationnel** et ratings internes
- **Recherche intelligente** par critères multiples
- **Venue matching** automatique selon requirements

### Workflow Booking Professionnel
- **Parcours complet** : Inquiry → Hold → Offer → Contract → Settlement
- **Gestion des holds multiples** avec priorités
- **Négociation trackée** et versioning contractuel
- **Templates modulaires** par type d'événement
- **E-signatures intégrées**

### Tour Planning & Routing
- **Algorithmes d'optimisation** de routing
- **Calendrier multi-vues** (artiste, équipe, venues)
- **Gestion logistique** complète
- **Buffer days** et contraintes géographiques
- **Crew management** intégré

### Financial Management
- **Tracking garanties et pourcentages**
- **Gestion deposits** avec alertes échéances
- **Settlement détaillé** post-événement
- **Reporting P&L** par show/tour
- **Multi-devises** et export comptable

## 🏗️ Architecture Base de Données

### Extension du Schéma Existant

```sql
-- ============================================
-- BOOKING MODULE EXTENSION
-- ============================================

-- Enhanced venues table (upgrade existing)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS venue_type_detailed VARCHAR(100); -- 'arena', 'theater', 'club', 'festival', 'outdoor'
ALTER TABLE venues ADD COLUMN IF NOT EXISTS sound_system JSONB; -- detailed audio specs
ALTER TABLE venues ADD COLUMN IF NOT EXISTS lighting_specs JSONB; -- lighting grid details
ALTER TABLE venues ADD COLUMN IF NOT EXISTS stage_dimensions JSONB; -- width, depth, height
ALTER TABLE venues ADD COLUMN IF NOT EXISTS load_in_specs JSONB; -- dock doors, restrictions
ALTER TABLE venues ADD COLUMN IF NOT EXISTS parking_info JSONB; -- artist, crew, patron parking
ALTER TABLE venues ADD COLUMN IF NOT EXISTS dressing_rooms JSONB; -- count, amenities, size
ALTER TABLE venues ADD COLUMN IF NOT EXISTS catering_facilities JSONB; -- kitchen, restrictions
ALTER TABLE venues ADD COLUMN IF NOT EXISTS age_restrictions VARCHAR(50);
ALTER TABLE venues ADD COLUMN IF NOT EXISTS curfew_time TIME;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS noise_restrictions TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS security_level VARCHAR(50); -- 'basic', 'enhanced', 'high'
ALTER TABLE venues ADD COLUMN IF NOT EXISTS historical_attendance JSONB; -- genre-based averages
ALTER TABLE venues ADD COLUMN IF NOT EXISTS preferred_genres TEXT[];
ALTER TABLE venues ADD COLUMN IF NOT EXISTS venue_rating DECIMAL(3,2); -- internal rating 1-5
ALTER TABLE venues ADD COLUMN IF NOT EXISTS payment_reliability VARCHAR(50); -- 'excellent', 'good', 'fair', 'poor'
ALTER TABLE venues ADD COLUMN IF NOT EXISTS last_collaboration DATE;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS collaboration_notes TEXT;

-- Venue contacts (multiple contacts per venue)
CREATE TABLE venue_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- 'booking', 'production', 'accounting', 'marketing'
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    is_primary BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking inquiries and holds
CREATE TABLE booking_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id),
    inquirer_type VARCHAR(50) NOT NULL, -- 'agent', 'promoter', 'venue', 'festival'
    inquirer_name VARCHAR(255),
    inquirer_email VARCHAR(255),
    inquirer_phone VARCHAR(20),
    preferred_dates DATE[], -- multiple preferred dates
    event_type VARCHAR(100), -- 'concert', 'festival', 'private_event', 'corporate'
    expected_capacity INTEGER,
    budget_range_min DECIMAL(10,2),
    budget_range_max DECIMAL(10,2),
    special_requirements TEXT,
    status VARCHAR(50) DEFAULT 'received', -- 'received', 'reviewing', 'hold_offered', 'declined', 'converted'
    priority_level VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    response_deadline TIMESTAMP,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Holds management (temporary reservations)
CREATE TABLE booking_holds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID REFERENCES booking_inquiries(id),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id),
    hold_date DATE NOT NULL,
    hold_type VARCHAR(50) DEFAULT 'soft', -- 'soft', 'hard', 'first_right_of_refusal'
    expires_at TIMESTAMP NOT NULL,
    guaranteed_fee DECIMAL(10,2),
    percentage_deal DECIMAL(5,2), -- percentage of door/bar
    plus_deal_threshold DECIMAL(10,2), -- break-even point for plus deals
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'confirmed', 'expired', 'cancelled', 'lost'
    confirmation_deadline TIMESTAMP,
    competing_holds INTEGER DEFAULT 0, -- number of competing holds
    priority_rank INTEGER,
    hold_notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced tour dates (upgrade existing)
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS inquiry_id UUID REFERENCES booking_inquiries(id);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS hold_id UUID REFERENCES booking_holds(id);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS contract_id UUID REFERENCES booking_contracts(id);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS deal_type VARCHAR(50); -- 'guarantee', 'door_deal', 'plus_deal', 'festival_fee'
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS guarantee_amount DECIMAL(10,2);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS door_percentage DECIMAL(5,2);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS bar_percentage DECIMAL(5,2);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS merchandise_percentage DECIMAL(5,2);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS ticket_price_tier JSONB; -- multiple price levels
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS expected_attendance INTEGER;
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS radius_clause_km INTEGER; -- exclusivity radius
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS radius_clause_days INTEGER; -- exclusivity period
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS settlement_amount DECIMAL(10,2);
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS settlement_notes TEXT;

-- Booking contracts
CREATE TABLE booking_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hold_id UUID REFERENCES booking_holds(id),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id),
    tour_date_id UUID REFERENCES tour_dates(id),
    contract_number VARCHAR(100) UNIQUE,
    contract_type VARCHAR(50), -- 'performance', 'festival', 'residency', 'corporate'
    template_used VARCHAR(100),

    -- Performance details
    performance_date DATE NOT NULL,
    load_in_time TIME,
    sound_check_time TIME,
    doors_time TIME,
    show_time TIME,
    curfew_time TIME,

    -- Financial terms
    deal_structure VARCHAR(50), -- 'guarantee', 'door_deal', 'plus_deal', 'festival_fee'
    guarantee_amount DECIMAL(10,2),
    door_split_percentage DECIMAL(5,2),
    bar_split_percentage DECIMAL(5,2),
    merchandise_split_percentage DECIMAL(5,2),
    plus_deal_threshold DECIMAL(10,2),
    deposit_percentage DECIMAL(5,2) DEFAULT 50,
    deposit_amount DECIMAL(10,2),
    deposit_due_date DATE,
    final_payment_terms VARCHAR(200), -- '7 days post-show', 'day of show', etc.

    -- Technical requirements
    technical_rider_url TEXT,
    hospitality_rider_url TEXT,
    special_requirements TEXT,
    backline_provided BOOLEAN DEFAULT FALSE,
    sound_engineer_provided BOOLEAN DEFAULT FALSE,
    lighting_engineer_provided BOOLEAN DEFAULT FALSE,

    -- Legal terms
    cancellation_policy TEXT,
    weather_policy TEXT,
    force_majeure_clause TEXT,
    radius_clause TEXT,
    recording_restrictions TEXT,

    -- Contract status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'under_review', 'signed', 'executed', 'cancelled'
    sent_date DATE,
    signed_date DATE,
    venue_signature_url TEXT,
    artist_signature_url TEXT,
    fully_executed_date DATE,

    -- Files and documents
    contract_file_url TEXT,
    rider_files JSONB, -- array of file URLs

    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contract amendments and modifications
CREATE TABLE contract_modifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES booking_contracts(id) ON DELETE CASCADE,
    modification_type VARCHAR(100), -- 'time_change', 'financial_adjustment', 'technical_change'
    description TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    requested_by VARCHAR(50), -- 'artist', 'venue', 'agent', 'promoter'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES users(id),
    approved_date TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Technical riders management
CREATE TABLE technical_riders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    rider_name VARCHAR(200) NOT NULL,
    rider_type VARCHAR(50), -- 'technical', 'hospitality', 'security', 'transport'
    version VARCHAR(20) DEFAULT '1.0',

    -- Technical specifications
    stage_plot_url TEXT,
    input_list_url TEXT,
    lighting_plot_url TEXT,

    -- Audio requirements
    monitor_mix_count INTEGER,
    front_of_house_requirements JSONB,
    monitor_requirements JSONB,
    microphone_requirements JSONB,
    di_box_requirements JSONB,

    -- Backline requirements
    drum_kit_specs JSONB,
    guitar_amps_specs JSONB,
    bass_amps_specs JSONB,
    keyboard_specs JSONB,

    -- Lighting requirements
    lighting_design_complexity VARCHAR(50), -- 'basic', 'standard', 'advanced', 'custom'
    lighting_requirements JSONB,

    -- Power and rigging
    power_requirements JSONB,
    rigging_requirements JSONB,

    -- Crew requirements
    crew_count INTEGER,
    crew_skills_required TEXT[],

    -- Hospitality
    dressing_room_requirements JSONB,
    catering_requirements JSONB,
    transportation_requirements JSONB,

    -- Security
    security_requirements JSONB,

    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tour routing and logistics
CREATE TABLE tour_routing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    routing_name VARCHAR(200),
    routing_version VARCHAR(20) DEFAULT '1.0',

    -- Route optimization
    start_location VARCHAR(200),
    end_location VARCHAR(200),
    total_distance_km INTEGER,
    total_drive_time_hours INTEGER,
    optimization_criteria VARCHAR(50), -- 'distance', 'cost', 'time', 'carbon_footprint'

    -- Logistics planning
    transportation_method VARCHAR(50), -- 'bus', 'van', 'truck', 'fly', 'mixed'
    crew_size INTEGER,
    equipment_truck_count INTEGER,

    -- Routing constraints
    max_drive_hours_per_day INTEGER DEFAULT 8,
    required_buffer_days INTEGER DEFAULT 1,
    avoid_regions TEXT[],
    preferred_routes TEXT[],

    -- Costs estimation
    fuel_budget DECIMAL(10,2),
    accommodation_budget DECIMAL(10,2),
    per_diem_budget DECIMAL(10,2),
    total_logistics_budget DECIMAL(10,2),

    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'optimized', 'approved', 'active'
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settlement tracking
CREATE TABLE show_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_date_id UUID NOT NULL REFERENCES tour_dates(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES booking_contracts(id),
    settlement_date DATE DEFAULT CURRENT_DATE,

    -- Attendance figures
    tickets_sold INTEGER,
    actual_attendance INTEGER,
    comp_tickets INTEGER,
    no_shows INTEGER,
    capacity_percentage DECIMAL(5,2),

    -- Revenue breakdown
    gross_ticket_sales DECIMAL(10,2),
    taxes DECIMAL(10,2),
    facility_fees DECIMAL(10,2),
    service_charges DECIMAL(10,2),
    net_ticket_sales DECIMAL(10,2),

    -- Additional revenue
    bar_sales DECIMAL(10,2),
    merchandise_sales DECIMAL(10,2),
    vip_package_sales DECIMAL(10,2),
    parking_revenue DECIMAL(10,2),
    other_revenue DECIMAL(10,2),

    -- Expense deductions
    production_costs DECIMAL(10,2),
    marketing_costs DECIMAL(10,2),
    security_costs DECIMAL(10,2),
    catering_costs DECIMAL(10,2),
    other_expenses DECIMAL(10,2),

    -- Final calculations
    artist_guarantee DECIMAL(10,2),
    door_split_artist DECIMAL(10,2),
    bar_split_artist DECIMAL(10,2),
    merchandise_split_artist DECIMAL(10,2),
    total_artist_payment DECIMAL(10,2),
    payment_method VARCHAR(50), -- 'cash', 'check', 'wire', 'ach'
    payment_reference VARCHAR(200),

    -- Settlement status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'calculated', 'approved', 'paid'
    settlement_file_url TEXT,
    notes TEXT,

    settled_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking pipeline analytics
CREATE TABLE booking_pipeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Pipeline metrics
    inquiries_received INTEGER DEFAULT 0,
    holds_offered INTEGER DEFAULT 0,
    holds_confirmed INTEGER DEFAULT 0,
    contracts_sent INTEGER DEFAULT 0,
    contracts_signed INTEGER DEFAULT 0,
    shows_performed INTEGER DEFAULT 0,
    shows_cancelled INTEGER DEFAULT 0,

    -- Conversion rates
    inquiry_to_hold_rate DECIMAL(5,2),
    hold_to_contract_rate DECIMAL(5,2),
    contract_to_show_rate DECIMAL(5,2),

    -- Financial metrics
    total_gross_revenue DECIMAL(12,2),
    total_net_revenue DECIMAL(12,2),
    average_guarantee DECIMAL(10,2),
    average_attendance INTEGER,

    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enums for booking module
CREATE TYPE hold_type_enum AS ENUM ('soft', 'hard', 'first_right_of_refusal', 'penciled');
CREATE TYPE deal_structure_enum AS ENUM ('guarantee', 'door_deal', 'plus_deal', 'festival_fee', 'revenue_share');
CREATE TYPE contract_status_enum AS ENUM ('draft', 'sent', 'under_review', 'negotiating', 'signed', 'executed', 'cancelled');
CREATE TYPE settlement_status_enum AS ENUM ('pending', 'calculated', 'under_review', 'approved', 'paid', 'disputed');

-- Indexes for booking module performance
CREATE INDEX idx_venue_contacts_venue_type ON venue_contacts(venue_id, contact_type);
CREATE INDEX idx_booking_inquiries_artist_status ON booking_inquiries(artist_id, status);
CREATE INDEX idx_booking_inquiries_dates ON booking_inquiries USING GIN(preferred_dates);
CREATE INDEX idx_booking_holds_artist_date ON booking_holds(artist_id, hold_date);
CREATE INDEX idx_booking_holds_venue_date ON booking_holds(venue_id, hold_date);
CREATE INDEX idx_booking_holds_expires ON booking_holds(expires_at);
CREATE INDEX idx_booking_contracts_artist_date ON booking_contracts(artist_id, performance_date);
CREATE INDEX idx_booking_contracts_status ON booking_contracts(status);
CREATE INDEX idx_technical_riders_artist_active ON technical_riders(artist_id, is_active);
CREATE INDEX idx_show_settlements_tour_date ON show_settlements(tour_date_id);
CREATE INDEX idx_show_settlements_status ON show_settlements(status);
CREATE INDEX idx_tour_routing_tour ON tour_routing(tour_id);

-- Triggers for booking module
CREATE TRIGGER update_venue_contacts_updated_at BEFORE UPDATE ON venue_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_inquiries_updated_at BEFORE UPDATE ON booking_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_holds_updated_at BEFORE UPDATE ON booking_holds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_contracts_updated_at BEFORE UPDATE ON booking_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technical_riders_updated_at BEFORE UPDATE ON technical_riders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_routing_updated_at BEFORE UPDATE ON tour_routing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_show_settlements_updated_at BEFORE UPDATE ON show_settlements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🚀 API Endpoints Booking

```typescript
// ===== VENUE MANAGEMENT =====
GET    /api/venues                              // Search venues with filters
POST   /api/venues                              // Create venue
PUT    /api/venues/:venueId                     // Update venue
GET    /api/venues/:venueId                     // Venue details
DELETE /api/venues/:venueId                     // Delete venue
GET    /api/venues/:venueId/contacts            // Venue contacts
POST   /api/venues/:venueId/contacts            // Add venue contact
GET    /api/venues/search                       // Advanced venue search
GET    /api/venues/nearby                       // Geo-based venue search

// ===== BOOKING WORKFLOW =====
GET    /api/artists/:artistId/inquiries         // List inquiries
POST   /api/artists/:artistId/inquiries         // Create inquiry
PUT    /api/inquiries/:inquiryId                // Update inquiry
DELETE /api/inquiries/:inquiryId                // Delete inquiry
POST   /api/inquiries/:inquiryId/convert-hold   // Convert to hold

GET    /api/artists/:artistId/holds             // List holds
POST   /api/artists/:artistId/holds             // Create hold
PUT    /api/holds/:holdId                       // Update hold
DELETE /api/holds/:holdId                       // Cancel hold
POST   /api/holds/:holdId/confirm               // Confirm hold
POST   /api/holds/:holdId/extend                // Extend hold deadline

// ===== CONTRACTS =====
GET    /api/artists/:artistId/contracts         // List contracts
POST   /api/contracts                           // Create contract
PUT    /api/contracts/:contractId               // Update contract
GET    /api/contracts/:contractId               // Contract details
DELETE /api/contracts/:contractId               // Delete contract
POST   /api/contracts/:contractId/send          // Send for signature
POST   /api/contracts/:contractId/sign          // Record signature
GET    /api/contracts/:contractId/modifications // Contract modifications
POST   /api/contracts/:contractId/modify        // Request modification

// ===== TECHNICAL RIDERS =====
GET    /api/artists/:artistId/riders            // List riders
POST   /api/artists/:artistId/riders            // Create rider
PUT    /api/riders/:riderId                     // Update rider
DELETE /api/riders/:riderId                     // Delete rider
POST   /api/riders/:riderId/duplicate           // Duplicate rider
GET    /api/riders/templates                    // Rider templates

// ===== TOUR ROUTING =====
GET    /api/tours/:tourId/routing               // Tour routing options
POST   /api/tours/:tourId/routing               // Create routing
PUT    /api/routing/:routingId                  // Update routing
POST   /api/routing/:routingId/optimize         // AI optimization
GET    /api/routing/:routingId/costs            // Cost estimation
GET    /api/routing/:routingId/logistics        // Logistics details

// ===== SETTLEMENTS =====
GET    /api/tour-dates/:dateId/settlement       // Settlement details
POST   /api/tour-dates/:dateId/settlement       // Create settlement
PUT    /api/settlements/:settlementId           // Update settlement
POST   /api/settlements/:settlementId/approve   // Approve settlement
POST   /api/settlements/:settlementId/pay       // Mark as paid
GET    /api/settlements/:settlementId/export    // Export settlement

// ===== ANALYTICS =====
GET    /api/artists/:artistId/booking-pipeline  // Pipeline analytics
GET    /api/artists/:artistId/booking-performance // Performance metrics
GET    /api/artists/:artistId/venue-history     // Venue collaboration history
GET    /api/venues/:venueId/artist-history      // Artist booking history
GET    /api/booking/market-rates                // Market rate analysis
```

## 🖥️ Interface Utilisateur Booking

### Dashboard Tour Manager
```typescript
const BookingDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <BookingCalendar />
        <ActiveHolds />
        <PendingContracts />
      </div>
      <div>
        <BookingPipeline />
        <UpcomingDeadlines />
        <RevenueTracking />
      </div>
    </div>
  );
};

// Composants spécialisés
const VenueDatabase: React.FC = () => {
  // Base de données venues avec filtres avancés
  // Géolocalisation, capacité, équipement
  // Ratings et historique collaborations
};

const HoldManager: React.FC = () => {
  // Gestion des holds avec timeline
  // Alertes expiration, conflits
  // Priorisation automatique
};

const ContractWorkflow: React.FC = () => {
  // Workflow complet contrats
  // Templates, négociation, signatures
  // Tracking modifications et versions
};

const RoutingOptimizer: React.FC = () => {
  // Optimisation tournées
  // Visualisation géographique
  // Calculs coûts et logistique
};

const SettlementCenter: React.FC = () => {
  // Centre de règlements
  // Calculs automatiques, approbations
  // Export comptable et reporting
};
```

## 📊 Analytics & KPIs Booking

### Métriques Clés
- **Conversion Pipeline** : Inquiry → Hold → Contract → Show
- **Taux de confirmation** holds par venue/région
- **Performance financière** par marché
- **Délais moyens** signature contrats
- **Satisfaction venues** (ratings, répétitions)

### Tableaux de Bord
- **Vue Artiste** : Pipeline global, revenus, performances
- **Vue Tour Manager** : Agenda, deadlines, règlements
- **Vue Business** : ROI tournées, marché trends

## 🔧 Intégrations Techniques

### Services Externes
- **Calendriers** : Google, Outlook, Apple Calendar
- **Signatures** : DocuSign, HelloSign, Adobe Sign
- **Géolocalisation** : Google Maps, MapBox
- **Paiements** : Stripe, PayPal, Banking APIs
- **Comptabilité** : QuickBooks, Xero, SAP

### Automatisations
- **Alertes deadlines** holds et paiements
- **Optimisation routing** IA
- **Génération contrats** templates intelligents
- **Calculs settlements** automatiques
- **Reporting** périodique automatisé

Cette architecture reproduit les fonctionnalités essentielles de Bob Booking tout en s'intégrant parfaitement dans l'écosystème ArtistHub CRM.