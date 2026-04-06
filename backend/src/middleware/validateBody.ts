import { Request, Response, NextFunction } from "express";
import z from "zod";

function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    next();
  };
}

export default validateBody;