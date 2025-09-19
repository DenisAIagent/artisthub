export const APP_CONFIG = {
  name: 'ArtistHub',
  description: 'Your creative hub for artists and managers',
  version: '1.0.0',
  url: 'https://artisthub.com',
} as const;

export const USER_ROLES = {
  ARTIST: 'artist',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;

export const ARTIST_TYPES = {
  MUSICIAN: 'musician',
  PAINTER: 'painter',
  WRITER: 'writer',
  PHOTOGRAPHER: 'photographer',
  DANCER: 'dancer',
  ACTOR: 'actor',
  OTHER: 'other',
} as const;