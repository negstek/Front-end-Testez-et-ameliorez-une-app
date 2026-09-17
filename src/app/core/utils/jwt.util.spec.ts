import { decodeJwt } from './jwt.util';

describe('decodeJwt', () => {
  it('decodes the payload of a valid JWT', () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZG9lIn0.signature';

    expect(decodeJwt(token)).toEqual({ sub: 'jdoe' });
  });
});
