const readUsers = require("../utils/readUsers");
const writeUsers = require("../utils/writeUsers");

async function createUser(req, res) {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || age === undefined) {
      return res.status(400).json({
        message: "Name, email and age are required!",
      });
    }

    const users = await readUsers();
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (emailExists) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const newUser = {
      id: users.length > 0 ? users.at(-1).id + 1 : 1,
      name,
      email,
      age,
    };

    users.push(newUser);

    await writeUsers(users);

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  createUser,
};
