import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized!!!"
            });
        }

        const result = await PostService.createPost(req.body, user.id);

        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Post creation failed!",
            details: err.message || err
        });
    }
};

const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        console.log("search value:", search);
        const searchString = typeof search  === "string" ?  search :undefined
        const result = await PostService.getAllPost({search:searchString})
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch posts!",
            details: err.message || err
        });
    }
};

export const PostController = {
    createPost,
    getAllPost
};