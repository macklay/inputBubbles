(function() {

    function InputBubbles() {

        var _values = [];
        var _nodes = [];

        /**
         * Sets option
         * @param option Name of option
         * @param value value of option
         */
        this.set = function(option, value) {
            if (typeof option !== 'string') {
                throw new Error('Invalid option!');
            }
            this[option] = value;
        };

        /**
         * Subscribes to event
         * @param action Name of event
         * @param func Callback
         */
        this.on = function(action, func) {
            if (typeof action !== 'string' || typeof func !== 'function') {
                throw new Error('Invalid operation!');
            }
            this[action] = func;
        };

        /**
         * Triggers event
         * @param action Name of event
         * @param params Parameters
         */
        this.trigger = function(action) {
            if (typeof action !== 'string') {
                throw new Error('Invalid operation!');
            }
            if (!this[action]) {
                throw new Error('Action "' + action + '" was not defined!')
            }

            if (arguments.length > 1) {
                var args = ([]).slice.call(arguments);
                this[action].apply(this, args.splice(1, args.length));
            } else {
                this[action]();
            }
        };

        /**
         * Inserts bubble into element
         * @param params
         */
        this.addBubble = function(text) {
            var _text = (text ? text : this.innerElement.innerText).trim();
            if (!_text) {
                return;
            }

            var div = document.createElement('div');
            div.className = 'js-bubble-item ui-bubble';
            div.innerHTML = _makeBubble.call(this, _text);

            this.element.insertBefore(div, this.innerElement);

            _values.push(_text);
            _nodes.push(div);

            div.querySelector('.ui-bubble-remove').addEventListener('click', _removeBubble.bind(this));
            this.innerElement.innerText = '';
            this.innerElement.focus();

            if (this.add || typeof this.add === 'function') {
                this.add(div, _text);
            }

            if (this.click || typeof this.click === 'function') {
                div.addEventListener('click', this.click);
            }
        };

        /**
         * Removes last bubble
         */
        this.removeLastBubble = function() {
            if (_nodes.length) {
                _values.pop();
                var div = _nodes.pop();
                this.element.removeChild(div);
            }

            if (this.remove || typeof this.remove === 'function') {
                this.remove();
            }
        };

        /**
         * Removes ALL nodes BUT not contentEditable from element
         * Clear data arrays
         */
        this.clear = function() {
            var allNodes =  _getAllNodes.call(this);
            for(var i = 0; i < allNodes.length; ++i) {
                this.element.removeChild(allNodes[i]);
            }

            _values = [];
            _nodes = [];

            if (this.clear || typeof this.clear === 'function') {
                this.clear();
            }
        };

        /**
         * Returns bubbles as text values
         * @returns {Array}
         */
        this.values = function() {
            return _values;
        };

        /**
         * Returns bubbles as DOM nodes
         * @returns {Array}
         */
        this.nodes = function() {
            return _nodes;
        };

        return function(options) {
            return _init.call(this, options);
        }.bind(this);


        // Private methods

        function _init(options) {
            if (options === null || typeof options === 'undefined') {
                throw new Error('Initialization without options!');
            }


            if (typeof options.childNodes !== 'undefined') {
                this.options = {
                    element: options
                };
            }

            else if (({}).toString.call(options).slice(8, -1) !== 'Object') {
                throw new Error('Invalid parameter "options"');
            }

            else if (typeof options.id !== 'undefined') {
                return this.initialized[options.id];
            }

            else {
                this.options = options;

                if (this.options.element === null || typeof this.options.element === 'undefined') {
                    throw new Error('Initializing without element or element was not found!');
                }
            }

            for (var key in this.options) {
                if (this.options[key] && typeof this.options[key] === 'function') {
                    this[key] = this.options[key];
                    delete this.options[key];
                }
            }

            this.element = this.options.element;

            this.options.height = this.options.height || 30;
            this.options.width = this.options.width || 370;

            this.element.style.minHeight = this.options.height + 'px';
            this.element.style.width = this.options.width + 'px';

            _makeEditable.call(this);

            this.innerElement.addEventListener('keyup', _onKeyUp.bind(this));
            this.innerElement.addEventListener('keydown', _onKeyDown.bind(this));
            this.innerElement.addEventListener('paste', _onPaste.bind(this));

            var newGuid = _guid();
            this.initialized[newGuid] = this;
            this.element.setAttribute('data-input-bundles', newGuid);

            return this;
        }

        function _makeBubble(text) {
            return '<span class="ui-bubble-content">' + text + ' | </span><span class="ui-bubble-remove">x</span>';
        }

        function _removeBubble(event) {
            event.stopPropagation();
            var node = event.currentTarget.parentNode;
            this.element.removeChild(node);
            _refreshData.call(this);

            if (this.remove || typeof this.remove === 'function') {
                this.remove();
            }
        }

        function _onKeyDown(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
            }
        }

        function _onKeyUp(event) {
            if ((event.keyCode === 32 && !this.options.allowSpaces) || event.keyCode === 13) {
                this.addBubble();
            } else if (event.keyCode === 8 && this.toDeleteFlag) {
                this.removeLastBubble();
            } else if (this.options.separator) {
                var text = this.innerElement.innerText;

                if (this.options.maxLength && text.length > this.options.maxLength) {
                    text = text.slice(0, this.options.maxLength);
                    this.innerElement.innerText = text;
                }

                for (var i = 0; i < this.options.separator.length; ++i) {
                    if (text.indexOf(this.options.separator[i]) !== -1) {
                        var _text = text.replace(this.options.separator[i], '');
                        if (!_text) {
                            this.innerElement.innerText = '';
                            this.innerElement.focus();
                        } else {
                            this.addBubble(text.replace(this.options.separator[i], ''));
                        }
                        break;
                    }
                }
            }

            if (!this.innerElement.innerText.trim()) {
                this.toDeleteFlag = true;
            } else {
                this.toDeleteFlag = false;
            }

            if (this.keyup || typeof this.keyup === 'function') {
                this.keyup(event);
            }

            cursorManager.setEndOfContenteditable(this.innerElement);
        }

        function _onPaste() {
            setTimeout(function() {
                this.addBubble(_escapeHtml(this.innerElement.innerText));
            }.bind(this), 0);
        }

        function _makeEditable() {
            while (this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }

            this.element.setAttribute('tabindex', 1);

            this.innerElement = document.createElement('div');
            this.innerElement.setAttribute('contenteditable', 'true');
            this.innerElement.className = 'ui-inner-editable';
            this.element.appendChild(this.innerElement);

            this.element.addEventListener('focus', function() {
                this.innerElement.focus();
            }.bind(this));
        }

        function _getAllNodes() {
            var arr = [];
            var childNodes = this.element.childNodes;

            for (var i = 0; i < childNodes.length; ++i) {
                if (childNodes[i].nodeType == 1 &&
                    (!childNodes[i].getAttribute('contenteditable') || childNodes[i].getAttribute('contenteditable') === 'false')) {
                    arr.push(childNodes[i]);
                }
            }
            return arr;
        }

        function _escapeHtml(text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        function _refreshData() {
            _values = [];
            _nodes = [];

            var allNodes =  _getAllNodes.call(this);
            for(var i = 0; i < allNodes.length; ++i) {
                _nodes.push(allNodes[i]);
                _values.push(allNodes[i].querySelector('.ui-bubble-content').innerText);
            }
        }

        function _guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
    }

    InputBubbles.prototype.initialized = {};

    window.inputBubbles = new InputBubbles();
})();
