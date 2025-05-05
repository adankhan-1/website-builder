'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('templates', 'thumbnail_url');

  await queryInterface.addColumn('templates', 'thumbnail', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('templates', 'thumbnail');

  await queryInterface.addColumn('templates', 'thumbnail_url', {
    type: Sequelize.STRING(255),
    allowNull: true,
  });
}
