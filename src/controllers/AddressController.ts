import e, { Request, Response } from "express";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { cp } from "node:fs";
import auth from "../config/auth"
import { request } from "node:http";
import { UserUpdateInput } from "../generated/prisma/models";

const prisma = new PrismaClient({} as any);

class AddressController{
    
    public static async createAddress(req: Request, resp: Response){

        try{
            const{zipCode, street, number, complement, neighborhood, city, state, userId} = req.body;

            const createdAddress = await prisma.address.create({
                data:{

                    zipCode,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state,
                    userId

                }
            });

            return resp.status(201).json({
                message: "Endereço criado",
                address: createdAddress
            });

        }
        catch (error:any){
            return resp.status(500).json({ message: error.message });
        }

    }

    public static async readAllAddresses(req: Request, resp: Response){
        
        try{

            const addresses = await prisma.address.findMany();

            return resp.status(200).json(addresses);

        }
        catch (error:any){
            return resp.status(500).json({message: error.message});
        }

    }

    public static async readAddress(req: Request, resp: Response){

        try{
            const {id} = req.params;

            const foundAddress = await prisma.address.findUnique({
                where:{
                    id: Number(id)
                }
            });

            if(!foundAddress){
                return resp.status(404).json({message: "Endereço não encontrado"});
            }

            return resp.status(200).json(foundAddress);

        }
        catch(error:any){
            return resp.status(500).json({ message: error.message });
        }

    }

    public static async updateAddress(req:Request, resp:Response){

        try{
            const {id} = req.params;
            const {zipCode, street, number, complement, neighborhood, city, state} = req.body;

            const updatedAddress = await prisma.address.update({
                where:{
                    id: Number(id)
                },
                data:{
                    zipCode,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state
                }
            });

            return resp.status(200).json({
                message: "Endereço atualizado",
                address: updatedAddress
            });

        }
        catch(error:any){
            if(error.code === 'P2025'){
                return resp.status(404).json({ message: "Endereço não encontrado para atualização"});
            }
            return resp.status(500).json({ message: error.message});
        }

    }

    public static async deleteAddress(req:Request, resp:Response){

        try{
            const {id} = req.params;

            await prisma.address.delete({
                where:{
                    id: Number(id)
                }
            });

            return resp.status(200).json({
                message: "Endereço deletado com sucesso"
            });

        }
        catch(error:any){
            if(error.code === 'P2025'){
                return resp.status(404).json({ message: "Endereço não encontrado para deleção" });
            }
            return resp.status(500).json({ message: error.message });
        }

    }
}