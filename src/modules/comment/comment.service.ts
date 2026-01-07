import { prisma } from "../../lib/prisma";

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
        where:{
            id:commentId,
            authorId
        },

        select:{
            id:true
        }
    });


    if(!commentData){
        throw new Error("your provider input is invalid..")
    }

    const result = await prisma.comment.delete({
        where:{
            id:commentData.id
        }
    });
    return result;
}

export const CommentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment
}