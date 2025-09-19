import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ActivityTimelineAttributes {
  id: string;
  artistId: string;
  createdBy: string;
  type: 'campaign_launch' | 'email_sent' | 'social_post' | 'venue_booking' | 'contract_signed' | 'revenue_received' | 'expense_logged' | 'document_uploaded' | 'team_invite' | 'report_generated' | 'other';
  action: string;
  description?: string;
  metadata?: object;
  relatedEntityType?: string;
  relatedEntityId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'info' | 'success' | 'warning' | 'error';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityTimelineCreationAttributes extends Omit<ActivityTimelineAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export class ActivityTimeline extends Model<ActivityTimelineAttributes, ActivityTimelineCreationAttributes> implements ActivityTimelineAttributes {
  public id!: string;
  public artistId!: string;
  public createdBy!: string;
  public type!: 'campaign_launch' | 'email_sent' | 'social_post' | 'venue_booking' | 'contract_signed' | 'revenue_received' | 'expense_logged' | 'document_uploaded' | 'team_invite' | 'report_generated' | 'other';
  public action!: string;
  public description?: string;
  public metadata?: object;
  public relatedEntityType?: string;
  public relatedEntityId?: string;
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public status!: 'info' | 'success' | 'warning' | 'error';
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual fields
  public get timeAgo(): string {
    const now = new Date();
    const diffInMs = now.getTime() - this.createdAt.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}j`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}sem`;

    return this.createdAt.toLocaleDateString('fr-FR');
  }

  public get icon(): string {
    const icons = {
      campaign_launch: '🚀',
      email_sent: '📧',
      social_post: '📱',
      venue_booking: '🎤',
      contract_signed: '📝',
      revenue_received: '💰',
      expense_logged: '💸',
      document_uploaded: '📄',
      team_invite: '👥',
      report_generated: '📊',
      other: '📌',
    };
    return icons[this.type] || '📌';
  }

  public get typeLabel(): string {
    const labels = {
      campaign_launch: 'Campagne lancée',
      email_sent: 'Email envoyé',
      social_post: 'Publication sociale',
      venue_booking: 'Venue réservée',
      contract_signed: 'Contrat signé',
      revenue_received: 'Revenus reçus',
      expense_logged: 'Dépense enregistrée',
      document_uploaded: 'Document ajouté',
      team_invite: 'Invitation équipe',
      report_generated: 'Rapport généré',
      other: 'Autre',
    };
    return labels[this.type] || this.type;
  }

  public get statusColor(): string {
    const colors = {
      info: 'blue',
      success: 'emerald',
      warning: 'amber',
      error: 'red',
    };
    return colors[this.status] || 'gray';
  }

  public get priorityColor(): string {
    const colors = {
      low: 'gray',
      medium: 'blue',
      high: 'amber',
      urgent: 'red',
    };
    return colors[this.priority] || 'gray';
  }
}

export default function ActivityTimelineModel(sequelize: Sequelize): typeof ActivityTimeline {
  ActivityTimeline.init(
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
      type: {
        type: DataTypes.ENUM(
          'campaign_launch',
          'email_sent',
          'social_post',
          'venue_booking',
          'contract_signed',
          'revenue_received',
          'expense_logged',
          'document_uploaded',
          'team_invite',
          'report_generated',
          'other'
        ),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 200],
        },
        comment: 'Short description of what happened',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000],
        },
        comment: 'Detailed description with context',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional data related to the activity (amounts, counts, references, etc.)',
      },
      relatedEntityType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Type of related entity (e.g., "campaign", "venue", "revenue_stream")',
      },
      relatedEntityId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'ID of the related entity',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium',
      },
      status: {
        type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
        allowNull: false,
        defaultValue: 'info',
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether this activity is visible to all team members',
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
      modelName: 'ActivityTimeline',
      tableName: 'activity_timeline',
      timestamps: true,
      indexes: [
        {
          fields: ['artistId'],
        },
        {
          fields: ['createdBy'],
        },
        {
          fields: ['type'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['priority'],
        },
        {
          fields: ['isPublic'],
        },
        {
          fields: ['createdAt'],
        },
        {
          fields: ['relatedEntityType', 'relatedEntityId'],
        },
        // Composite indexes for common queries
        {
          fields: ['artistId', 'createdAt'],
        },
        {
          fields: ['artistId', 'type'],
        },
        {
          fields: ['artistId', 'isPublic'],
        },
      ],
      hooks: {
        beforeCreate: async (activity: ActivityTimeline) => {
          // Auto-set status based on type
          if (activity.type === 'revenue_received') {
            activity.status = 'success';
          } else if (activity.type === 'expense_logged') {
            activity.status = 'warning';
          } else if (activity.type === 'contract_signed') {
            activity.status = 'success';
            activity.priority = 'high';
          }
        },
      },
    }
  );

  return ActivityTimeline;
}