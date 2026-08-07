import * as z from "zod";

const address = z.object({

    zipCode: z
        .string({ message: "O CEP é obrigatório" })
        .trim()
        .length(8, "O CEP deve ter exatamente 8 dígitos")
        .regex(/^\d+$/, "O CEP deve conter apenas números"),

    street: z
        .string({ message: "A rua é obrigatória" })
        .trim()
        .min(3, "Nome da rua muito curto"),

    number: z
        .string({ message: "O número é obrigatório" })
        .trim(),

    complement: z
        .string({ message: "Complemento inválido" })
        .trim()
        .optional(),

    neighborhood: z
        .string({ message: "O bairro é obrigatório" })
        .trim(),

    city: z
        .string({ message: "A cidade é obrigatória" })
        .trim(),

    state: z
        .string({ message: "O estado é obrigatório" })
        .trim()
        .length(2, "Use a sigla do estado (ex: SP, RJ)")

});

export const createAddress = address;
export const updateAddress = address.partial();