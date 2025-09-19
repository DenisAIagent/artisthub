# 📧 Service de Mailing Intégré - Architecture

## Vue d'ensemble

Service de mailing professionnel intégré au CRM ArtistHub permettant à chaque métier d'importer ses contacts, envoyer des emails et suivre les interactions directement dans le CRM.

## 🎯 Fonctionnalités Clés

### Import de Contacts
- **Import CSV/Excel** par métier
- **Synchronisation** avec outils externes (Gmail, Outlook, MailChimp)
- **Déduplication automatique**
- **Validation des emails**
- **Segmentation par rôle métier**

### Gestion des Emails
- **Envoi individuel et en masse**
- **Templates personnalisables** par métier
- **Programmation d'envoi**
- **A/B Testing**
- **Signatures automatiques**

### Suivi et Analytics
- **Tracking d'ouverture et clics**
- **Réponses automatiquement intégrées**
- **Historique complet par contact**
- **Rapports par métier et artiste**
- **Scoring d'engagement**

## 🏗️ Architecture Technique

### Base de Données - Extension

```sql
-- Table des contacts email par métier
CREATE TABLE email_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artists(id),
    contact_role contact_role_enum NOT NULL, -- marketing, press, tour, etc.
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(200),
    position VARCHAR(200),
    phone VARCHAR(50),
    tags TEXT[], -- segmentation
    status contact_status_enum DEFAULT 'active', -- active, unsubscribed, bounced
    source VARCHAR(100), -- imported, manual, api
    metadata JSONB, -- données spécifiques au métier
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des campagnes email
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artists(id),
    name VARCHAR(200) NOT NULL,
    subject VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    template_id UUID REFERENCES email_templates(id),
    contact_role contact_role_enum NOT NULL,
    status campaign_status_enum DEFAULT 'draft', -- draft, scheduled, sending, sent, completed
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    recipient_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    bounce_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    unsubscribe_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des templates email par métier
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    contact_role contact_role_enum NOT NULL,
    subject_template VARCHAR(300),
    content_template TEXT NOT NULL,
    variables JSONB, -- variables disponibles
    is_default BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des envois individuels
CREATE TABLE email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id),
    contact_id UUID NOT NULL REFERENCES email_contacts(id),
    email VARCHAR(255) NOT NULL,
    status send_status_enum DEFAULT 'pending', -- pending, sent, delivered, bounced, opened, clicked
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    bounce_reason TEXT,
    tracking_id VARCHAR(100) UNIQUE,
    metadata JSONB
);

-- Table des réponses email
CREATE TABLE email_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_send_id UUID REFERENCES email_sends(id),
    contact_id UUID NOT NULL REFERENCES email_contacts(id),
    artist_id UUID NOT NULL REFERENCES artists(id),
    subject VARCHAR(300),
    content TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    assigned_to UUID REFERENCES users(id),
    metadata JSONB
);

-- Table des interactions email
CREATE TABLE email_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES email_contacts(id),
    artist_id UUID NOT NULL REFERENCES artists(id),
    interaction_type interaction_type_enum NOT NULL, -- email_sent, email_opened, email_clicked, reply_received
    campaign_id UUID REFERENCES email_campaigns(id),
    send_id UUID REFERENCES email_sends(id),
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enums
CREATE TYPE contact_status_enum AS ENUM ('active', 'unsubscribed', 'bounced', 'invalid');
CREATE TYPE campaign_status_enum AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'completed', 'paused', 'cancelled');
CREATE TYPE send_status_enum AS ENUM ('pending', 'sent', 'delivered', 'bounced', 'opened', 'clicked', 'replied', 'unsubscribed');
CREATE TYPE interaction_type_enum AS ENUM ('email_sent', 'email_opened', 'email_clicked', 'reply_received', 'unsubscribed', 'bounced');

-- Index pour performance
CREATE INDEX idx_email_contacts_artist_role ON email_contacts(artist_id, contact_role);
CREATE INDEX idx_email_contacts_email ON email_contacts(email);
CREATE INDEX idx_email_sends_tracking ON email_sends(tracking_id);
CREATE INDEX idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX idx_email_interactions_contact ON email_interactions(contact_id);
```

### API Endpoints

```typescript
// Gestion des contacts
GET    /api/artists/:artistId/contacts                  // Liste contacts par métier
POST   /api/artists/:artistId/contacts                  // Créer contact
PUT    /api/artists/:artistId/contacts/:contactId       // Modifier contact
DELETE /api/artists/:artistId/contacts/:contactId       // Supprimer contact
POST   /api/artists/:artistId/contacts/import           // Import CSV/Excel
POST   /api/artists/:artistId/contacts/sync/:provider   // Sync Gmail/Outlook

// Gestion des campagnes
GET    /api/artists/:artistId/campaigns                 // Liste campagnes
POST   /api/artists/:artistId/campaigns                 // Créer campagne
PUT    /api/artists/:artistId/campaigns/:campaignId     // Modifier campagne
DELETE /api/artists/:artistId/campaigns/:campaignId     // Supprimer campagne
POST   /api/artists/:artistId/campaigns/:campaignId/send // Envoyer campagne
POST   /api/artists/:artistId/campaigns/:campaignId/schedule // Programmer envoi
GET    /api/artists/:artistId/campaigns/:campaignId/analytics // Analytics campagne

// Templates
GET    /api/templates/email                             // Templates par rôle
POST   /api/templates/email                             // Créer template
PUT    /api/templates/email/:templateId                 // Modifier template
DELETE /api/templates/email/:templateId                 // Supprimer template

// Tracking et réponses
POST   /api/email/track/open/:trackingId                // Tracking ouverture
POST   /api/email/track/click/:trackingId               // Tracking clic
POST   /api/email/unsubscribe/:trackingId               // Désabonnement
GET    /api/artists/:artistId/email/replies             // Réponses reçues
PUT    /api/artists/:artistId/email/replies/:replyId    // Marquer réponse traitée

// Analytics
GET    /api/artists/:artistId/email/analytics           // Analytics global
GET    /api/artists/:artistId/email/analytics/:role     // Analytics par métier
```

