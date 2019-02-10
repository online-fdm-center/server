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
  let authToken2: AuthToken;
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
    authToken2 = await getAuthToken(app);
    products = [];
  });

  after(async () => {
    await productsRepository.deleteAll();
    await fileRepository.deleteAll();
    await materialsRepository.deleteAll();
    await removeAuthTokenAndUser(app, authToken);
    await removeAuthTokenAndUser(app, authToken2);
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

  describe('POST /products/duplicate/{id}', () => {
    it('should return unauthorized if wrong token', async () => {
      const res = await client.post(`/products/duplicate/${products[0].id}`)
        .expect(401);
    })
    it('should return new product, equal to old', async () => {
      const res = await client.post(`/products/duplicate/${products[0].id}`)
        .set('X-Auth-Token', authToken.token)
        .expect(200);
      expect(res.body).keys('id');
      products.push(new Product(res.body));

      let oldProduct = products[0].toJSON();
      let newProduct = res.body;
      expect(new Product(oldProduct).id).not.equal(new Product(newProduct).id);
      oldProduct = { ...oldProduct, id: null, status: null };
      newProduct = { ...newProduct, id: null, status: null };
      expect(oldProduct).deepEqual(newProduct);
    })
    it('should return 404 if product not exist', async () => {
      const res = await client.post(`/products/duplicate/1050`)
        .set('X-Auth-Token', authToken.token)
        .expect(404);
    })
  })

  describe('DELETE /products/{id}', () => {
    let ownProduct: Product;
    let notOwnProduct: Product;
    before(async () => {
      var secondUser =
        ownProduct = await productsRepository.create(new Product({
          userId: authToken.userId,
          fileId: files[0].id,
          count: 1,
          description: 'ownProduct',
          materialId: materials[0].id,
          name: 'ownProduct',
        }))
      notOwnProduct = await productsRepository.create(new Product({
        userId: authToken2.userId,
        fileId: files[0].id,
        count: 1,
        description: 'notOwnProduct',
        materialId: materials[0].id,
        name: 'notOwnProduct',
      }))
    })
    it('should return forbidden if delete not own product', async () => {
      const res = await client.delete(`/products/${notOwnProduct.id}`)
        .set('X-Auth-Token', authToken.token)
        .expect(403);
    })
    it('should return success if delete own product', async () => {
      const res = await client.delete(`/products/${ownProduct.id}`)
        .set('X-Auth-Token', authToken.token)
        .expect(204);
    })
  })
});
