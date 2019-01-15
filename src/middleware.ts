import * as cors from 'cors';

// File Uploads
export async function AddCors(req, res): Promise<any> {
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-Requested-With, Accept, Content-Type, Origin, Cache-Control, X-File-Name'
  );
  res.setHeader('Access-Control-Allow-Origin', '*');
  return new Promise((resolve, reject) => {
    cors({ origin: true })(req, res, () => {
      resolve();
    });
  });
}
