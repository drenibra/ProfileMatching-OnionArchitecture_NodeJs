import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';

const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export { catchAsync };
