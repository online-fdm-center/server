import * as fs from 'fs';
import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { FileRepository, } from '../../src/repositories';
import { ThreeDFile, AuthToken } from '../../src/models'
import { getAuthToken } from '../helpers/tokenProvider';

describe('File', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;
  let fileRepository: FileRepository;
  let files: ThreeDFile[];
  let authToken: AuthToken;
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
    authToken = await getAuthToken(app);
  });

  after(async () => {
    await fileRepository.delete(files[0]);
    await app.stop();
  });

  describe('POST /files', () => {
    const countFilesInUploadDir = fs.readdirSync('uploads').length;
    it('should return unauthorized', async () => {
      await client.post('/files')
        .attach('file', 'test/laser.stl')
        .expect(401);
    })
    it('should upload file to dir', async () => {
      await client.post('/files')
        .set('X-Auth-Token', authToken.token)
        .attach('file', 'test/laser.stl')
      const countFilesInUploadDirAfterQuery = fs.readdirSync('uploads').length;
      expect(countFilesInUploadDirAfterQuery).above(countFilesInUploadDir);
    })
    it('should return ThreeDFile', async () => {
      const res = await client.post('/files')
        .set('X-Auth-Token', authToken.token)
        .attach('file', 'test/laser.stl')
        .expect(200);
      expect(res.body).keys('id', 'originalName');
    })
  })

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
