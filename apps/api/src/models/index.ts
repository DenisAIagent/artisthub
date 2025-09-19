import sequelize from '../config/database';
import logger from '../utils/logger';

// Import models (only available ones for now)
import UserModel from './User';
import ArtistModel from './Artist';
import MarketingCampaignModel from './MarketingCampaign';
import RevenueStreamModel from './RevenueStream';
import ActivityTimelineModel from './ActivityTimeline';
// import TeamMembershipModel from './TeamMembership';
// import SocialMediaStatsModel from './SocialMediaStats';
// import AudienceDemographicsModel from './AudienceDemographics';
// import TourModel from './Tour';
// import VenueModel from './Venue';
// import TourDateModel from './TourDate';
// import TourLogisticsModel from './TourLogistics';
// import AlbumModel from './Album';
// import TrackModel from './Track';
// import StreamingStatsModel from './StreamingStats';
// import ProductionTimelineModel from './ProductionTimeline';
// import ExpenseModel from './Expense';
// import RoyaltyStatementModel from './RoyaltyStatement';
// import PressCampaignModel from './PressCampaign';
// import MediaCoverageModel from './MediaCoverage';
// import InterviewModel from './Interview';
// import ReportModel from './Report';

// Initialize models (only available ones for now)
const User = UserModel(sequelize);
const Artist = ArtistModel(sequelize);
const MarketingCampaign = MarketingCampaignModel(sequelize);
const RevenueStream = RevenueStreamModel(sequelize);
const ActivityTimeline = ActivityTimelineModel(sequelize);
// const TeamMembership = TeamMembershipModel(sequelize);
// const SocialMediaStats = SocialMediaStatsModel(sequelize);
// const AudienceDemographics = AudienceDemographicsModel(sequelize);
// const Tour = TourModel(sequelize);
// const Venue = VenueModel(sequelize);
// const TourDate = TourDateModel(sequelize);
// const TourLogistics = TourLogisticsModel(sequelize);
// const Album = AlbumModel(sequelize);
// const Track = TrackModel(sequelize);
// const StreamingStats = StreamingStatsModel(sequelize);
// const ProductionTimeline = ProductionTimelineModel(sequelize);
// const Expense = ExpenseModel(sequelize);
// const RoyaltyStatement = RoyaltyStatementModel(sequelize);
// const PressCampaign = PressCampaignModel(sequelize);
// const MediaCoverage = MediaCoverageModel(sequelize);
// const Interview = InterviewModel(sequelize);
// const Report = ReportModel(sequelize);

// Define associations (only for available models)
function defineAssociations() {
  // User <-> Artist (1:1)
  User.hasOne(Artist, { foreignKey: 'userId', as: 'artistProfile' });
  Artist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Artist <-> MarketingCampaign (1:M)
  Artist.hasMany(MarketingCampaign, { foreignKey: 'artistId', as: 'marketingCampaigns' });
  MarketingCampaign.belongsTo(Artist, { foreignKey: 'artistId', as: 'artist' });

  // User -> MarketingCampaign (creator)
  User.hasMany(MarketingCampaign, { foreignKey: 'createdBy', as: 'createdCampaigns' });
  MarketingCampaign.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

  // Artist <-> RevenueStream (1:M)
  Artist.hasMany(RevenueStream, { foreignKey: 'artistId', as: 'revenueStreams' });
  RevenueStream.belongsTo(Artist, { foreignKey: 'artistId', as: 'artist' });

  // User -> RevenueStream (creator)
  User.hasMany(RevenueStream, { foreignKey: 'createdBy', as: 'createdRevenueStreams' });
  RevenueStream.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

  // Artist <-> ActivityTimeline (1:M)
  Artist.hasMany(ActivityTimeline, { foreignKey: 'artistId', as: 'timeline' });
  ActivityTimeline.belongsTo(Artist, { foreignKey: 'artistId', as: 'artist' });

  // User -> ActivityTimeline (creator)
  User.hasMany(ActivityTimeline, { foreignKey: 'createdBy', as: 'createdActivities' });
  ActivityTimeline.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
}

// Call association definition
defineAssociations();

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    return false;
  }
};

// Sync database (use carefully in production)
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    logger.info('Database synchronized successfully');
  } catch (error) {
    logger.error('Database sync error:', error);
    throw error;
  }
};

// Close database connection
export const closeConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

// Export models and sequelize instance (only available ones)
export {
  sequelize,
  User,
  Artist,
  MarketingCampaign,
  RevenueStream,
  ActivityTimeline,
};

export default sequelize;