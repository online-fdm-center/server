import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { FileRepository, MaterialsRepository, ProductRepository } from '../../src/repositories';
import { ThreeDFile, AuthToken, Product, Materials } from '../../src/models'
import { getAuthToken, removeAuthTokenAndUser } from '../helpers/tokenProvider';

describe('Product', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;
  let fileRepository: FileRepository;
  let materialsRepository: MaterialsRepository;
  let productsRepository: ProductRepository;
  let files: ThreeDFile[];
  let materials: Materials[];
  let products: Product[];
  let authToken: AuthToken;
  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    fileRepository = await app.getRepository<FileRepository>(FileRepository);
    materialsRepository = await app.getRepository<MaterialsRepository>(MaterialsRepository);
    productsRepository = await app.getRepository<ProductRepository>(ProductRepository);
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
    materials = await materialsRepository.createAll([
      {
        color: 'TESTC',
        count: 1,
        type: 'TESTTYPE',
      }
    ])
    authToken = await getAuthToken(app);
    products = [];
  });

  after(async () => {
    console.log('delete products')
    await products.forEach(async product => {
      console.log(`delete product ${product.id}`)
      await productsRepository.delete(product);
    })
    console.log('delete files')
    await files.forEach(async file => {
      console.log(`delete file ${file.id}`)
      await fileRepository.delete(file);
    });
    console.log('delete materials')
    await materials.forEach(async material => {
      console.log(`delete material ${material.id}`)
      await materialsRepository.delete(material);
    });
    await removeAuthTokenAndUser(app, authToken);
    await app.stop();
  });

  describe('POST /products', () => {
    it('should return unauthorized', async () => {
      const res = await client.post('/products')
        .send(new Product({
          fileId: files[0].id,
          count: 1,
          description: 'Test product',
          materialId: materials[0].id,
          name: 'Test name',
        }))
        .expect(401);
    })
    it('should return new product with right userId', async () => {
      const res = await client.post('/products')
        .set('X-Auth-Token', authToken.token)
        .send(new Product({
          fileId: files[0].id,
          count: 1,
          description: 'Test product',
          materialId: materials[0].id,
          name: 'Test name',
        }))
        .expect(200);
      expect(res.body).keys('id', 'userId', 'name');
      expect(res.body.userId).equal(authToken.userId);
      products.push(new Product(res.body));
    })
  })
});
