export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: { type: DataTypes.STRING(100), allowNull: false },
      lastName: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150) },
      phone: { type: DataTypes.STRING(20), unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: {
        type: DataTypes.ENUM("ADMIN", "MANAGER", "STAFF", "CUSTOMER", "AGENT"),
        allowNull: false,
        defaultValue: "CUSTOMER",
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
