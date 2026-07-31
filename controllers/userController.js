const binarySearchById = require("../utils/binarySearchById");
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

async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);

    const users = await readUsers();

    const index = binarySearchById(users, id);

    if (index === -1) {
      return res.status(404).json({
        message: "User ID not found.",
      });
    }

    const updatedData = req.body;

    if (
      updatedData.email &&
      users.some(
        (user) =>
          user.email === updatedData.email && user.id !== users[index].id,
      )
    ) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    users[index] = {
      ...users[index],
      ...updatedData,
      id,
    };

    await writeUsers(users);

    return res.status(200).json({
      message: "User updated successfully.",
      user: users[index],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const users = await readUsers();

    const index = binarySearchById(users, Number(id));

    if (index === -1) {
      return res.status(404).json({
        message: "User ID not found.",
      });
    }

    users.splice(index, 1);

    await writeUsers(users);

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

async function getUserByName(req, res) {
  try {
    const { name } = req.query;

    if (name) {
      const users = await readUsers();

      const user = users.find(
        (user) => user.name.toLowerCase() === name.toLowerCase(),
      );

      if (!user) {
        return res.status(404).json({
          message: "User name not found.",
        });
      }

      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await readUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

async function filterUsersByMinAge(req, res) {
  try {
    const minAge = Number(req.query.minAge);

    if (minAge) {
      const users = await readUsers();

      const filteredUsers = users.filter((user) => Number(user.age) >= minAge);

      if (filteredUsers.length === 0) {
        return res.status(404).json({
          message: "No users found.",
        });
      }

      return res.status(200).json(filteredUsers);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUserByName,
  getAllUsers,
  filterUsersByMinAge,
};
