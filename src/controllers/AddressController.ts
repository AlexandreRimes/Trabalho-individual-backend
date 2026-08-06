import e, { Request, Response } from "express";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import auth from "../config/auth"
import { UserUpdateInput } from "../generated/prisma/models";
import { PrismaPg } from '@prisma/adapter-pg'; 
import strict from "node:assert/strict";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export class AddressController {
    
    public static async createAddress(req: Request, resp: Response){
        try{
            const { userId } = req.params; 
            const loggedUserId = String((req as any).user.id);

            if(userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            const { zipCode, street, number, complement, neighborhood, city, state } = req.body;

            const createdAddress = await prisma.address.create({
                data:{
                    zipCode,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state,
                    userId: String(userId)
                }
            });

            return resp.status(201).json({
                message: "Endereço criado",
                address: createdAddress
            });

        } 
        catch (error: any){
            return resp.status(500).json({ message: error.message });
        }
    }

    public static async readAllAddresses(req: Request, resp: Response){
        try{
            const {userId} = req.params;
            const loggedUserId = String((req as any).user.id);

            if(userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            const addresses = await prisma.address.findMany({
                where:{ userId: loggedUserId }
            });

            return resp.status(200).json(addresses);

        }
        catch(error: any){
            return resp.status(500).json({ message: error.message });
        }
    }

    public static async readAddress(req: Request, resp: Response){
        try{
            const {userId, id} = req.params;
            const loggedUserId = String((req as any).user.id);

            if(userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            const foundAddress = await prisma.address.findUnique({
                where:{ id: Number(id)}
            });

            if(!foundAddress){
                return resp.status(404).json({ message: "Endereço não encontrado" });
            }

            if(foundAddress.userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            return resp.status(200).json(foundAddress);

        } 
        catch(error: any){
            return resp.status(500).json({ message: error.message });
        }
    }

    public static async updateAddress(req: Request, resp: Response){
        try{
            const { userId, id } = req.params;
            const { zipCode, street, number, complement, neighborhood, city, state } = req.body;
            const loggedUserId = String((req as any).user.id);

            if(userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            const existingAddress = await prisma.address.findUnique({
                where: { id: Number(id) }
            });

            if(!existingAddress){
                return resp.status(404).json({ message: "Endereço não encontrado" });
            }

            if(existingAddress.userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            const updatedAddress = await prisma.address.update({
                where: { id: Number(id) },
                data: { zipCode, street, number, complement, neighborhood, city, state }
            });

            return resp.status(200).json({
                message: "Endereço atualizado",
                address: updatedAddress
            });

        }
        catch(error: any){
            return resp.status(500).json({ message: error.message });
        }
    }

    public static async deleteAddress(req: Request, resp: Response){
        try{
            const { userId, id } = req.params;
            const loggedUserId = String((req as any).user.id);

            if(userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            const existingAddress = await prisma.address.findUnique({
                where: { id: Number(id) }
            });

            if(!existingAddress){
                return resp.status(404).json({ message: "Endereço não encontrado" });
            }

            if(existingAddress.userId !== loggedUserId){
                return resp.status(403).json({ message: "Acesso negado." });
            }

            await prisma.address.delete({
                where: { id: Number(id) }
            });

            return resp.status(200).json({
                message: "Endereço deletado com sucesso"
            });

        }
        catch(error: any){
            if(error.code === 'P2025'){
                return resp.status(404).json({ message: "Endereço não encontrado" });
            }
            return resp.status(500).json({ message: error.message });
        }
    }
}