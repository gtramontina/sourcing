// From: https://github.com/substack/tape/issues/59#issuecomment-32808769

exports.beforeEach = function beforeEach (test, handler) {
  return function tapish (name, listener) {
    test(name, function (assert) {
      const _end = assert.end;
      assert.end = function () {
        assert.end = _end;
        listener(assert);
      };

      handler(assert);
    });
  };
};

exports.afterEach = function afterEach (test, handler) {
  return function tapish (name, listener) {
    test(name, function (assert) {
      const _end = assert.end;
      assert.end = function () {
        assert.end = _end;
        handler(assert);
      };

      listener(assert);
    });
  };
};
