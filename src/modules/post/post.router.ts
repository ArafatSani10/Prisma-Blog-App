import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";
const router = express.Router();


router.post(
    "/",
    auth(UserRole.USER),
    PostController.createPost
);

router.get("/", PostController.getAllPost)
export const PostRouter = router;