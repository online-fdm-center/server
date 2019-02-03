import { Getter } from '@loopback/context';
import { repository } from '@loopback/repository'
import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { FileRepository } from '../../src/repositories';
import { ThreeDFile } from '../../src/models'
import { DbDataSource } from '../../src/datasources/db.datasource';

describe('File', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;
  let fileRepository: FileRepository;
  let files: ThreeDFile[];
  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    fileRepository = await app.getRepository<FileRepository>(FileRepository);
    files = await fileRepository.createAll([
      {
        mimetype: 'application/x-msdownload',
        originalName: 'test1.dll',
        size: 19256,
        destination: "/uploads",
        filename: `file1-${Date.now()}`,
        status: ThreeDFile.statuses.WAITING_FOR_PROCESSING,
      }
    ]);
  });

  after(async () => {
    await fileRepository.delete(files[0]);
    await app.stop();
  });

  describe('POST /getFileToProcess', () => {
    let countFilesBeforeQuery: number;
    before(`получение файлов со статусом ${ThreeDFile.statuses.WAITING_FOR_PROCESSING}`, async () => {
      countFilesBeforeQuery = (await fileRepository.count({
        status: ThreeDFile.statuses.WAITING_FOR_PROCESSING
      })).count;
    })
    it('should return Unathorized if wrong token', async () => {
      await client
        .post('/getFileToProcess')
        .expect(401);
    })
    it('should return file', async () => {
      const res = await client
        .post('/getFileToProcess')
        .set('X-Auth-Token', process.env.SERVER_AUTH_TOKEN as string)
        .expect(200);
      expect(res.body).keys('id', 'filename', 'destination');
    });
    it('should decrease count of files with status', async () => {
      let countFilesAfterQuery = (await fileRepository.count({
        status: ThreeDFile.statuses.WAITING_FOR_PROCESSING
      })).count;
      expect(countFilesAfterQuery).lessThan(countFilesBeforeQuery);
    })
  })
});
