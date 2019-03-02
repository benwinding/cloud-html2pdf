import * as cors from 'cors';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// File Uploads
export async function AddCors(req: Request, res: Response, next: NextFunction) {
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-Requested-With, Accept, Content-Type, Origin, Cache-Control, X-File-Name'
  );
  res.setHeader('Access-Control-Allow-Origin', '*');
  await new Promise((resolve, reject) => {
    cors({ origin: true })(req, res, () => {
      resolve();
    });
  });
  next();
}

export function OptionRequestsAreOk(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === 'OPTIONS') {
    console.warn("Recieved OPTIONS request sending OK')");
    res.status(200).send('Options are OK');
    return;
  }
  next();
}

export function PostRequestsOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method !== 'POST') {
    const msg = 'Only POST requests are supported';
    console.warn(msg);
    res.status(400).send(msg);
    return;
  }
  next();
}

export function HasBodyProp(bodyFieldName: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body[bodyFieldName]) {
      const msg = 'Request is missing property in req.body: ' + bodyFieldName;
      console.warn(msg);
      res.status(400).send(msg);
      return;
    }
    next();
  };
}
