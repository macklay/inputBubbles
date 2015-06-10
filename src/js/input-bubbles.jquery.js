(function() {
    if (window.jQuery !== 'undefined') {
        if (typeof $ === 'undefined') {
            return;
        }

        if (typeof window.inputBubbles === 'undefined') {
            throw new Error('InputBubbles native was not loaded!');
        }

        $.fn.inputBubbles = function(options) {
            if (!this.length) {
                return;
            }

            if (typeof options === 'string') {
                var guid = this.data('input-bundles');

                if (!guid) {
                    throw new Error('Trying to call inputBubble plugins methods on element without initialization!');
                }

                var instance = window.inputBubbles({
                    id: guid
                });

                if (typeof instance === 'undefined') {
                    throw new Error('Error! Instance was initialized with errors or was not initialized.');
                }

                if (arguments.length > 1) {
                    var args = ([]).slice.call(arguments);
                    return instance[options].apply(instance, args.splice(1, args.length));
                } else {
                    return instance[options]();
                }
            }


            var _options = options ? options : {};
            _options.element = this[0];

            window.inputBubbles(_options);

            return this;
        };
    }
})();