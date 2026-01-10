import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction) {

    let statusCode = 500;
    let errorMessage = "internal error";
    let errorDetails = err;


    // prismaClientValidationError

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "Your prived incorrect field type or  missing fields!"
    }

    // PrismaClientKnownRequestError

    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 400;
            errorMessage = "An operation failed because it depends on one or more records that were required but not found.!"
        }

        else if (err.code === "P2002") {
            statusCode = 400;
            errorMessage = "Duplicate key Error"
        }

        else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key contraint failed!"
        }
    }


    // PrismaClientUnknownRequestError

    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Error ocurred during query excustion"
    }


    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Authentication failed.please check your credit "
        }

        else if (err.errorCode === "P1001") {
            statusCode = 400;
            errorMessage = "can't reach database server"
        }
    }
    res.status(statusCode)
    res.json({
        message: errorMessage,
        error: errorDetails
    })
}


export default errorHandler;