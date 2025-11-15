export default (sequelize, DataTypes) => {
  const Loan = sequelize.define(
    "Loan",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      accountType: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "LOAN",
      },
      accountNumber: { type: DataTypes.STRING(64), allowNull: false },
      accountCode: { type: DataTypes.STRING(50) },
      loanAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      pendingDue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      prevDue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      tableName: "loans",
      timestamps: true,
    }
  );

  return Loan;
};
