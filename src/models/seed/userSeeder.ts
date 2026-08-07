import { PrismaClient } from "../../generated/prisma/client";
import { UserCreateInput } from "../../generated/prisma/models";
import { fakerPT_BR } from "@faker-js/faker";
import auth from "../../config/auth";

export async function UserSeeder(prisma: PrismaClient, numUsers: number){

    const hashedPassword = await auth.generatePassword("Senha123");

    let users: UserCreateInput[] = [];

    for(let i = 0; i < numUsers; i++){
        users.push({
            name: fakerPT_BR.internet.username(),
            email: fakerPT_BR.internet.email(),
            cpf: fakerPT_BR.string.numeric(11),
            phoneNumber: fakerPT_BR.string.numeric(11),
            salt : hashedPassword.salt,
            hash : hashedPassword.hash 
        });
    }

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log(`${numUsers} usuários criados com sucesso!`);
}