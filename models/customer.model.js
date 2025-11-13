export default (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.INTEGER.UNSIGNED },
      dob: { type: DataTypes.DATE },
      aadhaarNumber: { type: DataTypes.STRING(20) },
      aadhaarImage: { type: DataTypes.STRING(255) },
      panNo: { type: DataTypes.STRING(20) },
      panImage: { type: DataTypes.STRING(255) },
      address: { type: DataTypes.TEXT },
      agent_id: { type: DataTypes.INTEGER.UNSIGNED },
    },
    {
      tableName: "customers",
      timestamps: true,
    }
  );

  return Customer;
};
