import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { MaterialsRepository } from '../../src/repositories';
import { Materials } from '../../src/models'

describe('Materials', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;
  let materialsRepository: MaterialsRepository;
  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    materialsRepository = await app.getRepository<MaterialsRepository>(MaterialsRepository);
  });

  after(async () => {
    await materialsRepository.deleteAll();
    await app.stop();
  });

  describe('GET /materials/count', () => {
    before(async () => {
      const materialsToCreate: Materials[] = [
        new Materials({
          color: 'red',
          count: 1,
          type: 'ABS'
        }),
        new Materials({
          color: 'red',
          count: 1,
          type: 'ABS'
        })
      ];
      await materialsRepository.deleteAll();
      await materialsRepository.createAll(materialsToCreate)
    })
    it('should return 2', async () => {
      const res = await client.get('/materials/count')
        .expect(200);
      expect(res.body).keys('count');
      expect(res.body.count).equal(2);
    })
  });

  describe('PUT /materials/{id}', () => {
    let material: Materials;
    before(async () => {
      await materialsRepository.deleteAll();
      material = await materialsRepository.create({ type: 'ABS', color: 'red', count: 1 })
    })
    it('should put material', async () => {
      const newMaterial = new Materials({
        color: 'blue',
        count: 2,
        type: 'PLA',
      })
      const res = await client.put(`/materials/${material.id}`)
        .send(newMaterial)
        .expect(204);
      const dbMaterial = await materialsRepository.findById(material.id);
      expect({ ...newMaterial, id: null }).deepEqual({ ...dbMaterial, id: null });
    })
  })

  describe('PATCH /materials/{id}', () => {
    let material: Materials;
    before(async () => {
      await materialsRepository.deleteAll();
      material = await materialsRepository.create({
        type: 'ABS',
        color: 'red',
        count: 1
      })
    })
    it('should put material', async () => {
      const newMaterial = new Materials({
        color: 'blue',
        count: 2,
        type: 'PLA',
      })
      const res = await client.patch(`/materials/${material.id}`)
        .send(newMaterial)
        .expect(204);
      const dbMaterial = await materialsRepository.findById(material.id);
      expect(newMaterial.color).deepEqual(dbMaterial.color);
    })
  })

  describe('PATCH /materials/{id}', () => {
    let material: Materials;
    before(async () => {
      await materialsRepository.deleteAll();
      material = await materialsRepository.create({
        type: 'ABS',
        color: 'red',
        count: 1
      })
    })
    it('should get material', async () => {
      const res = await client.get(`/materials/${material.id}`)
        .expect(200);
      const dbMaterial = await materialsRepository.findById(material.id);
      expect({ ...material, id: null }).deepEqual({ ...dbMaterial, id: null });
    })
  })
});
