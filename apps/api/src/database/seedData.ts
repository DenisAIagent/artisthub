import bcrypt from 'bcryptjs';
import { User, Artist, MarketingCampaign, RevenueStream, ActivityTimeline } from '../models';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.bulkCreate([
      {
        id: 'user-1',
        email: 'marie.dubois@artisthub.fr',
        firstName: 'Marie',
        lastName: 'Dubois',
        password: hashedPassword,
        role: 'marketing_manager',
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
      {
        id: 'user-2',
        email: 'sarah.lopez@artisthub.fr',
        firstName: 'Sarah',
        lastName: 'Lopez',
        password: hashedPassword,
        role: 'artist',
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
      {
        id: 'user-3',
        email: 'mike.johnson@artisthub.fr',
        firstName: 'Mike',
        lastName: 'Johnson',
        password: hashedPassword,
        role: 'artist',
        isActive: true,
        isEmailVerified: true,
        timezone: 'Europe/Paris',
      },
    ]);

    // Create artists
    const artists = await Artist.bulkCreate([
      {
        id: 'artist-1',
        userId: 'user-2',
        stageName: 'Sarah Lopez',
        realName: 'Sarah Lopez',
        genre: 'Electronic Pop',
        country: 'France',
        bio: 'Rising electronic pop artist from France with a unique sound that blends synthwave and modern pop.',
        status: 'active',
        totalFollowers: 125000,
        spotifyId: 'sarah-lopez-spotify',
        appleMusicId: 'sarah-lopez-apple',
        youtubeChannelId: 'sarah-lopez-youtube',
        instagramHandle: '@sarahlopezmusic',
        twitterHandle: '@sarahlopez',
        facebookPage: 'SarahLopezMusic',
        tiktokHandle: '@sarahlopezmusic',
      },
      {
        id: 'artist-2',
        userId: 'user-3',
        stageName: 'DJ Mike',
        realName: 'Mike Johnson',
        genre: 'House',
        country: 'France',
        bio: 'House music producer and DJ with over 10 years of experience in the electronic scene.',
        status: 'active',
        totalFollowers: 89000,
        spotifyId: 'dj-mike-spotify',
        appleMusicId: 'dj-mike-apple',
        youtubeChannelId: 'dj-mike-youtube',
        instagramHandle: '@djmike',
        twitterHandle: '@djmike',
        facebookPage: 'DJMikeOfficial',
        tiktokHandle: '@djmike',
      },
    ]);

    // Create marketing campaigns
    const campaigns = await MarketingCampaign.bulkCreate([
      {
        id: 'campaign-1',
        artistId: 'artist-1',
        name: 'Single Release - Midnight Dreams',
        type: 'single_release',
        status: 'active',
        budget: 5000,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-15'),
        description: 'Marketing campaign for the new single Midnight Dreams featuring social media promotion and playlist pitching.',
        metrics: {
          reach: 150000,
          engagement: 8500,
          conversions: 1200,
          cost_per_conversion: 4.17
        },
        createdBy: 'user-1',
      },
      {
        id: 'campaign-2',
        artistId: 'artist-2',
        name: 'Summer Tour Promotion',
        type: 'tour_promotion',
        status: 'completed',
        budget: 8000,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-07-31'),
        description: 'Comprehensive tour promotion campaign including venue partnerships and social media advertising.',
        metrics: {
          reach: 200000,
          engagement: 12000,
          conversions: 850,
          cost_per_conversion: 9.41
        },
        createdBy: 'user-1',
      },
    ]);

    // Create revenue streams
    const revenues = await RevenueStream.bulkCreate([
      {
        id: 'revenue-1',
        artistId: 'artist-1',
        source: 'streaming',
        amount: 2500.50,
        currency: 'EUR',
        date: new Date('2024-01-31'),
        status: 'confirmed',
        description: 'January streaming royalties from Spotify, Apple Music, and YouTube Music',
        metadata: {
          platform: 'multiple',
          period: '2024-01',
          streams: 125000
        },
        createdBy: 'user-1',
      },
      {
        id: 'revenue-2',
        artistId: 'artist-1',
        source: 'live_performance',
        amount: 1500.00,
        currency: 'EUR',
        date: new Date('2024-02-14'),
        status: 'confirmed',
        description: 'Performance at Le Bataclan, Paris',
        metadata: {
          venue: 'Le Bataclan',
          city: 'Paris',
          attendance: 300
        },
        createdBy: 'user-1',
      },
      {
        id: 'revenue-3',
        artistId: 'artist-2',
        source: 'streaming',
        amount: 1800.75,
        currency: 'EUR',
        date: new Date('2024-01-31'),
        status: 'confirmed',
        description: 'January streaming royalties',
        metadata: {
          platform: 'multiple',
          period: '2024-01',
          streams: 89000
        },
        createdBy: 'user-1',
      },
    ]);

    // Create activity timeline
    const activities = await ActivityTimeline.bulkCreate([
      {
        id: 'activity-1',
        artistId: 'artist-1',
        action: 'Campagne créée',
        status: 'success',
        description: 'Nouvelle campagne marketing "Midnight Dreams" lancée',
        metadata: {
          campaign_id: 'campaign-1',
          budget: 5000
        },
        createdBy: 'user-1',
      },
      {
        id: 'activity-2',
        artistId: 'artist-1',
        action: 'Revenus ajoutés',
        status: 'info',
        description: 'Royalties streaming janvier ajoutées: €2,500.50',
        metadata: {
          revenue_id: 'revenue-1',
          amount: 2500.50
        },
        createdBy: 'user-1',
      },
      {
        id: 'activity-3',
        artistId: 'artist-2',
        action: 'Performance confirmée',
        status: 'success',
        description: 'Concert au Rex Club confirmé pour le 15 mars',
        metadata: {
          venue: 'Rex Club',
          date: '2024-03-15'
        },
        createdBy: 'user-1',
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`- Created ${users.length} users`);
    console.log(`- Created ${artists.length} artists`);
    console.log(`- Created ${campaigns.length} marketing campaigns`);
    console.log(`- Created ${revenues.length} revenue streams`);
    console.log(`- Created ${activities.length} activities`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};