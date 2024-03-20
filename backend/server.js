const express = require("express");
const app = express();
const zod = require("zod");
const { v4: uuidv4 } = require("uuid");
const { User } = require("./db");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const JWT_SECRET = "ayush";
app.use(cors());
app.use(express.json());
// const { authMiddleware } = require("../middleware");
const mySchema = zod.object({
  email: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});
const signSchema = zod.object({
  email: zod.string(),
  password: zod.string(),
});
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
app.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = mySchema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "incorrect inputs",
    });
  }
  const user = User.findOne({
    username: body.username,
  });

  if (user._id) {
    return res.json({
      message: "email aready registered",
    });
  }
  const token = uuidv4();
  body.accessToken = token;
  console.log(body);
  const dbUser = await User.create(body);
  if (dbUser) {
    res.json({
      message: "user created",
      token: token,
    });
  } else {
    res.json({ error: "something went wrong" });
  }
});
app.post("/signin", async (req, res) => {
  const data = req.body;
  console.log({ data });
  const { success } = signSchema.safeParse(data);
  if (!success) {
    return res.json({
      message: "wrong inputs",
    });
  }
  const user = await User.findOne({
    email: data.email,
  });
  console.log(user);
  if (!user) {
    res.json({ error: "User Not Registered" });
  }

  if (user?.password === data?.password) {
    const accessToken = uuidv4();
    const updated = await User.updateOne({ accessToken: accessToken });
    if (updated) {
      res
        .status(200)
        .json({ message: "Successfully LoggedIn", accessToken: accessToken });
    }
    return;
  } else {
    res.status(411).json({
      message: "login failed",
    });
  }
});
// app.put("/", authMiddleware, async (req, res) => {
//   const { success } = updateBody.safeParse(req.body);
//   if (!success) {
//     res.status(411).json({
//       message: "error while updating  info ",
//     });
//   }
//   await User.updateOne({ _id: req.userId }, req.body);
//   res.json({
//     message: "update successfully",
//   });
// });
// app.get("/bulk", async (req, res) => {
//   const filter = req.query.filter || "";

//   const users = await User.find({
//     $or: [
//       {
//         firstName: {
//           $regex: filter,
//         },
//       },
//       {
//         lastName: {
//           $regex: filter,
//         },
//       },
//     ],
//   });

//   res.json({
//     user: users.map((user) => ({
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       _id: user._id,
//     })),
//   });
// });
app.get("/", (req, res) => {
  res.json({ success: true });
});

app.listen("3000", (res, req) => {
  console.log("conneted to 3000");
});
