# Strict Arithmetic Operations (SAO)

SAO is a library that provides (maybe) strict arithmetic for JavaScript.

## Installation

At first, download [sao.js](https://raw.github.com/matsukei/sao/master/sao.js).
Then, put this line in your html.

``` html
<script src="sao.js"></script>
```
Or, 
``` html
<script src="https://raw.github.com/matsukei/sao/master/sao.js"></script>
```

That's all.

## Usage

### Addition (+)

``` javascript
var result = sao.add(100, 200, '300'); // => 600 <Object(goog.math.Long)>
```

But ``result`` is not a Number. If you want to get a Number, need to call ``sao#finalize``:

``` javascript
sao.finalize(result); // => 600
```

### Subtract (-)

``` javascript
var result = sao.sub(20.2, 20); // => 0.2 <Object(goog.math.Long)>
sao.finalize(result); // => 0.2 <Number>
```

### Multiply (*)

``` javascript
var result = sao.mul(0.01, 10); // => 0.1 <Object(goog.math.Long)>
sao.finalize(result); // => 0.1 <Number>
```

### Divison (/)

``` javascript
var result = sao.div(9, '3'); // => 3 <Object(goog.math.Long)>
sao.finalize(result); // 3 <Number>
```

### Round

``` javascript
sao.round(1.456, 1); // => 1.5 <Number (Not an Object!)>
sao.round(1.456);    // => 2 <Number (Not an Object!)>
```

### How to mix

``` javascript
sao.calc(10, '*', 2, '+', 5, '/', 2); // => 12.5 <Number>
```

This is the same as the following:

``` javascript
sao.div(sao.add(sao.mul(10, 2), 5), 2);
```

### More

See [sao/base_test.html (UnitTest)](https://github.com/matsukei/sao/blob/master/sao/base_test.html).

## Development

### How to test

  1. Clone repository (``git clone git://github.com/matsukei/sao``)
  2. ``cd sao/``
  3. ``rake test`` or open ``all_tests.html`` in your browser(Safari or Firefox)
  4. Press ``<T>`` key to run

### How to compile

**Requirements:**

  * Ruby (``>= 1.9``)
  * Python
  * Java

**Compile:**

  1. Clone repository (``git clone git://github.com/matsukei/sao``)
  2. ``cd sao/``
  3. ``rake compile``
  4. Create or overwrite ``sao.js``

## Contributing

  1. Fork it
  2. Create your feature branch (``git checkout -b new-feature``)
  3. Commit your changes (``git commit -am ``add some new feature``)
  4. Push to the branch (``git push origin new-feature``)
  5. Create new Pull Request

### Report Bugs

[github issues](https://github.com/matsukei/sao/issues/new)

## Author

[Matsukei Co.,Ltd](http://www.matsukei.co.jp).

## License

See [LICENSE file](https://github.com/matsukei/sao/blob/master/LICENSE).
