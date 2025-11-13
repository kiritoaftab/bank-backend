export default (sequelize, DataTypes) => {
  const Agent = sequelize.define(
    "Agent",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      dob: { type: DataTypes.DATE },
      aadhaarNumber: { type: DataTypes.STRING(20) },
      aadhaarImage: { type: DataTypes.STRING(255) },
      panNo: { type: DataTypes.STRING(20) },
      panImage: { type: DataTypes.STRING(255) },
      address: { type: DataTypes.TEXT },
    },
    {
      tableName: "agents",
      timestamps: true,
    }
  );

  return Agent;
};
