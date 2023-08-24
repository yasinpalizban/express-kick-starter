import { NextFunction, Request, Response } from "express";

export interface HomeControllerInterface {

  index(req: Request, res: Response, next: NextFunction): Promise<void | Response>;

  settings(req: Request, res: Response, next: NextFunction): Promise<void | Response>;


}
