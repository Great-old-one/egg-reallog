'use strict';

const mock = require('egg-mock');

describe('test/logreal.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/logreal-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, logreal')
      .expect(200);
  });
});
