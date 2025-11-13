export default (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      accountNumber: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
      },
      accountCode: { type: DataTypes.STRING(50) },
      balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      prevBalance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      accountType: {
        type: DataTypes.ENUM("SAVINGS", "DAILY_DEPOSIT"),
        allowNull: false,
      },
    },
    {
      tableName: "accounts",
      timestamps: true,
    }
  );

  return Account;
};
