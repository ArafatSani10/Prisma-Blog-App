import { Request, Response } from "express";
import { CommentService } from "./comment.service";
import { CommentStatus } from "../../../generated/prisma/enums";

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


const getCommentById = async (req: Request, res: Response) => {
    try {

        const { commentId } = req.params;
        const result = await CommentService.getCommentById(commentId as string);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Comment  fetched    failed!",
            details: err.message || err
        });
    }
};


const getCommentByAuthorId = async (req: Request, res: Response) => {
    try {

        const { authorId } = req.params;
        const result = await CommentService.getCommentByAuthorId(authorId as string);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Comment  fetched    failed!",
            details: err.message || err
        });
    }
};



const deleteComment = async (req: Request, res: Response) => {
    try {


        const user = req.user;
        const { commentId } = req.params
        const result = await CommentService.deleteComment(commentId as string, user?.id as string);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Comment  delete    failed!",
            details: err.message || err
        });
    }
};



const updateComment = async (req: Request, res: Response) => {
    try {


        const user = req.user;
        const { commentId } = req.params
        const result = await CommentService.updateComment(commentId as string, req.body,  user?.id as string);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Comment  update    failed!",
            details: err.message || err
        });
    }
};


const moderateComment = async (req: Request, res: Response) => {
    try {


        const {commentId} = req.params;

        
        const result = await CommentService.moderateComment(commentId as string,  req.body);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Comment  update    failed!",
            details: err.message || err
        });
    }
};




export const CommentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
}