## 🔧 Intégrations Techniques

### Providers Email
```typescript
// Configuration multi-provider
interface EmailProvider {
  name: 'sendgrid' | 'mailgun' | 'ses' | 'postmark';
  apiKey: string;
  domain: string;
  webhookUrl: string;
}

// Service d'envoi unifié
class EmailService {
  async sendEmail(params: SendEmailParams): Promise<SendResult>
  async sendBulk(params: BulkEmailParams): Promise<BulkResult>
  async trackDelivery(trackingId: string): Promise<DeliveryStatus>
  async handleWebhook(provider: string, payload: any): Promise<void>
}
```

### Import de Contacts
```typescript
// Service d'import
class ContactImportService {
  async importCSV(file: File, artistId: string, role: ContactRole): Promise<ImportResult>
  async syncGmail(accessToken: string, artistId: string): Promise<SyncResult>
  async syncOutlook(accessToken: string, artistId: string): Promise<SyncResult>
  async deduplicateContacts(contacts: Contact[]): Promise<Contact[]>
  async validateEmails(emails: string[]): Promise<ValidationResult[]>
}
```

### Analytics et Reporting
```typescript
// Service d'analytics
class EmailAnalyticsService {
  async getCampaignStats(campaignId: string): Promise<CampaignStats>
  async getContactEngagement(contactId: string): Promise<EngagementScore>
  async getRolePerformance(artistId: string, role: ContactRole): Promise<RoleStats>
  async getArtistOverview(artistId: string): Promise<ArtistEmailStats>
}
```

## 🖥️ Interface Utilisateur

### Dashboard Email par Métier
```typescript
// Composant principal pour chaque métier
const EmailDashboard: React.FC<{role: ContactRole}> = ({role}) => {
  return (
    <div className="space-y-6">
      <EmailStats role={role} />
      <QuickActions role={role} />
      <RecentCampaigns role={role} />
      <ContactInsights role={role} />
      <UpcomingTasks role={role} />
    </div>
  );
};

// Gestion des contacts
const ContactManager: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ContactList />
      <ContactDetails />
      <ContactActivity />
    </div>
  );
};

// Éditeur de campagne
const CampaignEditor: React.FC = () => {
  return (
    <div className="space-y-6">
      <CampaignSettings />
      <RecipientSelector />
      <EmailComposer />
      <SchedulingOptions />
      <PreviewPanel />
    </div>
  );
};
```

### Fonctionnalités Spécifiques par Métier

#### Marketing
- **Newsletters** et campagnes promotionnelles
- **Segmentation avancée** par démographie
- **A/B Testing** automatisé
- **Intégration réseaux sociaux**

#### Press/Médias
- **Liste médias** spécialisée
- **Communiqués de presse** templates
- **Suivi coverage** média
- **Alerte mentions**

#### Tournée
- **Contacts venues** et festivals
- **Annonces dates** automatisées
- **Coordination équipes**
- **Suivi logistique**

#### Label/Production
- **Contacts distributeurs**
- **Annonces releases**
- **Coordination promo**
- **Suivi partenaires**

#### Finance
- **Contacts comptables/légal**
- **Rapports financiers**
- **Facturation automatisée**
- **Suivi paiements**

## 🔐 Sécurité et Conformité

### RGPD/Privacy
- **Consentement explicite** pour chaque contact
- **Droit à l'oubli** automatisé
- **Portabilité des données**
- **Audit trail** complet

### Sécurité Email
- **SPF/DKIM/DMARC** configuration
- **Validation anti-spam**
- **Chiffrement en transit**
- **Rate limiting** intelligent

## 📊 Métriques et KPIs

### Par Métier
- **Taux d'ouverture** par type de contact
- **Taux de réponse** par campagne
- **Engagement score** par contact
- **ROI** par action marketing

### Global Artiste
- **Vue consolidée** toutes communications
- **Timeline** interactions
- **Heatmap** engagement
- **Prédictions** AI

## 🚀 Roadmap Implementation

### Phase 1 (2 semaines)
- ✅ Modèle de données complet
- ✅ API endpoints core
- ✅ Interface import contacts
- ✅ Envoi email basique

### Phase 2 (2 semaines)
- 📧 Templates par métier
- 📊 Tracking et analytics
- 🔄 Intégrations providers
- 📱 Interface mobile

### Phase 3 (2 semaines)
- 🤖 Automatisations avancées
- 📈 Analytics prédictives
- 🔗 Intégrations externes
- 🎨 Personnalisation poussée

Cette architecture garantit un service de mailing professionnel complètement intégré au CRM, permettant à chaque métier de gérer efficacement ses communications tout en centralisant le suivi pour l'artiste.