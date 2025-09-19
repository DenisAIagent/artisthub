# 📁 Système de Gestion Documentaire - Architecture

## Vue d'ensemble

Espace ressources centralisé pour chaque métier permettant l'upload, l'organisation et le partage de documents importants par artiste et par catégorie professionnelle.

## 🎯 Fonctionnalités Clés

### Gestion Documents par Métier
- **Upload sécurisé** avec validation types/tailles
- **Catégorisation automatique** selon le métier
- **Versioning** avec historique des modifications
- **Permissions granulaires** par rôle et artiste
- **Recherche avancée** multi-critères

### Organisation Hiérarchique
- **Dossiers par artiste** et sous-dossiers par métier
- **Tags personnalisables** et labels
- **Statuts documents** (Draft, Review, Approved, Archived)
- **Templates prédéfinis** par type de métier
- **Favoris** et accès rapide

### Collaboration
- **Partage sélectif** entre métiers
- **Commentaires** et annotations
- **Notifications** de nouveaux documents
- **Workflows d'approbation**
- **Audit trail** complet

## 🏗️ Architecture Base de Données

```sql
-- ============================================
-- DOCUMENT MANAGEMENT SYSTEM
-- ============================================

-- Document categories by profession
CREATE TYPE document_category_enum AS ENUM (
    -- Marketing
    'marketing_brief', 'campaign_assets', 'press_kit', 'social_media_assets',
    'brand_guidelines', 'audience_reports', 'influencer_contracts',

    -- Booking/Tour
    'technical_rider', 'hospitality_rider', 'venue_contracts', 'routing_plans',
    'insurance_docs', 'travel_docs', 'crew_contracts', 'settlement_reports',

    -- Production/Album
    'recording_contracts', 'master_recordings', 'stems_files', 'artwork',
    'liner_notes', 'publishing_splits', 'production_schedules', 'mixing_notes',

    -- Financial
    'invoices', 'receipts', 'royalty_statements', 'tax_documents',
    'budgets', 'financial_reports', 'banking_docs', 'insurance_policies',

    -- Press
    'press_releases', 'interview_transcripts', 'media_coverage', 'photos_hq',
    'bio_sheets', 'press_contacts', 'media_guidelines', 'crisis_protocols',

    -- Legal/General
    'contracts', 'agreements', 'licenses', 'certifications',
    'legal_docs', 'correspondence', 'meeting_notes', 'other'
);

-- Document status workflow
CREATE TYPE document_status_enum AS ENUM (
    'draft', 'pending_review', 'under_review', 'approved',
    'needs_revision', 'archived', 'expired'
);

-- Access levels for documents
CREATE TYPE access_level_enum AS ENUM (
    'private', 'team_only', 'artist_team', 'artist_only', 'public_team'
);

-- Main documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,

    -- File information
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL, -- S3/storage path
    file_size BIGINT NOT NULL, -- in bytes
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64), -- for duplicate detection

    -- Document metadata
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category document_category_enum NOT NULL,
    profession_scope user_role NOT NULL, -- which profession "owns" this doc
    tags TEXT[], -- custom tags for search

    -- Status and workflow
    status document_status_enum DEFAULT 'draft',
    access_level access_level_enum DEFAULT 'team_only',
    is_template BOOLEAN DEFAULT FALSE,
    is_sensitive BOOLEAN DEFAULT FALSE, -- requires special permissions

    -- Versioning
    version_number INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id), -- for versions
    is_latest_version BOOLEAN DEFAULT TRUE,

    -- Timestamps and ownership
    uploaded_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    expires_at TIMESTAMP, -- for time-sensitive docs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Search optimization
    search_vector tsvector -- for full-text search
);

-- Document folders/organization
CREATE TABLE document_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_folder_id UUID REFERENCES document_folders(id),
    profession_scope user_role NOT NULL,
    color VARCHAR(7), -- hex color for UI
    icon VARCHAR(50), -- icon identifier
    sort_order INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document-folder relationship
CREATE TABLE document_folder_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    folder_id UUID NOT NULL REFERENCES document_folders(id) ON DELETE CASCADE,
    added_by UUID NOT NULL REFERENCES users(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, folder_id)
);

-- Document permissions (who can access what)
CREATE TABLE document_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), -- specific user
    role user_role, -- or entire role
    artist_id UUID REFERENCES artists(id), -- scope to specific artist team
    permission_type VARCHAR(50) NOT NULL, -- 'view', 'edit', 'delete', 'share'
    granted_by UUID NOT NULL REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    CONSTRAINT check_user_or_role CHECK (user_id IS NOT NULL OR role IS NOT NULL)
);

-- Document sharing (temporary/external links)
CREATE TABLE document_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    share_token VARCHAR(64) UNIQUE NOT NULL, -- secure token for access
    share_type VARCHAR(50) DEFAULT 'link', -- 'link', 'email', 'temporary'
    password_hash VARCHAR(255), -- optional password protection
    view_count INTEGER DEFAULT 0,
    max_views INTEGER, -- limit views
    recipient_email VARCHAR(255), -- if shared via email
    message TEXT, -- optional message with share
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_accessed TIMESTAMP
);

-- Document comments/annotations
CREATE TABLE document_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    annotation_data JSONB, -- for PDF annotations, timestamps, etc.
    parent_comment_id UUID REFERENCES document_comments(id), -- for replies
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document activity log
CREATE TABLE document_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    activity_type VARCHAR(50) NOT NULL, -- 'uploaded', 'viewed', 'downloaded', 'edited', 'shared', 'commented'
    details JSONB, -- additional activity data
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document templates by profession
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category document_category_enum NOT NULL,
    profession_scope user_role NOT NULL,
    template_file_path TEXT, -- S3 path to template
    variables JSONB, -- placeholder variables for customization
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document favorites (per user)
CREATE TABLE document_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, user_id)
);

-- Document workflow approvals
CREATE TABLE document_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'rejected'
    comments TEXT,
    required_role user_role, -- which role approval is needed from
    order_sequence INTEGER DEFAULT 1, -- for multi-step approvals
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP
);

-- Storage usage tracking
CREATE TABLE storage_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id),
    profession user_role NOT NULL,
    month_year DATE NOT NULL, -- first day of month
    total_files INTEGER DEFAULT 0,
    total_size_bytes BIGINT DEFAULT 0,
    uploads_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(artist_id, profession, month_year)
);

-- Indexes for performance
CREATE INDEX idx_documents_artist_profession ON documents(artist_id, profession_scope);
CREATE INDEX idx_documents_category_status ON documents(category, status);
CREATE INDEX idx_documents_search ON documents USING GIN(search_vector);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_document_folders_artist_profession ON document_folders(artist_id, profession_scope);
CREATE INDEX idx_document_permissions_user ON document_permissions(user_id);
CREATE INDEX idx_document_permissions_role ON document_permissions(role, artist_id);
CREATE INDEX idx_document_shares_token ON document_shares(share_token);
CREATE INDEX idx_document_activities_document_date ON document_activities(document_id, created_at DESC);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION update_document_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('french',
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.original_filename, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_search_vector_update
    BEFORE INSERT OR UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_document_search_vector();

-- Triggers for updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_folders_updated_at BEFORE UPDATE ON document_folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_comments_updated_at BEFORE UPDATE ON document_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🚀 API Endpoints Documents

```typescript
// ===== DOCUMENT MANAGEMENT =====
GET    /api/artists/:artistId/documents                    // List documents with filters
POST   /api/artists/:artistId/documents                    // Upload document
GET    /api/artists/:artistId/documents/:docId             // Get document details
PUT    /api/artists/:artistId/documents/:docId             // Update document metadata
DELETE /api/artists/:artistId/documents/:docId             // Delete document
GET    /api/documents/:docId/download                      // Download document
POST   /api/documents/:docId/duplicate                     // Duplicate document

