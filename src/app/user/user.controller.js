const express = require("express");
const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUserById,
  editUserById,
} = require("./user.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await getAllUsers();

  res.send(users);
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(parseInt(userId));

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const newUserData = req.body;
  const user = await createUser(newUserData);

  res.send({
    data: user,
    message: "create User success",
  });
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await deleteUserById(parseInt(userId));
    res.send("User Deleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    const user = await editUserById(parseInt(userId), userData);

    res.send({
      data: user,
      message: "edit data success",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  if (
    !(
      userData.title &&
      userData.description &&
      userData.price &&
      userData.category&&
      userData.image
    )
  ) {
    return res.status(400).send("some fields are missing !")
  }

  const user = await editUserById(parseInt(userId), userData)

  res.send({
    data: user,
    message: "edit data success",
  })
})

module.exports = router;
