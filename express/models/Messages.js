import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Messages',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      conversation_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // UUID 自動生成
        comment: '唯一識別碼',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '留言',
      },
      sender_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '發送人 ID',
      },
      sender_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '發送人 名稱',
      },
      accept_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '接收人_id',
      },
      accept_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '接收人 名稱',
      },
      sent_at: {
        type: DataTypes.DATE, // 訊息發送時間
        allowNull: true,
        defaultValue: DataTypes.NOW, // 預設為當前時間
        comment: '訊息發送時間',
      },
    },
    {
      tableName: 'messages', // 指定表單名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 使用 snake_case 命名欄位
      createdAt: 'created_at', // 自訂建立時間欄位名稱
      updatedAt: 'updated_at', // 自訂更新時間欄位名稱
    }
  )
}
