import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

const createPost = async (req: Request, res: Response) => {

    try {
        const user = req.user
        if (!req.user) {
            return res.status(400).json({
                error: "Unauthorized!!!"
            })
        }
        const result = await PostService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    }

    catch (err) {
        res.status(400).json({
            error: "post creadential failed!",
            details: err
        })
    }

}

export const PostController = {
    createPost
}