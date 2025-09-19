# ARTISTHUB CRM API STRUCTURE

## API ARCHITECTURE OVERVIEW

The API follows a **modular, domain-driven design** with the following characteristics:

- **RESTful endpoints** with consistent naming conventions
- **JWT-based authentication** with role-based access control
- **Microservice-ready structure** (can be split later if needed)
- **OpenAPI 3.0 specification** for documentation
- **Standardized response format** across all endpoints

---

## AUTHENTICATION & AUTHORIZATION

### Authentication Endpoints
```
POST   /api/auth/login                    # User login
POST   /api/auth/register                 # User registration
POST   /api/auth/logout                   # User logout
POST   /api/auth/refresh                  # Refresh JWT token
POST   /api/auth/forgot-password          # Request password reset
POST   /api/auth/reset-password           # Reset password with token
GET    /api/auth/verify-email/:token      # Email verification
```

### Team Management
```
GET    /api/teams/invitations             # Get pending invitations
POST   /api/teams/invite                  # Invite team member
PUT    /api/teams/invitations/:id/accept  # Accept invitation
DELETE /api/teams/invitations/:id         # Decline/cancel invitation
GET    /api/teams/members                 # Get team members
PUT    /api/teams/members/:id/role        # Update member role
DELETE /api/teams/members/:id             # Remove team member
```

---

## CORE ENTITIES

### Artists
```
GET    /api/artists                       # Get all artists (filtered by access)
GET    /api/artists/:id                   # Get specific artist
PUT    /api/artists/:id                   # Update artist profile
GET    /api/artists/:id/dashboard         # Get artist dashboard data
GET    /api/artists/:id/timeline          # Get activity timeline
```

### Users
```
GET    /api/users/profile                 # Get current user profile
PUT    /api/users/profile                 # Update user profile
GET    /api/users/:id                     # Get user by ID (team access only)
```

---

## MARKETING MODULE

### Campaigns
```
GET    /api/artists/:artistId/marketing/campaigns
POST   /api/artists/:artistId/marketing/campaigns
GET    /api/artists/:artistId/marketing/campaigns/:id
PUT    /api/artists/:artistId/marketing/campaigns/:id
DELETE /api/artists/:artistId/marketing/campaigns/:id
POST   /api/artists/:artistId/marketing/campaigns/:id/activate
POST   /api/artists/:artistId/marketing/campaigns/:id/pause
```

### Social Media Analytics
```
GET    /api/artists/:artistId/marketing/social-stats
POST   /api/artists/:artistId/marketing/social-stats
GET    /api/artists/:artistId/marketing/social-stats/:platform
PUT    /api/artists/:artistId/marketing/social-stats/:id
DELETE /api/artists/:artistId/marketing/social-stats/:id
```

### Audience Demographics
```
GET    /api/artists/:artistId/marketing/demographics
POST   /api/artists/:artistId/marketing/demographics
GET    /api/artists/:artistId/marketing/demographics/:platform
```

---

## TOURING MODULE

### Tours
```
GET    /api/artists/:artistId/tours
POST   /api/artists/:artistId/tours
GET    /api/artists/:artistId/tours/:id
PUT    /api/artists/:artistId/tours/:id
DELETE /api/artists/:artistId/tours/:id
```

### Tour Dates
```
GET    /api/artists/:artistId/tours/:tourId/dates
POST   /api/artists/:artistId/tours/:tourId/dates
GET    /api/artists/:artistId/tours/:tourId/dates/:id
PUT    /api/artists/:artistId/tours/:tourId/dates/:id
DELETE /api/artists/:artistId/tours/:tourId/dates/:id
POST   /api/artists/:artistId/tours/:tourId/dates/:id/sales-update
```

### Venues
```
GET    /api/venues                        # Search venues
POST   /api/venues                        # Create venue (tour managers only)
GET    /api/venues/:id
PUT    /api/venues/:id
```

### Logistics
```
GET    /api/tours/:tourId/dates/:dateId/logistics
POST   /api/tours/:tourId/dates/:dateId/logistics
PUT    /api/tours/:tourId/dates/:dateId/logistics/:id
DELETE /api/tours/:tourId/dates/:dateId/logistics/:id
```

---

## ALBUMS MODULE

### Albums
```
GET    /api/artists/:artistId/albums
POST   /api/artists/:artistId/albums
GET    /api/artists/:artistId/albums/:id
PUT    /api/artists/:artistId/albums/:id
DELETE /api/artists/:artistId/albums/:id
```

### Tracks
```
GET    /api/albums/:albumId/tracks
POST   /api/albums/:albumId/tracks
GET    /api/albums/:albumId/tracks/:id
PUT    /api/albums/:albumId/tracks/:id
DELETE /api/albums/:albumId/tracks/:id
```

