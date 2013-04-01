// Strict Arithmetic Operations (SAO) Library.
//
// @license The MIT-Licence. See MIT-LICENSE.


goog.provide('sao');

goog.require('goog.math.Long');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.object');


/**
 * @enum
 * @private
 */
sao.Method = {
  ADD: 0x01, 
  DIV: 0x02, 
  SUB: 0x03, 
  MUL: 0x04
};


/**
 * Example:
 * <pre>
 * // Basic usage:
 * sao.add(1, '2', 3);
 * sao.add(1, -1);
 * sao.add(100, 100.0, 0.123);
 * 
 * // CAUTION!:
 * var result = sao.add(1, '2', '3') //=> Result is Not a Number! You need to run #finalize to get Number.
 * sao.finalize(result);             //=> 5 <Number>
 * </pre>
 * @param {...(number|string|goog.math.Long)} var_args
 * @return {goog.math.Long}
 */
sao.add = function(var_args) {
  return sao.calculate_(sao.Method.ADD, arguments, function(a, b) {
    return a.add(b);
  });
};


/**
 * Example:
 * <pre>
 * sao.div(9, '3');  //=> 3 <goog.math.Long>
 * sao.div(9, 3, 1); //=> Error!
 * </pre>
 * @param {(number|string|goog.math.Long)} a
 * @param {(number|string|goog.math.Long)} b
 * @return {goog.math.Long}
 */
sao.div = function(a, b) {
  var member = sao.prepareMember_([a, b]);
  var values = member.values;

  return sao.toLong_(values[0] / values[1]);
};


/**
 * Example:
 * <pre>
 * sao.sub('1', 1);       //=> 0 <goog.math.Long>
 * sao.sub(100, 50, -50); //=> 100 <goog.math.Long>
 * </pre>
 * @param {...(number|string|goog.math.Long)} var_args
 * @return {goog.math.Long}
 */
sao.sub = function(var_args) {
  return sao.calculate_(sao.Method.SUB, arguments, function(a, b) {
    return a.subtract(b);
  });
};


/**
 * Example:
 * <pre>
 * sao.mul(10, '10'); //=> 100 <goog.math.Long>
 * sao.mul(1.5, 2);   //=> 3 <goog.math.Long>
 * </pre>
 * @param {...(number|string|goog.math.Long)} var_args
 * @return {goog.math.Long}
 */
sao.mul = function(var_args) {
  return sao.calculate_(sao.Method.MUL, arguments, function(a, b) {
    return a.multiply(b);
  });
};


/**
 * Examaple:
 * <pre>
 * sao.round(1.2345, 3); //=> 1.235 <Number>
 * sao.round(1.555);     //=> 6 <Number>
 * </pre>
 * @param {(goog.math.Long|number)} v
 * @param {number=} opt_level
 * @return {number}
 */
sao.round = function(v, opt_level) {
  var value = goog.isNumber(v) ? sao.toLong_(v) : v;
  var strval = value.toString().replace(/^\-/, '');
  var level = opt_level || 0;
  var result;

  if (sao.canRound_(value, level)) {
    var decimal = value.getRawDecimal();
    var rounder = strval.charAt(strval.length - decimal + level);

    if (goog.string.toNumber(rounder) > 4) {
      var adder = Math.pow(10, decimal - level) * (value.isNegative() ? -1 : 1);

      result = value.add(goog.math.Long.fromNumber(adder));
      result.inheritRaw(value);
    } else {
      result = value;
    }
    result = sao.finalize(result);
    result = String(result).slice(0, -(decimal - level));
  } else {
    result = sao.finalize(value);
  }
  return goog.string.toNumber(result);
};


/**
 * This method convert a value of type <goog.math.Long> to Number. Example:
 * <pre>
 * var result = sao.add(1, 1); // result is type of <goog.math.Long>.
 * sao.finalize(result);       // 2 <Number>
 * </pre>
 * @param {(goog.math.Long|number)} value
 * @return {number}
 */
sao.finalize = function(value) {
  if (goog.isNumber(value)) {
    return value;
  }

  var method = value.getCalculationMethod();
  var result = value.toString();
  var decimal = value.getRawDecimal();

  if (method == sao.Method.MUL) {
    decimal *= value.getCalculationMemberCount();
  }

  if (decimal != 0) {
    var intValue, floatValue, isNegative = false;

    if (result.charAt(0) == '-') {
      isNegative = true;
      result = result.replace(/^\-/, '');
    }

    if (result.length <= decimal) {
      floatValue = goog.string.padNumber(result, decimal);
      intValue = '0';
    } else {
      floatValue = result.slice(-decimal);
      intValue = result.slice(0, -decimal);
    }
    result = (isNegative ? '-' : '') + intValue + '.' + floatValue;
  }

  return goog.string.toNumber(result);
};


