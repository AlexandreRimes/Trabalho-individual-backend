import e, { Request, Response } from "express";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { cp } from "node:fs";
import auth from "../config/auth"
import { request } from "node:http";
import { UserUpdateInput } from "../generated/prisma/models";
import { PrismaPg } from '@prisma/adapter-pg'; 

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });


export class UserController{


    public static async createUser(req:Request, resp:Response){
        try{

            const {name,email,cpf,phoneNumber,password} = req.body

            const {hash,salt} = auth.generatePassword(password)
                const createData = {

                    name,
                    email,
                    cpf,
                    phoneNumber,
                    hash,
                    salt,
                };

            const createdUser = await prisma.user.create({data:createData})
            return resp.status(201).json({Message:"Usuariario criado com sucesso ",id:createdUser})    

        }
        catch(error:any){
            return resp.status(500).json({message:error.message});
        }

    }



    public static async readAllUsers(req:Request, resp:Response){
        try{    
            const users = await prisma.user.findMany()

            return resp.status(200).json(users);

        }
        catch(error:any){
            return resp.status(500).json({message:error.message});
        }
    }



    public static async readUser(req:Request, resp:Response){
        try{
            const {userId} = req.params
            const foundUser = await prisma.user.findUnique({
                where:{
                    id:String(userId)
                }
            })

            if(!foundUser){
                return resp.status(404).json({ message: "Usuário não encontrado" });
            }

            return resp.status(200).json(foundUser);

        }
        catch(error:any){
            return resp.status(500).json({message:error.message});
        }
    }
    


    public static async updateUser(req:Request, resp:Response){
        try{
            const {userId} = req.params;
            const {name,email,cpf,phoneNumber,password} = req.body


            let passwordData = {};

            if(password){
                const {hash,salt} = auth.generatePassword(password)
                passwordData = {hash,salt}
            }

            
            const updateInput : UserUpdateInput ={
                name,
                email,
                cpf,
                phoneNumber,
                ...passwordData
            };

            const updatedUser = await prisma.user.update({
                where:{ 
                    id:String(userId)
                },

                data:updateInput,
                select:{
                    name:true,
                    email:true,
                    cpf:true,
                    phoneNumber:true,
                }
            });
            return resp.status(200).json({
            message: "Usuário atualizado com sucesso",
            user: updatedUser
        });

        }catch(error:any){

            if (error.code === 'P2025'){
                return resp.status(404).json({ message: "Usuário não encontrado para deleção" });
            }
                return resp.status(404).json({message:error.message});
        }

    }

    public static async deleteUser(req:Request, resp:Response){
        
        try{
            const {userId} = req.params
            
            const deletedUser = await prisma.user.delete({
                where:{ 
                    id:String(userId)
                }
            });
        
            return resp.status(200).json({ 
            message: "Usuário deletado com sucesso",
        });

        }catch(error:any){
            if(error.code === 'P2025'){
                return resp.status(404).json({ message: "Usuário não encontrado" });
            }
                return resp.status(500).json({message:error.message});
        }
        
    }


    public static async login(req:Request, resp:Response){
        try{
            const {password,email} = req.body
            const user = await prisma.user.findUnique({
                where: {email: email} 
            });

            if(!user){
                return resp.status(404).json({ message: "Usuário não encontrado" });
            }
            if(auth.checkPassword(password,user.hash,user.salt)){
                const token = auth.generateJWT(Number(user.id));
                return resp.status(200).json({token:token})
            }
            
            return resp.status(401).json({message:"Senha ou email incorretos"});

        }
        catch(error:any){
            return resp.status(500).json({message:error.message})
        }
    }
     
}