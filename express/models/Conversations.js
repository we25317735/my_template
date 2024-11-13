import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Conversations',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // conversation_id 作為外鍵，非主鍵
      conversation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        comment: '找訊息依據',
      },
      user_id_1: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '1號使用者 id',
      },
      user_id_2: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '2號使用者 id',
      },
      first_opened_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '最初開啟對話的時間',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'conversations',
      timestamps: true,
      paranoid: false,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
}
