import { DataTypes, Model, Sequelize } from 'sequelize';

export interface MarketingCampaignAttributes {
  id: string;
  artistId: string;
  createdBy: string;
  name: string;
  description?: string;
  type: 'email' | 'social' | 'paid_ads' | 'influencer' | 'pr' | 'events' | 'other';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  platform?: string[];
  budget: number;
  spentAmount: number;
  targetAudience?: object;
  startDate: Date;
  endDate?: Date;
  goals: object;
  metrics: object;
  assets?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketingCampaignCreationAttributes extends Omit<MarketingCampaignAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export class MarketingCampaign extends Model<MarketingCampaignAttributes, MarketingCampaignCreationAttributes> implements MarketingCampaignAttributes {
  public id!: string;
  public artistId!: string;
  public createdBy!: string;
  public name!: string;
  public description?: string;
  public type!: 'email' | 'social' | 'paid_ads' | 'influencer' | 'pr' | 'events' | 'other';
  public status!: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  public platform?: string[];
  public budget!: number;
  public spentAmount!: number;
  public targetAudience?: object;
  public startDate!: Date;
  public endDate?: Date;
  public goals!: object;
  public metrics!: object;
  public assets?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual fields
  public get remainingBudget(): number {
    return this.budget - this.spentAmount;
  }

  public get budgetUsagePercentage(): number {
    return this.budget > 0 ? (this.spentAmount / this.budget) * 100 : 0;
  }

  public get isActive(): boolean {
    const now = new Date();
    return this.status === 'active' &&
           this.startDate <= now &&
           (!this.endDate || this.endDate >= now);
  }

  public get duration(): number | null {
    if (!this.endDate) return null;
    return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24));
  }

  // Calculate campaign performance
  public calculatePerformance(): object {
    const metrics = this.metrics as any;
    const goals = this.goals as any;

    if (!metrics || !goals) {
      return { score: 0, details: {} };
    }

    const performances: { [key: string]: number } = {};
    let totalScore = 0;
    let metricsCount = 0;

    // Calculate performance for each metric
    Object.keys(goals).forEach(key => {
      if (metrics[key] !== undefined && goals[key] > 0) {
        performances[key] = (metrics[key] / goals[key]) * 100;
        totalScore += performances[key];
        metricsCount++;
      }
    });

    const averageScore = metricsCount > 0 ? totalScore / metricsCount : 0;

    return {
      score: Math.round(averageScore),
      details: performances,
      status: averageScore >= 100 ? 'exceeds_goal' :
              averageScore >= 80 ? 'on_track' :
              averageScore >= 50 ? 'below_target' : 'poor'
    };
  }
}

export default function MarketingCampaignModel(sequelize: Sequelize): typeof MarketingCampaign {
  MarketingCampaign.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'artists',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 200],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
      },
      type: {
        type: DataTypes.ENUM('email', 'social', 'paid_ads', 'influencer', 'pr', 'events', 'other'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
      },
      platform: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      spentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      targetAudience: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isAfterStartDate(value: Date) {
            if (value && this.startDate && value <= this.startDate) {
              throw new Error('End date must be after start date');
            }
          },
        },
      },
      goals: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Campaign goals and targets (e.g., { "reach": 10000, "engagement": 500, "conversions": 50 })',
      },
      metrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Real-time campaign metrics (e.g., { "reach": 8500, "engagement": 750, "conversions": 42 })',
      },
      assets: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        comment: 'URLs to campaign assets (images, videos, documents)',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'MarketingCampaign',
      tableName: 'marketing_campaigns',
      timestamps: true,
      indexes: [
        {
          fields: ['artistId'],
        },
        {
          fields: ['createdBy'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['type'],
        },
        {
          fields: ['startDate'],
        },
        {
          fields: ['endDate'],
        },
        {
          fields: ['createdAt'],
        },
        {
          fields: ['platform'],
          using: 'gin',
        },
      ],
      hooks: {
        beforeSave: async (campaign: MarketingCampaign) => {
          // Ensure spent amount doesn't exceed budget
          if (campaign.spentAmount > campaign.budget) {
            campaign.spentAmount = campaign.budget;
          }
        },
        afterUpdate: async (campaign: MarketingCampaign) => {
          // Auto-complete campaign if end date is reached
          if (campaign.endDate &&
              campaign.endDate <= new Date() &&
              campaign.status === 'active') {
            campaign.status = 'completed';
            await campaign.save();
          }
        },
      },
    }
  );

  return MarketingCampaign;
}