import { totalmem } from "node:os";
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { tuple } from "better-auth/*";

const createPost = async (
    data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>,
    userId: string
) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });

    return result;
};

const getAllPost = async ({
    search,
    tags,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}:
    {
        search: string | undefined,
        tags: string[] | [],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined,
        page: number,
        limit: number,
        skip: number,
        sortBy: string | undefined,
        sortOrder: string | undefined
    }) => {

    const andCondition: PostWhereInput[] = []
    if (search) {
        andCondition.push(
            {
                OR: [

                    {
                        title: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },

                    {
                        tags: {
                            has: search,
                        }
                    }
                ]
            },
        )
    }


    if (tags.length > 0) {
        andCondition.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }

    if (typeof isFeatured === "boolean") {
        andCondition.push({
            isFeatured
        })
    }


    if (status) {
        andCondition.push({
            status
        })
    }

    if (authorId) {
        andCondition.push({
            authorId
        })
    }




    const allpost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andCondition
        },

        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder

        } : { createAt: "desc" },

        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }


    });


    const total = await prisma.post.count({
        where: {
            AND: andCondition
        }
    })
    return {
        data: allpost,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getPostById = async (postId: string) => {

    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })

        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },

                    orderBy: { createdAt: "desc" },
                    include: {
                        replies: {

                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: { createdAt: "asc" },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED
                                    },
                                    orderBy: { createdAt: "asc" },
                                }
                            }
                        }
                    }
                },

                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        })

        return postData;
    })

    return result;

};


const getMyPosts = async (authorId: string) => {

    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        },
        select: {
            id: true,

        }
    });



    const result = await prisma.post.findMany({
        where: {
            authorId
        },

        orderBy: {
            createAt: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true,

                }
            }
        }
    });

    const total = await prisma.post.aggregate({
        _count: {
            id: true
        },

        where: {
            authorId
        }
    })

    return {
        data: result,
        total
    };
};



// aikhane user sudhu tar nijer post update korte parbe but isFeatured update korte parbe na
// onnodike admin sobar post update korte parbe 

const UpdateMyPosts = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },

        select: {
            id: true,
            authorId: true
        }
    });


    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("you are not the owner/creator of the posts!!");
    }


    if (!isAdmin) {
        delete data.isFeatured
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id
        },
        data
    });

    return result;
};


// user tarr nijer post delete korte parbe and admin sobar post delete diye dete parbe


const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },

        select: {
            id: true,
            authorId: true
        }
    });


    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("you are not the owner/creator of the posts!!");
    };


    return await prisma.post.delete({
        where: {
            id: postId
        }
    });

};


const getStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const [totalPosts, publishedPost, draftPost, archivedPost, totalComments, approvedComments] = await Promise.all([
            tx.post.count(),
            tx.post.count({
                where: { status: PostStatus.PUBLISHED }
            }),
            tx.post.count({
                where: { status: PostStatus.DRAFT }
            }),
            tx.post.count({
                where: { status: PostStatus.ARCHIVED }
            }),

            tx.comment.count(),
            tx.comment.count({
                where: {
                    status: CommentStatus.APPROVED
                }
            })
        ]);

        return {
            totalPosts,
            publishedPost,
            draftPost,
            archivedPost,
            totalComments,
            approvedComments
        };
    });
};



export const PostService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    UpdateMyPosts,
    deletePost,
    getStats
};