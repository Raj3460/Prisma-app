// !  firstly i have work router file to setup express server  and test the connection with prisma


//! first i have to done post.router.ts file

import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.send("create a new post");
});

export const postRouter = router;
