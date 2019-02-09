import { Request, Response } from 'express';
import path from 'path';

class IndexRouter {

  // tslint:disable:variable-name
  public indexTemplate(_req: Request, res: Response): void {

    const indexFilePath = path.resolve(__dirname, '../../public/index.html');

    res.sendFile(indexFilePath);
  }
}

export default new IndexRouter().indexTemplate;
