import * as z from "zod";

const user = z.object({

    name: z
        .string({ message: "nome deve ser string" })
        .trim()
        .min(5, "nome deve ter pelo menos 5 caracteres")
        .max(35, "nome deve ter no maximo 35 caracteres")
        .regex(
            /^(?=.{4,32}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/,
            "Formato de username inválido."
        ),

    email: z.email("Email inválido"),

    cpf: z
        .string({ message: "O CPF é obrigatório" })
        .trim()
        .length(11, "O CPF deve conter exatamente 11 dígitos")
        .regex(/^\d+$/, "O CPF deve conter apenas números"),

    phoneNumber: z
        .string({ message: "O telefone é obrigatório" })
        .trim()
        .min(10, "O telefone deve ter pelo menos 10 dígitos")
        .regex(/^\d+$/, "O telefone deve conter apenas números")
});

export const createUser = user;
export const updateUser = user.partial();