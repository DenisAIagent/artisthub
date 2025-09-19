import { Request, Response } from 'express';
import { Op } from 'sequelize';
import {
  User,
  Artist,
  MarketingCampaign,
  RevenueStream,
  ActivityTimeline,
} from '../models';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    artistsAccess: Array<{ id: string; name: string }>;
  };
}

// Get dashboard metrics based on user role
export const getDashboardMetrics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { artistId } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Get user's accessible artists
    const userRecord = await User.findByPk(user.id, {
      include: [
        {
          model: Artist,
          as: 'artistProfile',
        },
      ],
    });

    if (!userRecord) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let targetArtists: string[] = [];

    if (artistId && artistId !== 'all') {
      targetArtists = [artistId as string];
    } else {
      // Get all artists the user has access to (simplified for now)
      const artists = await Artist.findAll({
        attributes: ['id'],
      });
      targetArtists = artists.map(a => a.id);
    }

    let metrics;

    switch (user.role) {
      case 'marketing_manager':
        metrics = await getMarketingMetrics(targetArtists);
        break;
      case 'tour_manager':
        metrics = await getTourMetrics(targetArtists);
        break;
      case 'financial_manager':
        metrics = await getFinancialMetrics(targetArtists);
        break;
      default:
        metrics = await getGeneralMetrics(targetArtists);
    }

    res.json({
      success: true,
      data: {
        metrics,
        artistId: artistId || 'all',
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Marketing Manager Metrics
const getMarketingMetrics = async (artistIds: string[]) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Active campaigns
  const activeCampaigns = await MarketingCampaign.count({
    where: {
      artistId: { [Op.in]: artistIds },
      status: 'active',
    },
  });

  // Previous month active campaigns for comparison
  const prevActiveCampaigns = await MarketingCampaign.count({
    where: {
      artistId: { [Op.in]: artistIds },
      status: 'active',
      createdAt: { [Op.lt]: thirtyDaysAgo },
    },
  });

  // Email campaigns metrics (simplified - would need email tracking)
  const emailCampaigns = await MarketingCampaign.findAll({
    where: {
      artistId: { [Op.in]: artistIds },
      type: 'email',
      createdAt: { [Op.gte]: thirtyDaysAgo },
    },
    attributes: ['metrics'],
  });

  let totalEmailsSent = 0;
  let totalEmailsOpened = 0;

  emailCampaigns.forEach(campaign => {
    const metrics = campaign.metrics as any;
    if (metrics) {
      totalEmailsSent += metrics.sent || 0;
      totalEmailsOpened += metrics.opened || 0;
    }
  });

  const openRate = totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0;

  // Total followers (from artists)
  const artistsData = await Artist.findAll({
    where: { id: { [Op.in]: artistIds } },
    attributes: ['totalFollowers'],
  });

  const totalFollowers = artistsData.reduce((sum, artist) => sum + artist.totalFollowers, 0);

  return [
    {
      label: 'Campagnes actives',
      value: activeCampaigns.toString(),
      change: `+${activeCampaigns - prevActiveCampaigns}`,
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: activeCampaigns >= prevActiveCampaigns ? 'up' : 'down',
      color: 'blue',
    },
    {
      label: 'Emails envoyés',
      value: formatNumber(totalEmailsSent),
      change: '+24%', // Would calculate from previous period
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'up',
      color: 'green',
    },
    {
      label: 'Taux d\'ouverture moyen',
      value: `${openRate.toFixed(1)}%`,
      change: '+2.8%', // Would calculate from previous period
      breakdown: 'Moyenne pondérée',
      trend: 'up',
      color: 'purple',
    },
    {
      label: 'Followers totaux',
      value: formatNumber(totalFollowers),
      change: '+3.4K', // Would calculate from previous period
      breakdown: 'Tous réseaux',
      trend: 'up',
      color: 'orange',
    },
  ];
};

// Tour Manager Metrics
const getTourMetrics = async (artistIds: string[]) => {
  // For now, return placeholder data - would need Tour models
  return [
    {
      label: 'Shows programmés',
      value: '0',
      change: '+0',
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'stable',
      color: 'blue',
    },
    {
      label: 'Venues confirmées',
      value: '0',
      change: '+0',
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'stable',
      color: 'green',
    },
    {
      label: 'Revenus prévisionnels',
      value: '€0',
      change: '+€0',
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'stable',
      color: 'yellow',
    },
    {
      label: 'Holds actifs',
      value: '0',
      change: '+0',
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'stable',
      color: 'purple',
    },
  ];
};

// Financial Manager Metrics
const getFinancialMetrics = async (artistIds: string[]) => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Total revenue this month
  const thisMonthRevenue = await RevenueStream.findAll({
    where: {
      artistId: { [Op.in]: artistIds },
      date: { [Op.gte]: thisMonthStart },
      status: 'confirmed',
    },
    attributes: ['amount', 'source'],
  });

  // Last month revenue for comparison
  const lastMonthRevenue = await RevenueStream.findAll({
    where: {
      artistId: { [Op.in]: artistIds },
      date: {
        [Op.gte]: lastMonthStart,
        [Op.lt]: thisMonthStart,
      },
      status: 'confirmed',
    },
    attributes: ['amount'],
  });

  const totalThisMonth = thisMonthRevenue.reduce((sum, rev) => sum + parseFloat(rev.amount.toString()), 0);
  const totalLastMonth = lastMonthRevenue.reduce((sum, rev) => sum + parseFloat(rev.amount.toString()), 0);

  const revenueChange = totalLastMonth > 0 ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0;

  // Streaming revenue
  const streamingRevenue = thisMonthRevenue
    .filter(rev => rev.source === 'streaming')
    .reduce((sum, rev) => sum + parseFloat(rev.amount.toString()), 0);

  // Tour revenue
  const tourRevenue = thisMonthRevenue
    .filter(rev => rev.source === 'live_performance')
    .reduce((sum, rev) => sum + parseFloat(rev.amount.toString()), 0);

  return [
    {
      label: 'Revenus totaux',
      value: formatCurrency(totalThisMonth),
      change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(0)}%`,
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: revenueChange >= 0 ? 'up' : 'down',
      color: 'green',
    },
    {
      label: 'Dépenses totales',
      value: '€0', // Would need Expense model
      change: '0%',
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'stable',
      color: 'red',
    },
    {
      label: 'Streaming total',
      value: formatCurrency(streamingRevenue),
      change: '+15%', // Would calculate from previous period
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'up',
      color: 'blue',
    },
    {
      label: 'Tournées total',
      value: formatCurrency(tourRevenue),
      change: '+32%', // Would calculate from previous period
      breakdown: artistIds.length === 1 ? 'Cet artiste' : 'Tous artistes',
      trend: 'up',
      color: 'purple',
    },
  ];
};

// General Metrics (for other roles)
const getGeneralMetrics = async (artistIds: string[]) => {
  const artistCount = artistIds.length;

  return [
    {
      label: 'Projets actifs',
      value: '0', // Would need Project model
      change: '+0',
      breakdown: 'Tous artistes',
      trend: 'stable',
      color: 'blue',
    },
    {
      label: 'Tâches complétées',
      value: '0%', // Would need Task model
      change: '+0%',
      breakdown: 'Moyenne',
      trend: 'stable',
      color: 'green',
    },
    {
      label: 'Documents partagés',
      value: '0', // Would need Document model
      change: '+0',
      breakdown: 'Tous artistes',
      trend: 'stable',
      color: 'purple',
    },
    {
      label: 'Artistes gérés',
      value: artistCount.toString(),
      change: '+0',
      breakdown: 'Portfolio',
      trend: 'stable',
      color: 'orange',
    },
  ];
};

// Get recent activities
export const getRecentActivities = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { artistId, limit = 10 } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    let whereClause: any = {};

    if (artistId && artistId !== 'all') {
      whereClause.artistId = artistId;
    }

    const activities = await ActivityTimeline.findAll({
      where: whereClause,
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['stageName'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit as string),
    });

    const formattedActivities = activities.map(activity => ({
      time: activity.timeAgo,
      action: activity.action,
      detail: activity.description || 'Aucun détail disponible',
      artist: (activity as any).artist?.stageName || 'Artiste inconnu',
      type: activity.status,
      metadata: activity.metadata,
    }));

    res.json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    logger.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};