// ===== FOLDERS =====
GET    /api/artists/:artistId/folders                      // List folders by profession
POST   /api/artists/:artistId/folders                      // Create folder
PUT    /api/folders/:folderId                              // Update folder
DELETE /api/folders/:folderId                              // Delete folder
POST   /api/folders/:folderId/documents                    // Add document to folder
DELETE /api/folders/:folderId/documents/:docId             // Remove from folder

// ===== SEARCH & FILTERS =====
GET    /api/artists/:artistId/documents/search             // Advanced search
GET    /api/artists/:artistId/documents/categories         // List categories by profession
GET    /api/artists/:artistId/documents/tags               // Get available tags
GET    /api/artists/:artistId/documents/recent             // Recently accessed docs

// ===== SHARING =====
POST   /api/documents/:docId/share                         // Create sharing link
GET    /api/documents/:docId/shares                        // List active shares
DELETE /api/shares/:shareId                                // Revoke share
GET    /api/share/:token                                   // Access shared document

// ===== PERMISSIONS =====
GET    /api/documents/:docId/permissions                   // List permissions
POST   /api/documents/:docId/permissions                   // Grant permission
PUT    /api/permissions/:permissionId                      // Update permission
DELETE /api/permissions/:permissionId                      // Revoke permission

// ===== COLLABORATION =====
GET    /api/documents/:docId/comments                      // List comments
POST   /api/documents/:docId/comments                      // Add comment
PUT    /api/comments/:commentId                            // Update comment
DELETE /api/comments/:commentId                            // Delete comment
POST   /api/documents/:docId/approve                       // Approve document
POST   /api/documents/:docId/reject                        // Reject document

