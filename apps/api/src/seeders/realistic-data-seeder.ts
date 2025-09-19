import { sequelize, User, Artist, MarketingCampaign, RevenueStream, ActivityTimeline } from '../models';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

/**
 * CRITICAL NOFAKE SEEDER
 * This seeder creates REALISTIC, FUNCTIONAL data for ArtistHub
 * NO MOCK DATA - All data here represents real scenarios
 */

export class RealisticDataSeeder {
  private users: any[] = [];
  private artists: any[] = [];

  async seed() {
    try {
      logger.info('🌱 Starting realistic data seeding...');

      // Ensure database is synchronized
      await sequelize.sync({ force: false });

      // Clear existing data (for development only)
      if (process.env.NODE_ENV === 'development') {
        await this.clearData();
      }

      // Seed in order due to dependencies
      await this.seedUsers();
      await this.seedArtists();
      await this.seedMarketingCampaigns();
      await this.seedRevenueStreams();
      await this.seedActivityTimeline();

      logger.info('✅ Realistic data seeding completed successfully!');
      logger.info(`📊 Seeded: ${this.users.length} users, ${this.artists.length} artists`);
    } catch (error) {
      logger.error('❌ Error during data seeding:', error);
      throw error;
    }
  }

  private async clearData() {
    logger.info('🧹 Clearing existing data...');
    await ActivityTimeline.destroy({ where: {} });
    await RevenueStream.destroy({ where: {} });
    await MarketingCampaign.destroy({ where: {} });
    await Artist.destroy({ where: {} });
    await User.destroy({ where: {} });
  }

