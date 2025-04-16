import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';
import User from './user.js';
import Template from './template.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  tableName: 'projects',
  underscored: true,
  timestamps: true,
});

Project.belongsTo(User, { foreignKey: 'user_id' });
Project.belongsTo(Template, { foreignKey: 'template_id' });

export default Project;
