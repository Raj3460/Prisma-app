// !  firstly i have work router file to setup express server  and test the connection with prisma


//! first i have to done post.router.ts file
//! this is make sure that the path is correct

import express from "express";
import { PostController } from "./post.controller";

const router = express.Router();

router.post(
       "/", PostController.createPost
)

export const postRouter = router;
