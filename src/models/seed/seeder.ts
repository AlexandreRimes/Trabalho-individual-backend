import { Prisma, PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'; 
import {UserSeeder} from "./userSeeder"


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main(){

        await prisma.$connect()

        UserSeeder(prisma,20)
}


main()
    .then(async() =>{

            await prisma.$disconnect()

    })
    .catch(async(e:any)=>{
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })