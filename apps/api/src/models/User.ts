import { DataTypes, Model, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'artist' | 'marketing_manager' | 'tour_manager' | 'album_manager' | 'financial_manager' | 'press_officer' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  avatar?: string;
  phone?: string;
  timezone: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public password!: string;
  public role!: 'artist' | 'marketing_manager' | 'tour_manager' | 'album_manager' | 'financial_manager' | 'press_officer' | 'admin';
  public isActive!: boolean;
  public isEmailVerified!: boolean;
  public emailVerificationToken?: string;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
  public avatar?: string;
  public phone?: string;
  public timezone!: string;
  public lastLoginAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual fields
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Instance methods
  public toJSON(): object {
    const values = { ...this.get() };
    delete values.password;
    delete values.emailVerificationToken;
    delete values.passwordResetToken;
    return values;
  }
}

export default function UserModel(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 255],
        },
      },
      role: {
        type: DataTypes.ENUM('artist', 'marketing_manager', 'tour_manager', 'album_manager', 'financial_manager', 'press_officer', 'admin'),
        allowNull: false,
        defaultValue: 'artist',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[\+]?[1-9][\d]{0,15}$/,
        },
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'UTC',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          fields: ['role'],
        },
        {
          fields: ['isActive'],
        },
        {
          fields: ['createdAt'],
        },
      ],
      hooks: {
        beforeCreate: async (user: User) => {
          // Password hashing will be handled in the service layer
          user.email = user.email.toLowerCase();
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('email')) {
            user.email = user.email.toLowerCase();
          }
        },
      },
    }
  );

  return User;
}