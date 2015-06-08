(function() {
    if (typeof $ === 'undefined') {
        throw new Error('You must load jQuery library!');
    }

    if (typeof window.inputBubbles === 'undefined') {
        throw new Error('InputBubbles native was not loaded!');
    }

    $.fn.inputBubbles = function(options) {
        if (!this.length) {
            return;
        }

        var _options = options ? options : {};
        _options.element = this[0];
        this.inputBundles = inputBubbles(_options);

        return this;
    }
})();