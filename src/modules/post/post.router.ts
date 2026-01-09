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
    "/stats",
    auth(UserRole.ADMIN),
    PostController.getStats
)


router.get(
    "/my-posts",
    auth(UserRole.USER, UserRole.ADMIN),
    PostController.getMyPosts
);

router.get(
    "/:postId",
    PostController.getPostById
);

router.patch(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    PostController.UpdateMyPosts

);

router.delete(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    PostController.deletePost
)




export const PostRouter = router;