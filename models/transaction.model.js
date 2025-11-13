export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      agent_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      account_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      loan_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      mode: { type: DataTypes.ENUM("CASH", "UPI"), allowNull: false },
    },
    {
      tableName: "transactions",
      timestamps: true,
    }
  );

  return Transaction;
};
