import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {

        const user = req.user;
        req.body.authorId = user?.id;
        const result = await CommentService.createComment(req.body);

        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Comment  creation failed!",
            details: err.message || err
        });
    }
};

export const CommentController = {
    createComment
}