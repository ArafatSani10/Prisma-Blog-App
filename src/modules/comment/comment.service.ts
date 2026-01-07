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
}

export const CommentService = {
    createComment
}