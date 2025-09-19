import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ArtistAttributes {
  id: string;
  userId: string;
  stageName: string;
  bio?: string;
  genre: string;
  website?: string;
  avatar?: string;
  banner?: string;
  spotifyId?: string;
  appleId?: string;
  youtubeId?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  twitterHandle?: string;
  facebookId?: string;
  location?: string;
  foundedYear?: number;
  isVerified: boolean;
  totalFollowers: number;
  totalStreams: number;
  totalRevenue: number;
  monthlyListeners: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtistCreationAttributes extends Omit<ArtistAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export class Artist extends Model<ArtistAttributes, ArtistCreationAttributes> implements ArtistAttributes {
  public id!: string;
  public userId!: string;
  public stageName!: string;
  public bio?: string;
  public genre!: string;
  public website?: string;
  public avatar?: string;
  public banner?: string;
  public spotifyId?: string;
  public appleId?: string;
  public youtubeId?: string;
  public instagramHandle?: string;
  public tiktokHandle?: string;
  public twitterHandle?: string;
  public facebookId?: string;
  public location?: string;
  public foundedYear?: number;
  public isVerified!: boolean;
  public totalFollowers!: number;
  public totalStreams!: number;
  public totalRevenue!: number;
  public monthlyListeners!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual fields
  public get socialLinks(): object {
    return {
      instagram: this.instagramHandle ? `https://instagram.com/${this.instagramHandle}` : null,
      tiktok: this.tiktokHandle ? `https://tiktok.com/@${this.tiktokHandle}` : null,
      twitter: this.twitterHandle ? `https://twitter.com/${this.twitterHandle}` : null,
      facebook: this.facebookId ? `https://facebook.com/${this.facebookId}` : null,
      spotify: this.spotifyId ? `https://open.spotify.com/artist/${this.spotifyId}` : null,
      youtube: this.youtubeId ? `https://youtube.com/channel/${this.youtubeId}` : null,
    };
  }

  public get formattedRevenue(): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(this.totalRevenue);
  }

  public get formattedFollowers(): string {
    if (this.totalFollowers >= 1000000) {
      return `${(this.totalFollowers / 1000000).toFixed(1)}M`;
    } else if (this.totalFollowers >= 1000) {
      return `${(this.totalFollowers / 1000).toFixed(1)}K`;
    }
    return this.totalFollowers.toString();
  }
}

export default function ArtistModel(sequelize: Sequelize): typeof Artist {
  Artist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      stageName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 100],
        },
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 2000],
        },
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Electronic',
        validate: {
          len: [2, 50],
        },
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      banner: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      spotifyId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      appleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      youtubeId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      instagramHandle: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          is: /^[a-zA-Z0-9._]+$/,
        },
      },
      tiktokHandle: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          is: /^[a-zA-Z0-9._]+$/,
        },
      },
      twitterHandle: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          is: /^[a-zA-Z0-9_]+$/,
        },
      },
      facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      foundedYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1900,
          max: new Date().getFullYear(),
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      totalFollowers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      totalStreams: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      totalRevenue: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      monthlyListeners: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
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
      modelName: 'Artist',
      tableName: 'artists',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['stageName'],
        },
        {
          unique: true,
          fields: ['userId'],
        },
        {
          fields: ['genre'],
        },
        {
          fields: ['totalFollowers'],
        },
        {
          fields: ['totalRevenue'],
        },
        {
          fields: ['isVerified'],
        },
        {
          fields: ['createdAt'],
        },
      ],
      hooks: {
        beforeSave: async (artist: Artist) => {
          // Normalize social handles
          if (artist.instagramHandle) {
            artist.instagramHandle = artist.instagramHandle.replace(/^@/, '');
          }
          if (artist.tiktokHandle) {
            artist.tiktokHandle = artist.tiktokHandle.replace(/^@/, '');
          }
          if (artist.twitterHandle) {
            artist.twitterHandle = artist.twitterHandle.replace(/^@/, '');
          }
        },
      },
    }
  );

  return Artist;
}