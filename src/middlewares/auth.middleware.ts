import auth from "../config/auth";
import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });


export async function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            response.status(401).json({ message: "Token não fornecido" });
            return; 
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            response.status(401).json({ message: "Token mal formatado ou ausente" });
            return;
        }

        const decodedToken = auth.decodeJWT(token) as unknown as { sub:{ id: string }};

        const user = await prisma.user.findUnique({
            where: {
                id: String(decodedToken.sub.id),
            },
        });

        if (!user) {
            response.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        (request as any).user = user;

        next();
        
    } catch (error: any){
        response.status(401).json({ message: "Token inválido ou expirado" });
    }
}