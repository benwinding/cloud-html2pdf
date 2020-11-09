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
    res.status(200).send('Options are OK\n');
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
      const msg = `Request is missing property "${bodyFieldName}" in req.body
-> Recieved req.body: ${getSafeJson(req.body)}`;
      console.warn(msg);
      res.status(400).send(msg);
      return;
    }
    next();
  };
}

export function HasQuery(queryParamName: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.query[queryParamName]) {
      const msg = `Request is missing "${queryParamName}" in req.query
-> Recieved req.query: ${getSafeJson(req.query)}`;
      console.warn(msg);
      res.status(400).send(msg);
      return;
    }
    next();
  };
}

function getSafeJson(body: any) {
  try {
    const str = JSON.stringify(body, null, 2);
    return str.slice(0,200);
  } catch (error) {
    return '(Error Parsing JSON) body=' + body;
  }
}
