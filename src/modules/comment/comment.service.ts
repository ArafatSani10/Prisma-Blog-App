import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string; // এটা অপশনাল হিসেবে আসছে
}) => {
    try {
        const result = await prisma.comment.create({
            data: {
                content: payload.content,
                authorId: payload.authorId,
                postId: payload.postId,
                // আপনার স্কিমা যেহেতু parentId রিকোয়ার্ড করে, তাই যদি parentId না থাকে 
                // তবে এটি এরর দিবে। স্কিমা চেঞ্জ না করলে এখানে অন্তত একটি 
                // আইডি (id) থাকতেই হবে।
                parentId: payload.parentId as string, 
            }
        });
        return result;
    } catch (error) {
        console.error("Prisma Create Error:", error);
        throw error;
    }
}

export const CommentService = {
    createComment
}