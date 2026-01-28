import "@dotenvx/dotenvx/config";
import express from "express";
import mongoose from "mongoose";

const { MONGO_DB_URL, PORT } = process.env;

const app = express();

const userModel = mongoose.model("users", {
  username: String,
  password: String,
  email: String,
  dob: Date,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/users/register", (req, res) => {
  const { username, password, email, dob } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      message: "Username, password and mail are required.",
    });
  }

  const user = new userModel({
    username,
    password,
    email,
    dob,
  });

  user.save().then(() => {
    res.status(201).json({
      message: "User registered successfully",
    });
  });
});

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error,
    });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const users = await userModel.findById(req.params.id);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error,
    });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, dob } = req.body;

  try {
    const User = await userModel.findByIdAndUpdate(
      id,
      {
        username,
        email,
        dob,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      message: "User updated successfully",
      User,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
});

app.listen(PORT, async () => {
  await mongoose.connect(MONGO_DB_URL).then(() => {
    console.info("Connected to MongoDB");
  });

  console.info(`Server is running on http://localhost:${PORT}`);
});
