

//! controllers basically handles requests and responses for all data related to posts

import { Request, Response } from "express";
import { postService } from "./post.service";


//! create post controller
const createPost = async (req : Request, res : Response) => {
      try {
      const result = await postService.cratePost(req.body);
      res.status(201).json({
            success: true,
            data: result
      });
      } catch (error) {
       res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error instanceof Error ? error.message : String(error)
       });
      }
}


export const PostController = {
    createPost
};