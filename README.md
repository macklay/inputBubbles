#inputBubbles

inputBubbles is a javascript plugin, that can help transfom text in text fields in small panels (bubbles). It is absolutely free, [open source](https://github.com/lutaev/inputBubbles) and distributed under the MIT license.

 This plugin is very simple and may be used native or as jQuery plugin. 
 
 
## Installing inputBubbles 

You can install this package locally either with `npm`, or `bower`. 

### npm

To install latest formal release 
```shell
npm install input-bubbles
```

To install latest release and update package.json
```shell
npm install input-bubbles --save-dev
```

### bower

To get the latest stable version, use bower from the command line.
```shell
bower install input-bubbles
```

To save the bower settings for future use:
```shell
bower install input-bubbles --save
```

Later, you can use easily update with:
```shell
bower update
```

## Usage

### Include all neccessary files
To get started you need 3 things in your page:
 1. A css file with styles for bubbles
 2. The javascript source file
 3. jQuery library (optional, if you want)
 
```html
<link type="text/css" rel="stylesheet" href="dist/css/input-bubbles.min.css">

<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="dist/js/input-bubbles.min.js"></script>
```

### Initialize container for bubbles (native)

#### Simple usage:

```html
<div id="bubbleWrapper"></div>

<script>
    var bubblesObj = inputBubbles(document.getElementById('bubbleWrapper'));
</script>

#### Initialize as jQuery plugin

```html
<div id="bubbleWrapper"></div>

<script>
    var bubbles = $('#bubbleWrapper').inputBubbles({
        width: 500,
        height: 50
    });
</script>
```

### Options

#### Setting options with native initialization
```javascript
     // Initialization
     var bubbles = inputBubbles({
         element: document.getElementById('bubbleWrapper'),   
         width: 500,
         height: 30
     });
     
     // Setting after initialization
     bubbles.set('allowSpaces', true);
 ```
 
#### As jQuery plugin
```javascript
    // Initialization
    $('#bubbleWrapper').inputBubbles({ 
        width: 500,
        height: 30
    });
      
    // Setting after initialization, with jQuery use method "set"
    $('#bubbleWrapper').inputBubbles('set', 'maxLength', 15);
```

#### Available options are:

 * `element` - Is necessary for native usage only. DOM-element, which will be transformed to container with bubbles and input field.
 * `width` - Width of container in pixels.
 * `height` - Maximum of height of container in pixels.
 * `separator` - Array with symbols-delimeters. Once you type one of this symbols, next bubble will be created. For example: 
 ```javascript
     $('#bubbleWrapper').inputBubbles({
         separator: [',', ':']
     });
 ```
 * `allowSpaces` - This options allows typing whitespaces in bubbles without creating new bubble after each whitespace
 * `maxLength` - Maximum of symbols allows in input field

 
### Methods

#### Calls method with native initialization
```javascript
     // Initialization
     var bubbles = inputBubbles({
         element: document.getElementById('bubbleWrapper'),
         click: function() {
            alert('click'!)
         }
     });
     
     // Calling after initialization
     bubbles.trigger('click');
 ```
 
#### As jQuery plugin
```javascript
    // Initialization
    $('#bubbleWrapper').inputBubbles({ 
        width: 500,
        height: 30
    });
      
    // Calling after initialization
    $('#bubbleWrapper').inputBubbles('trigger', 'click');
``` 
 
#### Available methods are:

* `set` - This method sets an option after initialization. 
 ```javascript
     $('#bubbleWrapper').inputBubbles('set', 'maxLength', 15);
 ```
 * `on` - Add an event listener after initialization
 ```javascript
     $('#bubbleWrapper').inputBubbles('on', 'click', function(event) {
         console.log(event.currentTarget.innerText);   
     });
 ```
 * `trigger` - Triggers event, which was defined earlier
 ```javascript
      $('#bubbleWrapper').inputBubbles('trigger', 'click');
 ```
 * `addBubble` - You can manually add new bubble. 
 ```javascript
       $('#bubbleWrapper').inputBubbles('addBubble', 'I am a bubble!');
 ```
 * `removeLastBubble` - Removes last bubble
 ```javascript
       $('#bubbleWrapper').inputBubbles('removeLastBubble');
 ```
 * `clear` Removes all bubbles
 ```javascript
       $('#bubbleWrapper').inputBubbles('clear');
 ```
 * `values` Returns text content of all bubbles as array of strings
 ```javascript
       $('#bubbleWrapper').inputBubbles('values');
 ```
 * `nodes` Returns all bubbles as array of DOM-elements
 ```javascript
       $('#bubbleWrapper').inputBubbles('nodes');
 ```
 * ``

### Events

Availalble events are:




