const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");

const initializer = {};

initializer.createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "author" }).save(),
      new Role({ name: "administrator" }).save(),
    ]);

    console.log("Roles Created!");
  } catch (error) {
    console.error(error);
  }
};

initializer.createAdmin = async () => {
  // check for an existing admin user
  const user = await User.findOne({ email1: "admin@ingenio.com" });
  // get roles _id
  const roles = await Role.find({
    name: { $in: ["administrator", "author", "user"] },
  });

  if (!user) {
    // create a new admin user
    await User.create({
      firstName: "admin",
      lastName: "admin",
      email1: "admin@ingenio.com",
      password: await bcrypt.hash("Admin@123", 10),
      roles: roles.map((role) => role._id),
    });
    console.log("Admin User Created!");
  }
};

module.exports = initializer;
