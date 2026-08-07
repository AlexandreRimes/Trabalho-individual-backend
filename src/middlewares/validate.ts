// middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validateBody(schema: ZodType) {
    return (request: Request, response: Response, next: NextFunction) => {
        const result = schema.safeParse(request.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensagem: issue.message,
            }));

            response.status(400).json({ message: "Erro de validação", errors });
            return;
        }

        request.body = result.data;
        next();
    };
}