/**
 * @param {sao.Method} method
 * @param {(Array.<(number|string|goog.math.Long)>|ArrayLike.<(number|string|goog.math.Long)>)} values
 * @param {function(goog.math.Long, goog.math.Long):goog.math.Long} fn
 * @return {goog.math.Long}
 * @private
 */
sao.calculate_ = function(method, values, fn) {
  var result;
  var member = sao.prepareMember_(values);

  result = goog.array.reduce(goog.array.slice(member.values, 1), 
      function(r, v) { return fn(r, v) }, member.values[0]);

  result.calculatedBy(method, member.values.length);
  result.setRawDecimal(member.decimal);

  return result;
};


/**
 * @param {goog.math.Long} v
 * @param {number} level
 * @return {boolean}
 * @private
 */
sao.canRound_ = function(v, level) {
  if (!v.isRawDecimal()) {
    return false;
  }
  if (v.getRawDecimal() <= level) {
    return false;
  }
  return true;
};


/**
 * @param {(string|number)} value
 * @return {goog.math.Long}
 * @private
 */
sao.toLong_ = function(value) {
  if (!goog.isString(value) && !goog.isNumber(value)) {
    throw new Error('Invalid value: "' + value + '"');
  }

  var val = String(value);
  var result, res;

  if (res = val.match(/\.(\d+)$/)) {
    result = goog.math.Long.fromString(goog.string.remove(val, '.'));
    result.setRaw(value, res[1].length);
  } else {
    result = goog.math.Long.fromString(/** @type {string} */(val));
    result.setRaw(value);
  }
  return result;
};


/**
 * @param {(Array.<(string|number|goog.math.Long)>|ArrayLike.<(string|number|goog.math.Long)>)} values
 * @return {Object} Object has values and decimal. 
 *     values is {Array.<goog.math.Long>}, decimal is {number}.
 * @private
 */
sao.prepareMember_ = function(values) {
  var decimals, maxDecimal;

  values = goog.array.map(values, function(value) {
    return (value instanceof goog.math.Long) ? value: sao.toLong_(value);
  });
  maxDecimal = Math.max.apply(null, goog.array.map(values, function(value, i) {
    return value.getRawDecimal();
  }));

  if (maxDecimal != 0) {
    var diff, newValue;
    values = goog.array.map(values, function(value) {
      diff = maxDecimal - value.getRawDecimal();
      if (diff != 0) {
        newValue = value.multiply(goog.math.Long.fromNumber(Math.pow(10, diff)));
        newValue.inheritRaw(value);
        return newValue;
      } else {
        return value;
      }
    });
  }
  return {values: values, decimal: maxDecimal};
};


goog.object.extend(
  goog.math.Long.prototype, 
  /**
   * Open class {@code goog.math.Long}
   * @lends {goog.math.Long.prototype}
   */ ({
    /**
     * @type {string|number)}
     * @private
     */
    rawValue_: null, 

    /**
     * @type {number}
     * @private
     */
    rawDecimal_: 0, 

    /**
     * @type {sao.Operation}
     * @private
     */
    calculationMethod_: null,

    /**
     * @type {number}
     * @private
     */
    calculationMemberCount_: 0, 

    /**
     * @param {sao.Method} method
     * @param {number} memberCount
     */
    calculatedBy: function(method, memberCount) {
      this.calculationMethod_ = method;
      this.calculationMemberCount_ = memberCount;
    }, 

    /**
     * @return {sao.Method}
     */
    getCalculationMethod: function() {
      return this.calculationMethod_;
    }, 

    /**
     * @return {number}
     */
    getCalculationMemberCount: function() {
      return this.calculationMemberCount_;
    },

    /**
     * @param {(string|number)=} opt_value
     * @param {number=} opt_decimal
     */
    setRaw: function(opt_value, opt_decimal) {
      if (opt_value) {
        this.rawValue_ = opt_value;
      }
      this.rawDecimal_ = opt_decimal || 0;
    }, 

    /**
     * @param {number} decimal
     */
    setRawDecimal: function(decimal) {
      this.rawDecimal_ = decimal;
    },

    /**
     * @param {goog.math.Long} other
     */
    inheritRaw: function(other) {
      this.setRaw(other.getRawValue(), other.getRawDecimal());
    }, 

    /**
     * @return {(string|number)}
     */
    getRawValue: function() {
      return this.rawValue_;
    }, 

    /**
     * @return {number}
     */
    getRawDecimal: function() {
      return this.rawDecimal_;
    }, 

    /**
     * @return {boolean}
     */
    isRawDecimal: function() {
      return this.rawDecimal_ != 0;
    }
  })
);


goog.exportSymbol('sao.add', sao.add);
goog.exportSymbol('sao.div', sao.div);
goog.exportSymbol('sao.sub', sao.sub);
goog.exportSymbol('sao.mul', sao.mul);
goog.exportSymbol('sao.finalize', sao.finalize);
goog.exportSymbol('sao.round', sao.round);
