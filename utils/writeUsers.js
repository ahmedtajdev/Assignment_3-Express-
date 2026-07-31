const path = require("node:path");
const fs = require("node:fs/promises");

const filePath = path.resolve("users.json");

async function writeUsers(users) {
  await fs.writeFile(filePath, JSON.stringify(users));
}
module.exports = writeUsers;
