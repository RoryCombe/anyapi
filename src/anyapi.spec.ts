import request from 'supertest';
import api from './anyapi';

describe('should list available collections', () => {
  test('GET / - success', async () => {
    const { body } = await request(api('')).get('/');
    expect(body).toEqual([
      {
        state: 'NJ',
        capital: 'Trenton',
        governor: 'Phil Murphy',
      },
      {
        state: 'CT',
        capital: 'Hartford',
        governor: 'Ned Lamont',
      },
      {
        state: 'NY',
        capital: 'Albany',
        governor: 'Andrew Cuomo',
      },
    ]);
  });
});
