const assert = require('assert');
const nextResult = require('../app/lib/next-result');

describe('Imonline', () => {
  describe('#weekdayHourMinute', () => {
    const imonlines = [{
      result: '12345',
    }, {
      result: '01234',
    }, {
      result: '91234',
    }];

    it('计算下次结果', (done) => {
      const stats = nextResult.weekdayHourMinute(imonlines);
      assert.deepEqual(stats, [1, 3, 3, 3, 3, 1, 0, 0, 0, 1]);
      done();
    });
  });
});
