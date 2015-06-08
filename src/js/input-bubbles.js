(function() {

    function InputBubbles() {

        var _values = [];
        var _bubbles = [];
        var _actions = {
            add:          null,
            clear:        null,
            remove:       null,
            bubbleClick:  null,
            keyup:        null
        };


        /**
         * Initializing
         * @param options Plugin options
         */
        this.init = function(options) {
            if (options === null) {
                throw new Error('Invalid parameter "options"!');
            }

            if (typeof options === 'undefined') {
                throw new Error('Initializing without options!');
            }

            if (typeof options.childNodes !== 'undefined') {
                this.options = {
                    element: options
                };
            } else if (({}).toString.call(options).slice(8, -1) !== 'Object') {
                throw new Error('Invalid parameter "options"');
            } else {
                this.options = options;

                if (options.element === null) {
                    throw new Error('Element was not found!');
                }

                if (typeof this.options.element === 'undefined') {
                    throw new Error('Initializing without element!');
                }

                for (var key in _actions) {
                    if (this.options[key] && typeof this.options[key] === 'function') {
                        _actions[key] = this.options[key];
                    }
                }
            }

            this.element = this.options.element;

            if (!this.options.height) {
                this.options.height = 30;
            }
            if (!this.options.width) {
                this.options.width = 370;
            }

            this.element.style.minHeight = this.options.height + 'px';
            this.element.style.width = this.options.width + 'px';

            _makeEditable.call(this);

            this.innerElement.addEventListener('keyup', _onKeyUp.bind(this));
            this.innerElement.addEventListener('keydown', _onKeyDown.bind(this));
            this.innerElement.addEventListener('paste', _onPaste.bind(this));
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
            _actions[action] = func;
        };

        /**
         * Triggers event
         * @param action Name of event
         * @param params Parameters
         */
        this.trigger = function(action, params) {
            if (typeof action !== 'string') {
                throw new Error('Invalid operation!');
            }
            if (!_actions[action]) {
                throw new Error('Action "' + action + '" was not defined!')
            }

            params ? _actions[action](params) : _actions[action]();
        };

        /**
         * Bubble template
         */
        this.makeBubble = function(text) {
            return '<span class="ui-bubble-content">' + text + '</span> | <span class="ui-bubble-remove">x</span>';
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
            div.innerHTML = this.makeBubble(_text);

            this.element.insertBefore(div, this.innerElement);

            _values.push(_text);
            _bubbles.push(div);

            div.querySelector('.ui-bubble-remove').addEventListener('click', this.removeBubble.bind(this));
            this.innerElement.innerText = '';
            this.innerElement.focus();

            if (_actions.add) {
                _actions.add(div, _text);
            }

            if (_actions.bubbleClick) {
                div.addEventListener('click', _actions.bubbleClick);
            }
        };

        /**
         * Removes bubble
         * @param event DOM event
         */
        this.removeBubble = function(event) {
            event.stopPropagation();
            var node = event.currentTarget.parentNode;
            this.element.removeChild(node);
            this.refreshData();

            if (_actions.remove) {
                _actions.remove();
            }
        };

        /**
         * Removes last bubble
         */
        this.removeLastBubble = function() {
            if (_bubbles.length) {
                _values.pop();
                var div = _bubbles.pop();
                this.element.removeChild(div);
            }

            if (_actions.remove) {
                _actions.remove();
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
            _bubbles = [];

            if (_actions.clear) {
                _actions.clear();
            }
        };

        /**
         * Returns bubbles as text values
         * @returns {Array}
         */
        this.getValues = function() {
            return _values;
        };

        /**
         * Returns bubbles as DOM nodes
         * @returns {Array}
         */
        this.getBubbles = function() {
            return _bubbles;
        };

        /**
         * Refresh all sets
         */
        this.refreshData = function() {
            _values = [];
            _bubbles = [];

            var allNodes =  _getAllNodes.call(this);
            for(var i = 0; i < allNodes.length; ++i) {
                _bubbles.push(allNodes[i]);
                _values.push(allNodes[i].querySelector('.ui-bubble-content').innerText);
            }
        };

        return function(options) {
            this.init(options);
            return this;
        }.bind(this);

        function _onKeyDown(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
            }
        }

        function _onKeyUp(event) {
            if (event.keyCode === 32 || event.keyCode === 13) {
                this.addBubble();
            } else if (event.keyCode === 8 && this.toDeleteFlag) {
                this.removeLastBubble();
            } else if (this.options.separator) {
                var text = this.innerElement.innerText;
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

            if (_actions.keyup) {
                _actions.keyup(event);
                cursorManager.setEndOfContenteditable(this.innerElement);
            }
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

        function _onPaste() {
            var textArr = this.innerElement.split('');
        }
    }

    window.inputBubbles = new InputBubbles();
})();
