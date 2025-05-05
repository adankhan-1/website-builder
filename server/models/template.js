import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  tableName: 'templates',
  underscored: true,
  timestamps: true,
});

export default Template;