import type { Request, Response, NextFunction } from "express"
import { type AnyZodObject, ZodError } from "zod"

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.errors,
        })
      }
      next(error)
    }
  }
}
