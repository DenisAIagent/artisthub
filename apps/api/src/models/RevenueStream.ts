import { DataTypes, Model, Sequelize } from 'sequelize';

export interface RevenueStreamAttributes {
  id: string;
  artistId: string;
  createdBy: string;
  source: 'streaming' | 'physical_sales' | 'digital_sales' | 'live_performance' | 'merchandise' | 'sync_licensing' | 'publishing' | 'sponsorship' | 'other';
  platform?: string;
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  metadata?: object;
  isRecurring: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  contractId?: string;
  taxable: boolean;
  status: 'pending' | 'confirmed' | 'disputed' | 'cancelled';
  payoutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenueStreamCreationAttributes extends Omit<RevenueStreamAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export class RevenueStream extends Model<RevenueStreamAttributes, RevenueStreamCreationAttributes> implements RevenueStreamAttributes {
  public id!: string;
  public artistId!: string;
  public createdBy!: string;
  public source!: 'streaming' | 'physical_sales' | 'digital_sales' | 'live_performance' | 'merchandise' | 'sync_licensing' | 'publishing' | 'sponsorship' | 'other';
  public platform?: string;
  public amount!: number;
  public currency!: string;
  public date!: Date;
  public description?: string;
  public metadata?: object;
  public isRecurring!: boolean;
  public recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  public contractId?: string;
  public taxable!: boolean;
  public status!: 'pending' | 'confirmed' | 'disputed' | 'cancelled';
  public payoutDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual fields for formatted amounts
  public get formattedAmount(): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  public get sourceLabel(): string {
    const labels = {
      streaming: 'Streaming',
      physical_sales: 'Ventes physiques',
      digital_sales: 'Ventes numériques',
      live_performance: 'Concerts',
      merchandise: 'Merchandising',
      sync_licensing: 'Synchronisation',
      publishing: 'Édition',
      sponsorship: 'Parrainage',
      other: 'Autre',
    };
    return labels[this.source] || this.source;
  }

  public get isOverdue(): boolean {
    if (!this.payoutDate) return false;
    return this.payoutDate < new Date() && this.status === 'pending';
  }

  // Calculate net amount after taxes (simplified)
  public getNetAmount(taxRate: number = 0.2): number {
    if (!this.taxable) return this.amount;
    return this.amount * (1 - taxRate);
  }
}

export default function RevenueStreamModel(sequelize: Sequelize): typeof RevenueStream {
  RevenueStream.init(
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
      source: {
        type: DataTypes.ENUM('streaming', 'physical_sales', 'digital_sales', 'live_performance', 'merchandise', 'sync_licensing', 'publishing', 'sponsorship', 'other'),
        allowNull: false,
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Platform/service name (e.g., Spotify, Apple Music, Bandcamp)',
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'EUR',
        validate: {
          isIn: [['EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY']],
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date when the revenue was generated',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional data like stream counts, track info, venue details, etc.',
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      recurringPeriod: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly'),
        allowNull: true,
      },
      contractId: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Reference to external contract or agreement',
      },
      taxable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'disputed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      payoutDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When the revenue was/will be paid out',
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
      modelName: 'RevenueStream',
      tableName: 'revenue_streams',
      timestamps: true,
      indexes: [
        {
          fields: ['artistId'],
        },
        {
          fields: ['createdBy'],
        },
        {
          fields: ['source'],
        },
        {
          fields: ['platform'],
        },
        {
          fields: ['date'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['amount'],
        },
        {
          fields: ['currency'],
        },
        {
          fields: ['payoutDate'],
        },
        {
          fields: ['createdAt'],
        },
        // Composite indexes for common queries
        {
          fields: ['artistId', 'date'],
        },
        {
          fields: ['artistId', 'source'],
        },
        {
          fields: ['artistId', 'status'],
        },
      ],
      validate: {
        recurringFieldsConsistent() {
          if (this.isRecurring && !this.recurringPeriod) {
            throw new Error('Recurring period must be specified for recurring revenue');
          }
          if (!this.isRecurring && this.recurringPeriod) {
            throw new Error('Recurring period should not be set for non-recurring revenue');
          }
        },
      },
      hooks: {
        beforeSave: async (revenue: RevenueStream) => {
          // Normalize currency to uppercase
          revenue.currency = revenue.currency.toUpperCase();

          // Set platform if metadata contains it
          if (revenue.metadata && (revenue.metadata as any).platform && !revenue.platform) {
            revenue.platform = (revenue.metadata as any).platform;
          }
        },
      },
    }
  );

  return RevenueStream;
}