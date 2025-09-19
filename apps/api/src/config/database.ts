import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = path.join(__dirname, '../../database/artisthub.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

export default sequelize;