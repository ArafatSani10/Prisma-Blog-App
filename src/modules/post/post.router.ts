import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";
const router = express.Router();



router.post(
    "/",
    auth(UserRole.USER),
    PostController.createPost
)
export const PostRouter = router;