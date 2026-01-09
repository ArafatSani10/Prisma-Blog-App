import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { commentRouter } from "./comment.router";

const createComment = async (payload: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}) => {
    try {
        // 1. Post ache ki na check kora
        await prisma.post.findUniqueOrThrow({
            where: { id: payload.postId }
        });

        // 2. Jodi parentId thake (mane reply hoy), tobe parent comment check kora
        if (payload.parentId) {
            await prisma.comment.findUniqueOrThrow({
                where: { id: payload.parentId }
            });
        }

        // 3. Comment create kora ebong result-ti variable-e rakha
        const result = await prisma.comment.create({
            data: {
                content: payload.content,
                authorId: payload.authorId,
                postId: payload.postId,
                parentId: payload.parentId, // Prisma undefined hole eta ignore korbe
            }
        });

        return result; // Ekhon result pawa jabe
    } catch (error) {
        console.error("Prisma Create Error:", error);
        throw error;
    }
};


const getCommentById = async (commentId: string) => {
    console.log("Searching for Comment ID:", commentId); // Check korun ID ashole ki ashche

    const result = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    });

    console.log("Database Result:", result);
    return result;
};

const getCommentByAuthorId = async (authorId: string) => {

    return await prisma.comment.findMany({
        where: {
            authorId
        },

        orderBy: { createdAt: "desc" },

        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
};

const deleteComment = async (commentId: string, authorId: string) => {

    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },

        select: {
            id: true
        }
    });


    if (!commentData) {
        throw new Error("your provider input is invalid..")
    }

    const result = await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    });
    return result;
}

const updateComment = async (
    commentId: string,
    data: { content?: string, status?: CommentStatus },
    authorId: string
) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    });

    if (!commentData) {
        throw new Error("Your provided input is invalid.");
    }

    return await prisma.comment.update({
        where: {
            id: commentId
        },
        data
    });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
    // 1. Age comment-ti khuje ber koren check korar jonno
    const existingComment = await prisma.comment.findUnique({
        where: { id }
    });

    if (!existingComment) {
        throw new Error("Comment not found!");
    }

    // 2. Ekhon check koren status ager thekei same kina
    if (existingComment.status === data.status) {
        throw new Error(`Your provided status (${data.status}) is already up to date.`);
    }

    // 3. Jodi status different hoy, tobe update koren ebong return koren
    return await prisma.comment.update({
        where: { id },
        data
    });
};


export const CommentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateComment
};




