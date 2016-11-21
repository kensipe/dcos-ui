const CreateServiceModalFormUtil = require('../CreateServiceModalFormUtil');

describe('CreateServiceModalFormUtil', function () {
  describe('#applyPatch', function () {

    it('should always return cloned objects', function () {
      let data = {a: 'foo'};
      let patch = {};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).not.toBe(data);
    });

    it('should not modify source data on empty patch', function () {
      let data = {a: 'foo'};
      let patch = {};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: 'foo'});
    });

    it('should create new fields if missing', function () {
      let data = {a: 'foo'};
      let patch = {b: 'bar'};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: 'foo', b: 'bar'});
    });

    it('should remove fields if patch value is undefined', function () {
      let data = {a: 'foo'};
      let patch = {a: undefined};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({});
    });

    it('should remove fields if patch value is null', function () {
      let data = {a: 'foo'};
      let patch = {a: null};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({});
    });

    it('should remove fields if patch value is \'\'', function () {
      let data = {a: 'foo'};
      let patch = {a: ''};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({});
    });

    it('should remove fields if patch value is {}', function () {
      let data = {a: 'foo'};
      let patch = {a: {}};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({});
    });

    it('should remove fields if patch value is []', function () {
      let data = {a: 'foo'};
      let patch = {a: []};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({});
    });

    it('should preserve string source type if array is given', function () {
      let data = {a: 'foo'};
      let patch = {a: ['a']};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: 'foo'});
    });

    it('should preserve string source type if object is given', function () {
      let data = {a: 'foo'};
      let patch = {a: {b: 'c'}};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: 'foo'});
    });

    it('should preserve string source type if number is given', function () {
      let data = {a: 'foo'};
      let patch = {a: 42};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: 'foo'});
    });

    it('should preserve null source type if null is given', function () {
      let data = {a: null};
      let patch = {a: null};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: null});
    });

    it('should preserve null source type if \'\' is given', function () {
      let data = {a: null};
      let patch = {a: ''};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: null});
    });

    it('should preserve null source type if [] is given', function () {
      let data = {a: null};
      let patch = {a: []};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: null});
    });

    it('should preserve null source type if {} is given', function () {
      let data = {a: null};
      let patch = {a: {}};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: null});
    });

    it('should remove empty fields from patch objects', function () {
      let data = {a: null};
      let patch = {a: {b: null, c:'', d:'foo'}};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: {d: 'foo'}});
    });

    it('should keep the original empty value if patch object is empty', function () {
      let data = {a: {}};
      let patch = {a: {b: null, c:'', d:undefined}};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: {}});
    });

    it('should recursively remove empty fields from patch objects', function () {
      let data = {a: {b: 'foo', c: {d: 'bar'}}};
      let patch = {a: {b: 'foo', c: {d: null}}};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: {b: 'foo'}});
    });

    it('should strip empty propeties from patch-only objects', function () {
      let data = {};
      let patch = {a: {b: 'foo', c: {d: null}}};
      let patched = CreateServiceModalFormUtil.applyPatch(data, patch);
      expect(patched).toEqual({a: {b: 'foo'}});
    });

  });
});