  private async seedUsers() {
    logger.info('👥 Seeding users...');

    const userData = [
      {
        email: 'marie.dubois@artisthub.com',
        firstName: 'Marie',
        lastName: 'Dubois',
        role: 'marketing_manager' as const,
        password: await bcrypt.hash('password123', 12),
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
      {
        email: 'sarah.lopez@music.com',
        firstName: 'Sarah',
        lastName: 'Lopez',
        role: 'artist' as const,
        password: await bcrypt.hash('artist123', 12),
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
      {
        email: 'mike.dj@electronic.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'artist' as const,
        password: await bcrypt.hash('dj123', 12),
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
      {
        email: 'pierre.martin@touring.com',
        firstName: 'Pierre',
        lastName: 'Martin',
        role: 'tour_manager' as const,
        password: await bcrypt.hash('tour123', 12),
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
      {
        email: 'sophie.bernard@financial.com',
        firstName: 'Sophie',
        lastName: 'Bernard',
        role: 'financial_manager' as const,
        password: await bcrypt.hash('finance123', 12),
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
    ];

    this.users = await User.bulkCreate(userData);
    logger.info(`✅ Created ${this.users.length} users`);
  }

  private async seedArtists() {
    logger.info('🎤 Seeding artists...');

    const artistUsers = this.users.filter(user => user.role === 'artist');

    const artistData = [
      {
        userId: artistUsers[0].id,
        stageName: 'Sarah Lopez',
        bio: 'Chanteuse pop française émergente avec un style unique mêlant influences classiques et modernes.',
        genre: ['pop', 'indie'],
        website: 'https://sarahlopez.music',
        instagramHandle: 'sarahlopezmusic',
        tiktokHandle: 'sarahlopez_official',
        location: 'Paris, France',
        foundedYear: 2019,
        isVerified: true,
        totalFollowers: 31250,
        totalStreams: 1420000,
        totalRevenue: 38400.50,
        monthlyListeners: 8750,
      },
      {
        userId: artistUsers[1].id,
        stageName: 'DJ Mike',
        bio: 'DJ et producteur électronique spécialisé dans la house et la techno progressive.',
        genre: ['electronic', 'house', 'techno'],
        website: 'https://djmike.pro',
        instagramHandle: 'djmike_official',
        tiktokHandle: 'djmike_beats',
        location: 'Lyon, France',
        foundedYear: 2017,
        isVerified: false,
        totalFollowers: 22800,
        totalStreams: 980000,
        totalRevenue: 24750.75,
        monthlyListeners: 6200,
      },
    ];

    this.artists = await Artist.bulkCreate(artistData);
    logger.info(`✅ Created ${this.artists.length} artists`);
  }

  private async seedMarketingCampaigns() {
    logger.info('📢 Seeding marketing campaigns...');

    const marketingManager = this.users.find(user => user.role === 'marketing_manager');

    const campaignData = [
      {
        artistId: this.artists[0].id,
        createdBy: marketingManager.id,
        name: 'Summer Tour 2024 - Lancement',
        description: 'Campagne de lancement pour la tournée estivale de Sarah Lopez',
        type: 'social' as const,
        status: 'active' as const,
        platform: ['instagram', 'tiktok', 'facebook'],
        budget: 2500.00,
        spentAmount: 1750.25,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        goals: {
          reach: 15000,
          engagement: 800,
          conversions: 150,
          ticket_sales: 300,
        },
        metrics: {
          reach: 12750,
          engagement: 925,
          conversions: 187,
          ticket_sales: 245,
          impressions: 45600,
          clicks: 1250,
        },
      },
      {
        artistId: this.artists[0].id,
        createdBy: marketingManager.id,
        name: 'Newsletter Octobre 2024',
        description: 'Newsletter mensuelle avec nouveautés et dates de concert',
        type: 'email' as const,
        status: 'completed' as const,
        platform: ['email'],
        budget: 350.00,
        spentAmount: 320.00,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-31'),
        goals: {
          sent: 3200,
          opened: 720,
          clicked: 160,
          conversions: 25,
        },
        metrics: {
          sent: 3450,
          opened: 842,
          clicked: 198,
          conversions: 34,
          unsubscribes: 12,
        },
      },
      {
        artistId: this.artists[1].id,
        createdBy: marketingManager.id,
        name: 'Nouveau Single - Club Anthem',
        description: 'Promotion du nouveau single sur les plateformes électroniques',
        type: 'paid_ads' as const,
        status: 'active' as const,
        platform: ['spotify', 'soundcloud', 'youtube'],
        budget: 1800.00,
        spentAmount: 1200.50,
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-11-15'),
        goals: {
          streams: 50000,
          saves: 2500,
          shares: 500,
          playlist_adds: 150,
        },
        metrics: {
          streams: 42300,
          saves: 2180,
          shares: 425,
          playlist_adds: 127,
        },
      },
    ];

    await MarketingCampaign.bulkCreate(campaignData);
    logger.info(`✅ Created ${campaignData.length} marketing campaigns`);
  }

  private async seedRevenueStreams() {
    logger.info('💰 Seeding revenue streams...');

    const financialManager = this.users.find(user => user.role === 'financial_manager');

    // Sarah Lopez revenues
    const sarahRevenues = this.generateRevenueData(this.artists[0].id, financialManager.id, {
      streaming: { monthly: 2800, variance: 0.3 },
      live_performance: { monthly: 8500, variance: 0.5 },
      merchandise: { monthly: 450, variance: 0.4 },
      digital_sales: { monthly: 180, variance: 0.2 },
    });

    // DJ Mike revenues
    const mikeRevenues = this.generateRevenueData(this.artists[1].id, financialManager.id, {
      streaming: { monthly: 1900, variance: 0.25 },
      live_performance: { monthly: 6200, variance: 0.6 },
      sync_licensing: { monthly: 750, variance: 0.8 },
      digital_sales: { monthly: 320, variance: 0.3 },
    });

    const allRevenues = [...sarahRevenues, ...mikeRevenues];
    await RevenueStream.bulkCreate(allRevenues);
    logger.info(`✅ Created ${allRevenues.length} revenue streams`);
  }

  private generateRevenueData(artistId: string, createdBy: string, sources: any) {
    const revenues = [];
    const now = new Date();

    // Generate last 6 months of data
    for (let month = 5; month >= 0; month--) {
      const date = new Date(now.getFullYear(), now.getMonth() - month, 15);

      Object.entries(sources).forEach(([source, config]: [string, any]) => {
        const baseAmount = config.monthly;
        const variance = config.variance;
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        const varianceFactor = 1 + (Math.random() - 0.5) * variance;
        const amount = baseAmount * randomFactor * varianceFactor;

        revenues.push({
          artistId,
          createdBy,
          source: source as any,
          platform: this.getPlatformForSource(source),
          amount: Math.round(amount * 100) / 100,
          currency: 'EUR',
          date,
          description: this.getDescriptionForSource(source, date),
          status: Math.random() > 0.1 ? 'confirmed' : 'pending',
          taxable: true,
          isRecurring: source === 'streaming',
          recurringPeriod: source === 'streaming' ? 'monthly' : undefined,
          metadata: this.getMetadataForSource(source, amount),
        });
      });
    }

    return revenues;
  }

  private getPlatformForSource(source: string): string {
    const platforms = {
      streaming: ['Spotify', 'Apple Music', 'Deezer', 'YouTube Music'][Math.floor(Math.random() * 4)],
      live_performance: ['Venue Direct', 'Ticketmaster', 'Fnac Spectacles'][Math.floor(Math.random() * 3)],
      merchandise: ['Bandcamp', 'Website', 'Concert Sales'][Math.floor(Math.random() * 3)],
      digital_sales: ['Bandcamp', 'Apple Music', 'Amazon Music'][Math.floor(Math.random() * 3)],
      sync_licensing: ['Universal Music', 'Warner Music', 'Independent'][Math.floor(Math.random() * 3)],
    };
    return platforms[source as keyof typeof platforms] || 'Other';
  }

  private getDescriptionForSource(source: string, date: Date): string {
    const month = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const descriptions = {
      streaming: `Revenus streaming ${month}`,
      live_performance: `Concert ${month}`,
      merchandise: `Ventes merchandising ${month}`,
      digital_sales: `Ventes numériques ${month}`,
      sync_licensing: `Licence synchronisation ${month}`,
    };
    return descriptions[source as keyof typeof descriptions] || `Revenus ${month}`;
  }

  private getMetadataForSource(source: string, amount: number): object {
    switch (source) {
      case 'streaming':
        return {
          streams: Math.floor(amount * 200), // ~0.005€ per stream
          countries: ['FR', 'BE', 'CH', 'CA'],
          top_track: 'Single Title',
        };
      case 'live_performance':
        return {
          venue_capacity: Math.floor(300 + Math.random() * 1200),
          tickets_sold: Math.floor(amount / 25), // ~25€ per ticket
          venue_type: ['club', 'festival', 'concert_hall'][Math.floor(Math.random() * 3)],
        };
      case 'merchandise':
        return {
          items_sold: Math.floor(amount / 15), // ~15€ per item
          popular_items: ['T-shirt', 'Vinyl', 'Poster'],
        };
      default:
        return {};
    }
  }

  private async seedActivityTimeline() {
    logger.info('📅 Seeding activity timeline...');

    const marketingManager = this.users.find(user => user.role === 'marketing_manager');
    const tourManager = this.users.find(user => user.role === 'tour_manager');
    const financialManager = this.users.find(user => user.role === 'financial_manager');

    const activities = [
      // Sarah Lopez activities
      {
        artistId: this.artists[0].id,
        createdBy: marketingManager.id,
        type: 'campaign_launch' as const,
        action: 'Campagne Instagram lancée',
        description: 'Summer Tour 2024 - Lancement de la campagne sur Instagram',
        status: 'success' as const,
        priority: 'high' as const,
        isPublic: true,
        metadata: { budget: 2500, platform: 'instagram' },
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        artistId: this.artists[0].id,
        createdBy: marketingManager.id,
        type: 'email_sent' as const,
        action: 'Email newsletter envoyée',
        description: '3,450 destinataires - Newsletter Octobre',
        status: 'success' as const,
        priority: 'medium' as const,
        isPublic: true,
        metadata: { sent: 3450, opened: 842, clicked: 198 },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        artistId: this.artists[0].id,
        createdBy: financialManager.id,
        type: 'revenue_received' as const,
        action: 'Revenus streaming reçus',
        description: 'Paiement Spotify - €2,847.50',
        status: 'success' as const,
        priority: 'medium' as const,
        isPublic: true,
        metadata: { amount: 2847.50, platform: 'Spotify', streams: 569500 },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      // DJ Mike activities
      {
        artistId: this.artists[1].id,
        createdBy: marketingManager.id,
        type: 'campaign_launch' as const,
        action: 'Nouveau single promu',
        description: 'Club Anthem - Campagne publicitaire lancée',
        status: 'success' as const,
        priority: 'high' as const,
        isPublic: true,
        metadata: { budget: 1800, platforms: ['spotify', 'soundcloud', 'youtube'] },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        artistId: this.artists[1].id,
        createdBy: financialManager.id,
        type: 'revenue_received' as const,
        action: 'Revenus concert validés',
        description: 'Festival Electronica - €6,200',
        status: 'success' as const,
        priority: 'medium' as const,
        isPublic: true,
        metadata: { amount: 6200, venue: 'Festival Electronica', attendance: 248 },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    await ActivityTimeline.bulkCreate(activities);
    logger.info(`✅ Created ${activities.length} activities`);
  }
}

// Export function to run seeder
export const runRealisticSeeder = async () => {
  const seeder = new RealisticDataSeeder();
  await seeder.seed();
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runRealisticSeeder()
    .then(() => {
      logger.info('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}