

//! it basically handles requests and responses for all data related to posts

import { Request, Response } from "express";

const createPost = async (req : Request, res : Response) => {
       res.send("create a new post from controller");
       console.log({req, res});
}


export const PostController = {
    createPost
};