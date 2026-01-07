import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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
        const searchString = typeof search === "string" ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === "true"
                ? true
                : req.query.isFeatured === "false" ? false : undefined
            : undefined

        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined



        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
        const result = await PostService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder })
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

const getPostById = async (req: Request, res: Response) => {
    try {

        const { postId } = req.params;
        console.log({ postId })
        if (!postId) {
            throw new Error("Post id is required..")
        }
        const result = await PostService.getPostById(postId);
        res.status(200).json(result)


    }

    catch (err: any) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch posts!",
            details: err.message || err
        });
    }
};

export const PostController = {
    createPost,
    getAllPost,
    getPostById
};