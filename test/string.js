(function() {

    QUnit.module('string-test');

    test("reverse string", function(assert) {
        assert.equal(stringReverse("ccc"), "cba", "abc reverse to cba");
    });
}());