import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router: Router = express.Router();
router.post(
    "/",
    auth(UserRole.USER, UserRole.ADMIN),
    CommentController.createComment);

router.get(
    "/:commentId",
    CommentController.getCommentById);

router.get(
    "/author/:authorId",
    CommentController.getCommentByAuthorId)



router.delete(
    "/:commentId",
    auth(UserRole.USER, UserRole.ADMIN), 
    CommentController.deleteComment
);
router.patch(
    "/:commentId",
    auth(UserRole.USER, UserRole.ADMIN),
    CommentController.updateComment
);

export const commentRouter: Router = router;