import express from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";
const router = express.Router();


router.post(
    "/",
    auth(UserRole.USER, UserRole.ADMIN),
    PostController.createPost
);

router.get("/",
    PostController.getAllPost
);


router.get(
    "/my-posts",
    auth(UserRole.USER, UserRole.ADMIN),
    PostController.getMyPosts
);

router.get("/:postId",
    PostController.getPostById
);




export const PostRouter = router;