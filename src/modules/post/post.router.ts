// !  firstly i have work router file to setup express server  and test the connection with prisma
//! first i have to done post.router.ts file
//! this is make sure that the path is correct

import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth as betterAuth} from "../../lib/auth";

const router = express.Router();


// type fro role
export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

// global type
declare global{
       namespace Express{
              interface Request{
                     user?: {
                            id: string;
                            email: string;
                            name: string;
                            role: string;
                            emailVerified: boolean;
                     }
              }
       }
}

//add middleware
const auth = (...roles: UserRole[]) =>{
       return async( req :Request, res :Response, next:NextFunction) => {

              //! ***middleware logic
              // get user session
              const session = await betterAuth.api.getSession({
                     headers: req.headers as any,
              })

              if(!session){
                     return res.status(401).json({
                            success : false,
                            message: "Unauthorized"
                     })
              }

              if(!session.user.emailVerified){
                     return res.status(403).json({
                            success : false,
                            message: "Please verify your email to access this resource"
                     })
              }


              req.user = {
                     id: session.user.id,
                     email: session.user.email!,
                     name: session.user.name!,
                     role: session.user.role as string,
                     emailVerified: session.user.emailVerified,
              }

              if(roles.length && !roles.includes(req.user.role as UserRole)){
                     return res.status(403).json({
                            success : false,
                            message: "Forbidden"
                     })
              }

              next();

}
}

router.post(
       "/", auth( UserRole.USER), PostController.createPost
)

export const postRouter = router;