// ===== TEMPLATES =====
GET    /api/templates/documents                            // List templates by profession
POST   /api/templates/documents                            // Create template
POST   /api/templates/:templateId/use                      // Create document from template

// ===== ANALYTICS =====
GET    /api/artists/:artistId/documents/analytics          // Storage & usage analytics
GET    /api/artists/:artistId/documents/activity           // Activity timeline
GET    /api/documents/:docId/analytics                     // Document-specific analytics
```

## 🖥️ Interface Utilisateur

### Document Manager Component
```typescript
const DocumentManager: React.FC<{artistId: string, profession: string}> = ({artistId, profession}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Folders & Filters */}
      <div className="lg:col-span-1">
        <DocumentSidebar profession={profession} />
        <DocumentFilters />
        <QuickActions profession={profession} />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <DocumentToolbar />
        <DocumentGrid documents={documents} />
        <DocumentList documents={documents} />
      </div>
    </div>
  );
};

// Upload Component with drag & drop
const DocumentUpload: React.FC = () => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Glissez vos fichiers ici
        </h3>
        <p className="text-gray-600 mb-4">
          ou cliquez pour sélectionner
        </p>
        <FileSelector
          accept={getAcceptedTypes(profession)}
          maxSize={getMaxSize(profession)}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
};
```

### Catégories par Métier

#### Marketing
- **Briefs créatifs** : Concepts campagnes, guidelines
- **Assets visuels** : Logos, photos, vidéos
- **Rapports audience** : Analytics, demographics
- **Contrats influenceurs** : Collaborations, partenariats

#### Booking/Tournée
- **Riders techniques** : Audio, lighting, backline
- **Contrats venues** : Accords, amendements
- **Plans logistiques** : Routing, transport, hébergement
- **Documents voyage** : Visas, assurances, carnet ATA

#### Production/Album
- **Contrats studio** : Enregistrement, mixing, mastering
- **Masters & stems** : Fichiers audio haute qualité
- **Artwork & packaging** : Covers, booklets, designs
- **Splits publishing** : Droits compositeurs, éditeurs

#### Finance
- **Factures & reçus** : Dépenses, remboursements
- **Relevés royalties** : SACEM, streaming, ventes
- **Documents fiscaux** : Déclarations, TVA
- **Budgets projets** : Prévisionnel, suivi

#### Presse
- **Communiqués** : Annonces, actualités
- **Photos HD** : Portraits, concerts, events
- **Dossiers presse** : Bio, discographie, awards
- **Contacts médias** : Journalistes, blogueurs

## 🔐 Sécurité & Conformité

### Contrôle d'Accès
- **Permissions granulaires** par document et utilisateur
- **Chiffrement** files at rest et in transit
- **Audit trail** complet des accès
- **Expiration** automatique des partages

### Conformité RGPD
- **Consentement** explicite pour partages externes
- **Droit à l'oubli** avec suppression cascade
- **Portabilité** export complet données
- **DPO notifications** pour documents sensibles

### Backup & Récupération
- **Versioning** automatique avec retention
- **Backup géographique** multi-zones
- **Recovery** point-in-time
- **Archivage** intelligent par âge

## 📊 Analytics & Reporting

### Métriques par Métier
- **Usage stockage** par profession
- **Documents populaires** les plus consultés
- **Collaboration stats** partages, commentaires
- **Compliance** documents expirés, approbations

### Tableaux de Bord
- **Vue Manager** : Utilisation équipe, quotas
- **Vue Métier** : Documents récents, favoris
- **Vue Admin** : Stockage global, sécurité

## 🚀 Roadmap Implementation

### Phase 1 (2 semaines)
- ✅ Schema base de données complet
- 📁 Upload/download basique par métier
- 🗂️ Organisation dossiers
- 🔍 Recherche simple

### Phase 2 (2 semaines)
- 🔐 Système permissions avancé
- 🔗 Partage sécurisé externe
- 💬 Commentaires et collaboration
- 📊 Analytics basiques

### Phase 3 (2 semaines)
- 🤖 Templates intelligents
- 🔄 Workflows approbation
- 📈 Analytics avancées
- 🔔 Notifications en temps réel

Cette architecture garantit un système de gestion documentaire professionnel, sécurisé et parfaitement intégré au workflow de chaque métier musical.