
//! service is work on the logic of the application

import { Post } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const cratePost = async (data : Omit<Post, "id" | "createdAt" | "updatedAt">) =>{
       const result = await prisma.post.create({
              data
       })
       return result;
}


export const postService = {
       cratePost
};