### Streaming Analytics
```
GET    /api/albums/:albumId/tracks/:trackId/streaming-stats
POST   /api/albums/:albumId/tracks/:trackId/streaming-stats
GET    /api/albums/:albumId/streaming-summary
```

### Production Timeline
```
GET    /api/albums/:albumId/timeline
POST   /api/albums/:albumId/timeline
PUT    /api/albums/:albumId/timeline/:id
DELETE /api/albums/:albumId/timeline/:id
```

---

## FINANCIAL MODULE

### Revenue Streams
```
GET    /api/artists/:artistId/financial/revenue
POST   /api/artists/:artistId/financial/revenue
GET    /api/artists/:artistId/financial/revenue/:id
PUT    /api/artists/:artistId/financial/revenue/:id
DELETE /api/artists/:artistId/financial/revenue/:id
```

### Expenses
```
GET    /api/artists/:artistId/financial/expenses
POST   /api/artists/:artistId/financial/expenses
GET    /api/artists/:artistId/financial/expenses/:id
PUT    /api/artists/:artistId/financial/expenses/:id
DELETE /api/artists/:artistId/financial/expenses/:id
POST   /api/artists/:artistId/financial/expenses/:id/approve
```

### Royalty Statements
```
GET    /api/artists/:artistId/financial/royalties
POST   /api/artists/:artistId/financial/royalties
GET    /api/artists/:artistId/financial/royalties/:id
PUT    /api/artists/:artistId/financial/royalties/:id
```

### Financial Reports
```
GET    /api/artists/:artistId/financial/summary
GET    /api/artists/:artistId/financial/reports/profit-loss
GET    /api/artists/:artistId/financial/reports/cash-flow
GET    /api/artists/:artistId/financial/reports/revenue-breakdown
```

---

## PRESS MODULE

### Press Campaigns
```
GET    /api/artists/:artistId/press/campaigns
POST   /api/artists/:artistId/press/campaigns
GET    /api/artists/:artistId/press/campaigns/:id
PUT    /api/artists/:artistId/press/campaigns/:id
DELETE /api/artists/:artistId/press/campaigns/:id
```

### Media Coverage
```
GET    /api/artists/:artistId/press/coverage
POST   /api/artists/:artistId/press/coverage
GET    /api/artists/:artistId/press/coverage/:id
PUT    /api/artists/:artistId/press/coverage/:id
DELETE /api/artists/:artistId/press/coverage/:id
```

### Interviews
```
GET    /api/artists/:artistId/press/interviews
POST   /api/artists/:artistId/press/interviews
GET    /api/artists/:artistId/press/interviews/:id
PUT    /api/artists/:artistId/press/interviews/:id
DELETE /api/artists/:artistId/press/interviews/:id
```

---

## ANALYTICS & REPORTING

### Timeline
```
GET    /api/artists/:artistId/timeline     # Activity timeline
POST   /api/artists/:artistId/timeline     # Add timeline entry
```

### Reports
```
GET    /api/artists/:artistId/reports      # Get available reports
GET    /api/artists/:artistId/reports/:type # Get specific report type
POST   /api/artists/:artistId/reports/generate # Generate new report
```

### Analytics
```
GET    /api/artists/:artistId/analytics/overview    # High-level metrics
GET    /api/artists/:artistId/analytics/growth      # Growth metrics
GET    /api/artists/:artistId/analytics/performance # Performance metrics
```

---

## STANDARDIZED RESPONSE FORMAT

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "v1",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "v1"
  }
}
```

---

## QUERY PARAMETERS

### Common Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (e.g., 'created_at', '-name' for desc)
- `filter` - JSON object for filtering
- `search` - Text search across relevant fields
- `include` - Related entities to include

### Date Range Filtering
- `startDate` - Start date (ISO 8601 format)
- `endDate` - End date (ISO 8601 format)
- `period` - Predefined period ('7d', '30d', '90d', '1y')

### Examples
```
GET /api/artists/123/financial/revenue?startDate=2024-01-01&endDate=2024-12-31&sort=-amount
GET /api/artists/123/tours?filter={"status":"active"}&include=dates
GET /api/artists/123/press/coverage?search=billboard&sort=-publication_date
```

---

## RATE LIMITING

- **General API calls**: 1000 requests per hour per user
- **Authentication endpoints**: 10 requests per minute per IP
- **File uploads**: 50 requests per hour per user
- **Report generation**: 5 requests per hour per user

---

## WEBHOOK ENDPOINTS

```
POST   /api/webhooks/streaming/:platform  # Streaming platform webhooks
POST   /api/webhooks/ticketing/:provider  # Ticketing platform webhooks
POST   /api/webhooks/social/:platform     # Social media platform webhooks
```