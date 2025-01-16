import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
var router = express.Router();

router.post("/", async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    res.send();
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      slug: (username as string).toLowerCase(),
      password: password as string,
    },
  });

  if (!user) {
    res.status(401);
    res.send();
    return;
  }

  if (!process.env.TOKEN_SECRET) {
    res.status(500);
    res.send();
    return;
  }

  const token = jwt.sign({ name: user.slug }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });

  res.json(token);
});

export default router;
