// lunr@2.3.9 downloaded from https://ga.jspm.io/npm:lunr@2.3.9/lunr.js

var e="undefined"!==typeof globalThis?globalThis:"undefined"!==typeof self?self:global;var t={};
/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.9
 * Copyright (C) 2020 Oliver Nightingale
 * @license MIT
 */(function(){var lunr=function(e){var t=new lunr.Builder;t.pipeline.add(lunr.trimmer,lunr.stopWordFilter,lunr.stemmer);t.searchPipeline.add(lunr.stemmer);e.call(t,t);return t.build()};lunr.version="2.3.9";lunr.utils={};
/**
   * Print a warning message to the console.
   *
   * @param {String} message The message to be printed.
   * @memberOf lunr.utils
   * @function
   */lunr.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this||e);
/**
   * Convert an object to a string.
   *
   * In the case of `null` and `undefined` the function returns
   * the empty string, in all other cases the result of calling
   * `toString` on the passed object is returned.
   *
   * @param {Any} obj The object to convert to a string.
   * @return {String} string representation of the passed object.
   * @memberOf lunr.utils
   */lunr.utils.asString=function(e){return void 0===e||null===e?"":e.toString()};
/**
   * Clones an object.
   *
   * Will create a copy of an existing object such that any mutations
   * on the copy cannot affect the original.
   *
   * Only shallow objects are supported, passing a nested object to this
   * function will cause a TypeError.
   *
   * Objects with primitives, and arrays of primitives are supported.
   *
   * @param {Object} obj The object to clone.
   * @return {Object} a clone of the passed object.
   * @throws {TypeError} when a nested object is passed.
   * @memberOf Utils
   */lunr.utils.clone=function(e){if(null===e||void 0===e)return e;var t=Object.create(null),r=Object.keys(e);for(var i=0;i<r.length;i++){var n=r[i],s=e[n];if(Array.isArray(s))t[n]=s.slice();else{if("string"!==typeof s&&"number"!==typeof s&&"boolean"!==typeof s)throw new TypeError("clone is not deep and does not support nested objects");t[n]=s}}return t};lunr.FieldRef=function(t,r,i){(this||e).docRef=t;(this||e).fieldName=r;(this||e)._stringValue=i};lunr.FieldRef.joiner="/";lunr.FieldRef.fromString=function(e){var t=e.indexOf(lunr.FieldRef.joiner);if(-1===t)throw"malformed field ref string";var r=e.slice(0,t),i=e.slice(t+1);return new lunr.FieldRef(i,r,e)};lunr.FieldRef.prototype.toString=function(){void 0==(this||e)._stringValue&&((this||e)._stringValue=(this||e).fieldName+lunr.FieldRef.joiner+(this||e).docRef);return(this||e)._stringValue};lunr.Set=function(t){(this||e).elements=Object.create(null);if(t){(this||e).length=t.length;for(var r=0;r<(this||e).length;r++)(this||e).elements[t[r]]=true}else(this||e).length=0};
/**
   * A complete set that contains all elements.
   *
   * @static
   * @readonly
   * @type {lunr.Set}
   */lunr.Set.complete={intersect:function(e){return e},union:function(){return this||e},contains:function(){return true}};
/**
   * An empty set that contains no elements.
   *
   * @static
   * @readonly
   * @type {lunr.Set}
   */lunr.Set.empty={intersect:function(){return this||e},union:function(e){return e},contains:function(){return false}};
/**
   * Returns true if this set contains the specified object.
   *
   * @param {object} object - Object whose presence in this set is to be tested.
   * @returns {boolean} - True if this set contains the specified object.
   */lunr.Set.prototype.contains=function(t){return!!(this||e).elements[t]};
/**
   * Returns a new set containing only the elements that are present in both
   * this set and the specified set.
   *
   * @param {lunr.Set} other - set to intersect with this set.
   * @returns {lunr.Set} a new set that is the intersection of this and the specified set.
   */lunr.Set.prototype.intersect=function(t){var r,i,n,s=[];if(t===lunr.Set.complete)return this||e;if(t===lunr.Set.empty)return t;if((this||e).length<t.length){r=this||e;i=t}else{r=t;i=this||e}n=Object.keys(r.elements);for(var a=0;a<n.length;a++){var o=n[a];o in i.elements&&s.push(o)}return new lunr.Set(s)};
/**
   * Returns a new set combining the elements of this and the specified set.
   *
   * @param {lunr.Set} other - set to union with this set.
   * @return {lunr.Set} a new set that is the union of this and the specified set.
   */lunr.Set.prototype.union=function(t){return t===lunr.Set.complete?lunr.Set.complete:t===lunr.Set.empty?this||e:new lunr.Set(Object.keys((this||e).elements).concat(Object.keys(t.elements)))};
/**
   * A function to calculate the inverse document frequency for
   * a posting. This is shared between the builder and the index
   *
   * @private
   * @param {object} posting - The posting for a given term
   * @param {number} documentCount - The total number of documents.
   */lunr.idf=function(e,t){var r=0;for(var i in e)"_index"!=i&&(r+=Object.keys(e[i]).length);var n=(t-r+.5)/(r+.5);return Math.log(1+Math.abs(n))};
/**
   * A token wraps a string representation of a token
   * as it is passed through the text processing pipeline.
   *
   * @constructor
   * @param {string} [str=''] - The string token being wrapped.
   * @param {object} [metadata={}] - Metadata associated with this token.
   */lunr.Token=function(t,r){(this||e).str=t||"";(this||e).metadata=r||{}};
/**
   * Returns the token string that is being wrapped by this object.
   *
   * @returns {string}
   */lunr.Token.prototype.toString=function(){return(this||e).str};
/**
   * A token update function is used when updating or optionally
   * when cloning a token.
   *
   * @callback lunr.Token~updateFunction
   * @param {string} str - The string representation of the token.
   * @param {Object} metadata - All metadata associated with this token.
   */
/**
   * Applies the given function to the wrapped string token.
   *
   * @example
   * token.update(function (str, metadata) {
   *   return str.toUpperCase()
   * })
   *
   * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.
   * @returns {lunr.Token}
   */lunr.Token.prototype.update=function(t){(this||e).str=t((this||e).str,(this||e).metadata);return this||e};
/**
   * Creates a clone of this token. Optionally a function can be
   * applied to the cloned token.
   *
   * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.
   * @returns {lunr.Token}
   */lunr.Token.prototype.clone=function(t){t=t||function(e){return e};return new lunr.Token(t((this||e).str,(this||e).metadata),(this||e).metadata)};
/**
   * A function for splitting a string into tokens ready to be inserted into
   * the search index. Uses `lunr.tokenizer.separator` to split strings, change
   * the value of this property to change how strings are split into tokens.
   *
   * This tokenizer will convert its parameter to a string by calling `toString` and
   * then will split this string on the character in `lunr.tokenizer.separator`.
   * Arrays will have their elements converted to strings and wrapped in a lunr.Token.
   *
   * Optional metadata can be passed to the tokenizer, this metadata will be cloned and
   * added as metadata to every token that is created from the object to be tokenized.
   *
   * @static
   * @param {?(string|object|object[])} obj - The object to convert into tokens
   * @param {?object} metadata - Optional metadata to associate with every token
   * @returns {lunr.Token[]}
   * @see {@link lunr.Pipeline}
   */lunr.tokenizer=function(e,t){if(null==e||void 0==e)return[];if(Array.isArray(e))return e.map((function(e){return new lunr.Token(lunr.utils.asString(e).toLowerCase(),lunr.utils.clone(t))}));var r=e.toString().toLowerCase(),i=r.length,n=[];for(var s=0,a=0;s<=i;s++){var o=r.charAt(s),u=s-a;if(o.match(lunr.tokenizer.separator)||s==i){if(u>0){var l=lunr.utils.clone(t)||{};l["position"]=[a,u];l["index"]=n.length;n.push(new lunr.Token(r.slice(a,s),l))}a=s+1}}return n};lunr.tokenizer.separator=/[\s\-]+/;lunr.Pipeline=function(){(this||e)._stack=[]};lunr.Pipeline.registeredFunctions=Object.create(null);
/**
   * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token
   * string as well as all known metadata. A pipeline function can mutate the token string
   * or mutate (or add) metadata for a given token.
   *
   * A pipeline function can indicate that the passed token should be discarded by returning
   * null, undefined or an empty string. This token will not be passed to any downstream pipeline
   * functions and will not be added to the index.
   *
   * Multiple tokens can be returned by returning an array of tokens. Each token will be passed
   * to any downstream pipeline functions and all will returned tokens will be added to the index.
   *
   * Any number of pipeline functions may be chained together using a lunr.Pipeline.
   *
   * @interface lunr.PipelineFunction
   * @param {lunr.Token} token - A token from the document being processed.
   * @param {number} i - The index of this token in the complete list of tokens for this document/field.
   * @param {lunr.Token[]} tokens - All tokens for this document/field.
   * @returns {(?lunr.Token|lunr.Token[])}
   */
/**
   * Register a function with the pipeline.
   *
   * Functions that are used in the pipeline should be registered if the pipeline
   * needs to be serialised, or a serialised pipeline needs to be loaded.
   *
   * Registering a function does not add it to a pipeline, functions must still be
   * added to instances of the pipeline for them to be used when running a pipeline.
   *
   * @param {lunr.PipelineFunction} fn - The function to check for.
   * @param {String} label - The label to register this function with
   */lunr.Pipeline.registerFunction=function(t,r){r in(this||e).registeredFunctions&&lunr.utils.warn("Overwriting existing registered function: "+r);t.label=r;lunr.Pipeline.registeredFunctions[t.label]=t};
/**
   * Warns if the function is not registered as a Pipeline function.
   *
   * @param {lunr.PipelineFunction} fn - The function to check for.
   * @private
   */lunr.Pipeline.warnIfFunctionNotRegistered=function(t){var r=t.label&&t.label in(this||e).registeredFunctions;r||lunr.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",t)};
/**
   * Loads a previously serialised pipeline.
   *
   * All functions to be loaded must already be registered with lunr.Pipeline.
   * If any function from the serialised data has not been registered then an
   * error will be thrown.
   *
   * @param {Object} serialised - The serialised pipeline to load.
   * @returns {lunr.Pipeline}
   */lunr.Pipeline.load=function(e){var t=new lunr.Pipeline;e.forEach((function(e){var r=lunr.Pipeline.registeredFunctions[e];if(!r)throw new Error("Cannot load unregistered function: "+e);t.add(r)}));return t};
/**
   * Adds new functions to the end of the pipeline.
   *
   * Logs a warning if the function has not been registered.
   *
   * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.
   */lunr.Pipeline.prototype.add=function(){var t=Array.prototype.slice.call(arguments);t.forEach((function(t){lunr.Pipeline.warnIfFunctionNotRegistered(t);(this||e)._stack.push(t)}),this||e)};
/**
   * Adds a single function after a function that already exists in the
   * pipeline.
   *
   * Logs a warning if the function has not been registered.
   *
   * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
   * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
   */lunr.Pipeline.prototype.after=function(t,r){lunr.Pipeline.warnIfFunctionNotRegistered(r);var i=(this||e)._stack.indexOf(t);if(-1==i)throw new Error("Cannot find existingFn");i+=1;(this||e)._stack.splice(i,0,r)};
/**
   * Adds a single function before a function that already exists in the
   * pipeline.
   *
   * Logs a warning if the function has not been registered.
   *
   * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
   * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
   */lunr.Pipeline.prototype.before=function(t,r){lunr.Pipeline.warnIfFunctionNotRegistered(r);var i=(this||e)._stack.indexOf(t);if(-1==i)throw new Error("Cannot find existingFn");(this||e)._stack.splice(i,0,r)};
/**
   * Removes a function from the pipeline.
   *
   * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.
   */lunr.Pipeline.prototype.remove=function(t){var r=(this||e)._stack.indexOf(t);-1!=r&&(this||e)._stack.splice(r,1)};
/**
   * Runs the current list of functions that make up the pipeline against the
   * passed tokens.
   *
   * @param {Array} tokens The tokens to run through the pipeline.
   * @returns {Array}
   */lunr.Pipeline.prototype.run=function(t){var r=(this||e)._stack.length;for(var i=0;i<r;i++){var n=(this||e)._stack[i];var s=[];for(var a=0;a<t.length;a++){var o=n(t[a],a,t);if(null!==o&&void 0!==o&&""!==o)if(Array.isArray(o))for(var u=0;u<o.length;u++)s.push(o[u]);else s.push(o)}t=s}return t};
/**
   * Convenience method for passing a string through a pipeline and getting
   * strings out. This method takes care of wrapping the passed string in a
   * token and mapping the resulting tokens back to strings.
   *
   * @param {string} str - The string to pass through the pipeline.
   * @param {?object} metadata - Optional metadata to associate with the token
   * passed to the pipeline.
   * @returns {string[]}
   */lunr.Pipeline.prototype.runString=function(e,t){var r=new lunr.Token(e,t);return this.run([r]).map((function(e){return e.toString()}))};lunr.Pipeline.prototype.reset=function(){(this||e)._stack=[]};
/**
   * Returns a representation of the pipeline ready for serialisation.
   *
   * Logs a warning if the function has not been registered.
   *
   * @returns {Array}
   */lunr.Pipeline.prototype.toJSON=function(){return(this||e)._stack.map((function(e){lunr.Pipeline.warnIfFunctionNotRegistered(e);return e.label}))};
/**
   * A vector is used to construct the vector space of documents and queries. These
   * vectors support operations to determine the similarity between two documents or
   * a document and a query.
   *
   * Normally no parameters are required for initializing a vector, but in the case of
   * loading a previously dumped vector the raw elements can be provided to the constructor.
   *
   * For performance reasons vectors are implemented with a flat array, where an elements
   * index is immediately followed by its value. E.g. [index, value, index, value]. This
   * allows the underlying array to be as sparse as possible and still offer decent
   * performance when being used for vector calculations.
   *
   * @constructor
   * @param {Number[]} [elements] - The flat list of element index and element value pairs.
   */lunr.Vector=function(t){(this||e)._magnitude=0;(this||e).elements=t||[]};
/**
   * Calculates the position within the vector to insert a given index.
   *
   * This is used internally by insert and upsert. If there are duplicate indexes then
   * the position is returned as if the value for that index were to be updated, but it
   * is the callers responsibility to check whether there is a duplicate at that index
   *
   * @param {Number} insertIdx - The index at which the element should be inserted.
   * @returns {Number}
   */lunr.Vector.prototype.positionForIndex=function(t){if(0==(this||e).elements.length)return 0;var r=0,i=(this||e).elements.length/2,n=i-r,s=Math.floor(n/2),a=(this||e).elements[2*s];while(n>1){a<t&&(r=s);a>t&&(i=s);if(a==t)break;n=i-r;s=r+Math.floor(n/2);a=(this||e).elements[2*s]}return a==t||a>t?2*s:a<t?2*(s+1):void 0};
/**
   * Inserts an element at an index within the vector.
   *
   * Does not allow duplicates, will throw an error if there is already an entry
   * for this index.
   *
   * @param {Number} insertIdx - The index at which the element should be inserted.
   * @param {Number} val - The value to be inserted into the vector.
   */lunr.Vector.prototype.insert=function(e,t){this.upsert(e,t,(function(){throw"duplicate index"}))};
/**
   * Inserts or updates an existing index within the vector.
   *
   * @param {Number} insertIdx - The index at which the element should be inserted.
   * @param {Number} val - The value to be inserted into the vector.
   * @param {function} fn - A function that is called for updates, the existing value and the
   * requested value are passed as arguments
   */lunr.Vector.prototype.upsert=function(t,r,i){(this||e)._magnitude=0;var n=this.positionForIndex(t);(this||e).elements[n]==t?(this||e).elements[n+1]=i((this||e).elements[n+1],r):(this||e).elements.splice(n,0,t,r)};
/**
   * Calculates the magnitude of this vector.
   *
   * @returns {Number}
   */lunr.Vector.prototype.magnitude=function(){if((this||e)._magnitude)return(this||e)._magnitude;var t=0,r=(this||e).elements.length;for(var i=1;i<r;i+=2){var n=(this||e).elements[i];t+=n*n}return(this||e)._magnitude=Math.sqrt(t)};
/**
   * Calculates the dot product of this vector and another vector.
   *
   * @param {lunr.Vector} otherVector - The vector to compute the dot product with.
   * @returns {Number}
   */lunr.Vector.prototype.dot=function(t){var r=0,i=(this||e).elements,n=t.elements,s=i.length,a=n.length,o=0,u=0,l=0,c=0;while(l<s&&c<a){o=i[l],u=n[c];if(o<u)l+=2;else if(o>u)c+=2;else if(o==u){r+=i[l+1]*n[c+1];l+=2;c+=2}}return r};
/**
   * Calculates the similarity between this vector and another vector.
   *
   * @param {lunr.Vector} otherVector - The other vector to calculate the
   * similarity with.
   * @returns {Number}
   */lunr.Vector.prototype.similarity=function(e){return this.dot(e)/this.magnitude()||0};
/**
   * Converts the vector to an array of the elements within the vector.
   *
   * @returns {Number[]}
   */lunr.Vector.prototype.toArray=function(){var t=new Array((this||e).elements.length/2);for(var r=1,i=0;r<(this||e).elements.length;r+=2,i++)t[i]=(this||e).elements[r];return t};
/**
   * A JSON serializable representation of the vector.
   *
   * @returns {Number[]}
   */lunr.Vector.prototype.toJSON=function(){return(this||e).elements};
/**
   * lunr.stemmer is an english language stemmer, this is a JavaScript
   * implementation of the PorterStemmer taken from http://tartarus.org/~martin
   *
   * @static
   * @implements {lunr.PipelineFunction}
   * @param {lunr.Token} token - The string to stem
   * @returns {lunr.Token}
   * @see {@link lunr.Pipeline}
   * @function
   */lunr.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},r="[^aeiou]",i="[aeiouy]",n=r+"[^aeiouy]*",s=i+"[aeiou]*",a="^("+n+")?"+s+n,o="^("+n+")?"+s+n+"("+s+")?$",u="^("+n+")?"+s+n+s+n,l="^("+n+")?"+i;var c=new RegExp(a);var h=new RegExp(u);var d=new RegExp(o);var f=new RegExp(l);var p=/^(.+?)(ss|i)es$/;var y=/^(.+?)([^s])s$/;var v=/^(.+?)eed$/;var m=/^(.+?)(ed|ing)$/;var g=/.$/;var x=/(at|bl|iz)$/;var w=new RegExp("([^aeiouylsz])\\1$");var Q=new RegExp("^"+n+i+"[^aeiouwxy]$");var k=/^(.+?[^aeiou])y$/;var S=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;var E=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;var b=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;var L=/^(.+?)(s|t)(ion)$/;var P=/^(.+?)e$/;var T=/ll$/;var O=new RegExp("^"+n+i+"[^aeiouwxy]$");var I=function porterStemmer(r){var i,n,s,a,o,u,l;if(r.length<3)return r;s=r.substr(0,1);"y"==s&&(r=s.toUpperCase()+r.substr(1));a=p;o=y;a.test(r)?r=r.replace(a,"$1$2"):o.test(r)&&(r=r.replace(o,"$1$2"));a=v;o=m;if(a.test(r)){var I=a.exec(r);a=c;if(a.test(I[1])){a=g;r=r.replace(a,"")}}else if(o.test(r)){var I=o.exec(r);i=I[1];o=f;if(o.test(i)){r=i;o=x;u=w;l=Q;if(o.test(r))r+="e";else if(u.test(r)){a=g;r=r.replace(a,"")}else l.test(r)&&(r+="e")}}a=k;if(a.test(r)){var I=a.exec(r);i=I[1];r=i+"i"}a=S;if(a.test(r)){var I=a.exec(r);i=I[1];n=I[2];a=c;a.test(i)&&(r=i+e[n])}a=E;if(a.test(r)){var I=a.exec(r);i=I[1];n=I[2];a=c;a.test(i)&&(r=i+t[n])}a=b;o=L;if(a.test(r)){var I=a.exec(r);i=I[1];a=h;a.test(i)&&(r=i)}else if(o.test(r)){var I=o.exec(r);i=I[1]+I[2];o=h;o.test(i)&&(r=i)}a=P;if(a.test(r)){var I=a.exec(r);i=I[1];a=h;o=d;u=O;(a.test(i)||o.test(i)&&!u.test(i))&&(r=i)}a=T;o=h;if(a.test(r)&&o.test(r)){a=g;r=r.replace(a,"")}"y"==s&&(r=s.toLowerCase()+r.substr(1));return r};return function(e){return e.update(I)}}();lunr.Pipeline.registerFunction(lunr.stemmer,"stemmer");
/**
   * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
   * list of stop words.
   *
   * The built in lunr.stopWordFilter is built using this generator and can be used
   * to generate custom stopWordFilters for applications or non English languages.
   *
   * @function
   * @param {Array} token The token to pass through the filter
   * @returns {lunr.PipelineFunction}
   * @see lunr.Pipeline
   * @see lunr.stopWordFilter
   */lunr.generateStopWordFilter=function(e){var t=e.reduce((function(e,t){e[t]=t;return e}),{});return function(e){if(e&&t[e.toString()]!==e.toString())return e}};
/**
   * lunr.stopWordFilter is an English language stop word list filter, any words
   * contained in the list will not be passed through the filter.
   *
   * This is intended to be used in the Pipeline. If the token does not pass the
   * filter then undefined will be returned.
   *
   * @function
   * @implements {lunr.PipelineFunction}
   * @params {lunr.Token} token - A token to check for being a stop word.
   * @returns {lunr.Token}
   * @see {@link lunr.Pipeline}
   */lunr.stopWordFilter=lunr.generateStopWordFilter(["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"]);lunr.Pipeline.registerFunction(lunr.stopWordFilter,"stopWordFilter");
/**
   * lunr.trimmer is a pipeline function for trimming non word
   * characters from the beginning and end of tokens before they
   * enter the index.
   *
   * This implementation may not work correctly for non latin
   * characters and should either be removed or adapted for use
   * with languages with non-latin characters.
   *
   * @static
   * @implements {lunr.PipelineFunction}
   * @param {lunr.Token} token The token to pass through the filter
   * @returns {lunr.Token}
   * @see lunr.Pipeline
   */lunr.trimmer=function(e){return e.update((function(e){return e.replace(/^\W+/,"").replace(/\W+$/,"")}))};lunr.Pipeline.registerFunction(lunr.trimmer,"trimmer");lunr.TokenSet=function(){(this||e).final=false;(this||e).edges={};(this||e).id=lunr.TokenSet._nextId;lunr.TokenSet._nextId+=1};lunr.TokenSet._nextId=1;
/**
   * Creates a TokenSet instance from the given sorted array of words.
   *
   * @param {String[]} arr - A sorted array of strings to create the set from.
   * @returns {lunr.TokenSet}
   * @throws Will throw an error if the input array is not sorted.
   */lunr.TokenSet.fromArray=function(e){var t=new lunr.TokenSet.Builder;for(var r=0,i=e.length;r<i;r++)t.insert(e[r]);t.finish();return t.root};
/**
   * Creates a token set from a query clause.
   *
   * @private
   * @param {Object} clause - A single clause from lunr.Query.
   * @param {string} clause.term - The query clause term.
   * @param {number} [clause.editDistance] - The optional edit distance for the term.
   * @returns {lunr.TokenSet}
   */lunr.TokenSet.fromClause=function(e){return"editDistance"in e?lunr.TokenSet.fromFuzzyString(e.term,e.editDistance):lunr.TokenSet.fromString(e.term)};
/**
   * Creates a token set representing a single string with a specified
   * edit distance.
   *
   * Insertions, deletions, substitutions and transpositions are each
   * treated as an edit distance of 1.
   *
   * Increasing the allowed edit distance will have a dramatic impact
   * on the performance of both creating and intersecting these TokenSets.
   * It is advised to keep the edit distance less than 3.
   *
   * @param {string} str - The string to create the token set from.
   * @param {number} editDistance - The allowed edit distance to match.
   * @returns {lunr.Vector}
   */lunr.TokenSet.fromFuzzyString=function(e,t){var r=new lunr.TokenSet;var i=[{node:r,editsRemaining:t,str:e}];while(i.length){var n=i.pop();if(n.str.length>0){var s=n.str.charAt(0),a;if(s in n.node.edges)a=n.node.edges[s];else{a=new lunr.TokenSet;n.node.edges[s]=a}1==n.str.length&&(a.final=true);i.push({node:a,editsRemaining:n.editsRemaining,str:n.str.slice(1)})}if(0!=n.editsRemaining){if("*"in n.node.edges)var o=n.node.edges["*"];else{var o=new lunr.TokenSet;n.node.edges["*"]=o}0==n.str.length&&(o.final=true);i.push({node:o,editsRemaining:n.editsRemaining-1,str:n.str});n.str.length>1&&i.push({node:n.node,editsRemaining:n.editsRemaining-1,str:n.str.slice(1)});1==n.str.length&&(n.node.final=true);if(n.str.length>=1){if("*"in n.node.edges)var u=n.node.edges["*"];else{var u=new lunr.TokenSet;n.node.edges["*"]=u}1==n.str.length&&(u.final=true);i.push({node:u,editsRemaining:n.editsRemaining-1,str:n.str.slice(1)})}if(n.str.length>1){var l=n.str.charAt(0),c=n.str.charAt(1),h;if(c in n.node.edges)h=n.node.edges[c];else{h=new lunr.TokenSet;n.node.edges[c]=h}1==n.str.length&&(h.final=true);i.push({node:h,editsRemaining:n.editsRemaining-1,str:l+n.str.slice(2)})}}}return r};
/**
   * Creates a TokenSet from a string.
   *
   * The string may contain one or more wildcard characters (*)
   * that will allow wildcard matching when intersecting with
   * another TokenSet.
   *
   * @param {string} str - The string to create a TokenSet from.
   * @returns {lunr.TokenSet}
   */lunr.TokenSet.fromString=function(e){var t=new lunr.TokenSet,r=t;for(var i=0,n=e.length;i<n;i++){var s=e[i],a=i==n-1;if("*"==s){t.edges[s]=t;t.final=a}else{var o=new lunr.TokenSet;o.final=a;t.edges[s]=o;t=o}}return r};
/**
   * Converts this TokenSet into an array of strings
   * contained within the TokenSet.
   *
   * This is not intended to be used on a TokenSet that
   * contains wildcards, in these cases the results are
   * undefined and are likely to cause an infinite loop.
   *
   * @returns {string[]}
   */lunr.TokenSet.prototype.toArray=function(){var t=[];var r=[{prefix:"",node:this||e}];while(r.length){var i=r.pop(),n=Object.keys(i.node.edges),s=n.length;if(i.node.final){i.prefix.charAt(0);t.push(i.prefix)}for(var a=0;a<s;a++){var o=n[a];r.push({prefix:i.prefix.concat(o),node:i.node.edges[o]})}}return t};
/**
   * Generates a string representation of a TokenSet.
   *
   * This is intended to allow TokenSets to be used as keys
   * in objects, largely to aid the construction and minimisation
   * of a TokenSet. As such it is not designed to be a human
   * friendly representation of the TokenSet.
   *
   * @returns {string}
   */lunr.TokenSet.prototype.toString=function(){if((this||e)._str)return(this||e)._str;var t=(this||e).final?"1":"0",r=Object.keys((this||e).edges).sort(),i=r.length;for(var n=0;n<i;n++){var s=r[n],a=(this||e).edges[s];t=t+s+a.id}return t};
/**
   * Returns a new TokenSet that is the intersection of
   * this TokenSet and the passed TokenSet.
   *
   * This intersection will take into account any wildcards
   * contained within the TokenSet.
   *
   * @param {lunr.TokenSet} b - An other TokenSet to intersect with.
   * @returns {lunr.TokenSet}
   */lunr.TokenSet.prototype.intersect=function(t){var r=new lunr.TokenSet,i=void 0;var n=[{qNode:t,output:r,node:this||e}];while(n.length){i=n.pop();var s=Object.keys(i.qNode.edges),a=s.length,o=Object.keys(i.node.edges),u=o.length;for(var l=0;l<a;l++){var c=s[l];for(var h=0;h<u;h++){var d=o[h];if(d==c||"*"==c){var f=i.node.edges[d],p=i.qNode.edges[c],y=f.final&&p.final,v=void 0;if(d in i.output.edges){v=i.output.edges[d];v.final=v.final||y}else{v=new lunr.TokenSet;v.final=y;i.output.edges[d]=v}n.push({qNode:p,output:v,node:f})}}}}return r};lunr.TokenSet.Builder=function(){(this||e).previousWord="";(this||e).root=new lunr.TokenSet;(this||e).uncheckedNodes=[];(this||e).minimizedNodes={}};lunr.TokenSet.Builder.prototype.insert=function(t){var r,i=0;if(t<(this||e).previousWord)throw new Error("Out of order word insertion");for(var n=0;n<t.length&&n<(this||e).previousWord.length;n++){if(t[n]!=(this||e).previousWord[n])break;i++}this.minimize(i);r=0==(this||e).uncheckedNodes.length?(this||e).root:(this||e).uncheckedNodes[(this||e).uncheckedNodes.length-1].child;for(var n=i;n<t.length;n++){var s=new lunr.TokenSet,a=t[n];r.edges[a]=s;(this||e).uncheckedNodes.push({parent:r,char:a,child:s});r=s}r.final=true;(this||e).previousWord=t};lunr.TokenSet.Builder.prototype.finish=function(){this.minimize(0)};lunr.TokenSet.Builder.prototype.minimize=function(t){for(var r=(this||e).uncheckedNodes.length-1;r>=t;r--){var i=(this||e).uncheckedNodes[r],n=i.child.toString();if(n in(this||e).minimizedNodes)i.parent.edges[i.char]=(this||e).minimizedNodes[n];else{i.child._str=n;(this||e).minimizedNodes[n]=i.child}(this||e).uncheckedNodes.pop()}};
/**
   * An index contains the built index of all documents and provides a query interface
   * to the index.
   *
   * Usually instances of lunr.Index will not be created using this constructor, instead
   * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be
   * used to load previously built and serialized indexes.
   *
   * @constructor
   * @param {Object} attrs - The attributes of the built search index.
   * @param {Object} attrs.invertedIndex - An index of term/field to document reference.
   * @param {Object<string, lunr.Vector>} attrs.fieldVectors - Field vectors
   * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.
   * @param {string[]} attrs.fields - The names of indexed document fields.
   * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.
   */lunr.Index=function(t){(this||e).invertedIndex=t.invertedIndex;(this||e).fieldVectors=t.fieldVectors;(this||e).tokenSet=t.tokenSet;(this||e).fields=t.fields;(this||e).pipeline=t.pipeline};
/**
   * A result contains details of a document matching a search query.
   * @typedef {Object} lunr.Index~Result
   * @property {string} ref - The reference of the document this result represents.
   * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.
   * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.
   */
/**
   * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple
   * query language which itself is parsed into an instance of lunr.Query.
   *
   * For programmatically building queries it is advised to directly use lunr.Query, the query language
   * is best used for human entered text rather than program generated text.
   *
   * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported
   * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'
   * or 'world', though those that contain both will rank higher in the results.
   *
   * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can
   * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding
   * wildcards will increase the number of documents that will be found but can also have a negative
   * impact on query performance, especially with wildcards at the beginning of a term.
   *
   * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term
   * hello in the title field will match this query. Using a field not present in the index will lead
   * to an error being thrown.
   *
   * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term
   * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported
   * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.
   * Avoid large values for edit distance to improve query performance.
   *
   * Each term also supports a presence modifier. By default a term's presence in document is optional, however
   * this can be changed to either required or prohibited. For a term's presence to be required in a document the
   * term should be prefixed with a '+', e.g. `+foo bar` is a search for documents that must contain 'foo' and
   * optionally contain 'bar'. Conversely a leading '-' sets the terms presence to prohibited, i.e. it must not
   * appear in a document, e.g. `-foo bar` is a search for documents that do not contain 'foo' but may contain 'bar'.
   *
   * To escape special characters the backslash character '\' can be used, this allows searches to include
   * characters that would normally be considered modifiers, e.g. `foo\~2` will search for a term "foo~2" instead
   * of attempting to apply a boost of 2 to the search term "foo".
   *
   * @typedef {string} lunr.Index~QueryString
   * @example <caption>Simple single term query</caption>
   * hello
   * @example <caption>Multiple term query</caption>
   * hello world
   * @example <caption>term scoped to a field</caption>
   * title:hello
   * @example <caption>term with a boost of 10</caption>
   * hello^10
   * @example <caption>term with an edit distance of 2</caption>
   * hello~2
   * @example <caption>terms with presence modifiers</caption>
   * -foo +bar baz
   */
/**
   * Performs a search against the index using lunr query syntax.
   *
   * Results will be returned sorted by their score, the most relevant results
   * will be returned first.  For details on how the score is calculated, please see
   * the {@link https://lunrjs.com/guides/searching.html#scoring|guide}.
   *
   * For more programmatic querying use lunr.Index#query.
   *
   * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.
   * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.
   * @returns {lunr.Index~Result[]}
   */lunr.Index.prototype.search=function(e){return this.query((function(t){var r=new lunr.QueryParser(e,t);r.parse()}))};
/**
   * A query builder callback provides a query object to be used to express
   * the query to perform on the index.
   *
   * @callback lunr.Index~queryBuilder
   * @param {lunr.Query} query - The query object to build up.
   * @this lunr.Query
   */
/**
   * Performs a query against the index using the yielded lunr.Query object.
   *
   * If performing programmatic queries against the index, this method is preferred
   * over lunr.Index#search so as to avoid the additional query parsing overhead.
   *
   * A query object is yielded to the supplied function which should be used to
   * express the query to be run against the index.
   *
   * Note that although this function takes a callback parameter it is _not_ an
   * asynchronous operation, the callback is just yielded a query object to be
   * customized.
   *
   * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.
   * @returns {lunr.Index~Result[]}
   */lunr.Index.prototype.query=function(t){var r=new lunr.Query((this||e).fields),i=Object.create(null),n=Object.create(null),s=Object.create(null),a=Object.create(null),o=Object.create(null);for(var u=0;u<(this||e).fields.length;u++)n[(this||e).fields[u]]=new lunr.Vector;t.call(r,r);for(var u=0;u<r.clauses.length;u++){var l=r.clauses[u],c=null,h=lunr.Set.empty;c=l.usePipeline?(this||e).pipeline.runString(l.term,{fields:l.fields}):[l.term];for(var d=0;d<c.length;d++){var f=c[d];l.term=f;var p=lunr.TokenSet.fromClause(l),y=(this||e).tokenSet.intersect(p).toArray();if(0===y.length&&l.presence===lunr.Query.presence.REQUIRED){for(var v=0;v<l.fields.length;v++){var m=l.fields[v];a[m]=lunr.Set.empty}break}for(var g=0;g<y.length;g++){var x=y[g],w=(this||e).invertedIndex[x],Q=w._index;for(var v=0;v<l.fields.length;v++){var m=l.fields[v],k=w[m],S=Object.keys(k),E=x+"/"+m,b=new lunr.Set(S);if(l.presence==lunr.Query.presence.REQUIRED){h=h.union(b);void 0===a[m]&&(a[m]=lunr.Set.complete)}if(l.presence!=lunr.Query.presence.PROHIBITED){n[m].upsert(Q,l.boost,(function(e,t){return e+t}));if(!s[E]){for(var L=0;L<S.length;L++){var P=S[L],T=new lunr.FieldRef(P,m),O=k[P],I;void 0===(I=i[T])?i[T]=new lunr.MatchData(x,m,O):I.add(x,m,O)}s[E]=true}}else{void 0===o[m]&&(o[m]=lunr.Set.empty);o[m]=o[m].union(b)}}}}if(l.presence===lunr.Query.presence.REQUIRED)for(var v=0;v<l.fields.length;v++){var m=l.fields[v];a[m]=a[m].intersect(h)}}var R=lunr.Set.complete,F=lunr.Set.empty;for(var u=0;u<(this||e).fields.length;u++){var m=(this||e).fields[u];a[m]&&(R=R.intersect(a[m]));o[m]&&(F=F.union(o[m]))}var C=Object.keys(i),N=[],_=Object.create(null);if(r.isNegated()){C=Object.keys((this||e).fieldVectors);for(var u=0;u<C.length;u++){var T=C[u];var j=lunr.FieldRef.fromString(T);i[T]=new lunr.MatchData}}for(var u=0;u<C.length;u++){var j=lunr.FieldRef.fromString(C[u]),D=j.docRef;if(R.contains(D)&&!F.contains(D)){var A=(this||e).fieldVectors[j],B=n[j.fieldName].similarity(A),V;if(void 0!==(V=_[D])){V.score+=B;V.matchData.combine(i[j])}else{var z={ref:D,score:B,matchData:i[j]};_[D]=z;N.push(z)}}}return N.sort((function(e,t){return t.score-e.score}))};
/**
   * Prepares the index for JSON serialization.
   *
   * The schema for this JSON blob will be described in a
   * separate JSON schema file.
   *
   * @returns {Object}
   */lunr.Index.prototype.toJSON=function(){var t=Object.keys((this||e).invertedIndex).sort().map((function(t){return[t,(this||e).invertedIndex[t]]}),this||e);var r=Object.keys((this||e).fieldVectors).map((function(t){return[t,(this||e).fieldVectors[t].toJSON()]}),this||e);return{version:lunr.version,fields:(this||e).fields,fieldVectors:r,invertedIndex:t,pipeline:(this||e).pipeline.toJSON()}};
/**
   * Loads a previously serialized lunr.Index
   *
   * @param {Object} serializedIndex - A previously serialized lunr.Index
   * @returns {lunr.Index}
   */lunr.Index.load=function(e){var t={},r={},i=e.fieldVectors,n=Object.create(null),s=e.invertedIndex,a=new lunr.TokenSet.Builder,o=lunr.Pipeline.load(e.pipeline);e.version!=lunr.version&&lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '"+lunr.version+"' does not match serialized index '"+e.version+"'");for(var u=0;u<i.length;u++){var l=i[u],c=l[0],h=l[1];r[c]=new lunr.Vector(h)}for(var u=0;u<s.length;u++){var l=s[u],d=l[0],f=l[1];a.insert(d);n[d]=f}a.finish();t.fields=e.fields;t.fieldVectors=r;t.invertedIndex=n;t.tokenSet=a.root;t.pipeline=o;return new lunr.Index(t)};lunr.Builder=function(){(this||e)._ref="id";(this||e)._fields=Object.create(null);(this||e)._documents=Object.create(null);(this||e).invertedIndex=Object.create(null);(this||e).fieldTermFrequencies={};(this||e).fieldLengths={};(this||e).tokenizer=lunr.tokenizer;(this||e).pipeline=new lunr.Pipeline;(this||e).searchPipeline=new lunr.Pipeline;(this||e).documentCount=0;(this||e)._b=.75;(this||e)._k1=1.2;(this||e).termIndex=0;(this||e).metadataWhitelist=[]};
/**
   * Sets the document field used as the document reference. Every document must have this field.
   * The type of this field in the document should be a string, if it is not a string it will be
   * coerced into a string by calling toString.
   *
   * The default ref is 'id'.
   *
   * The ref should _not_ be changed during indexing, it should be set before any documents are
   * added to the index. Changing it during indexing can lead to inconsistent results.
   *
   * @param {string} ref - The name of the reference field in the document.
   */lunr.Builder.prototype.ref=function(t){(this||e)._ref=t};
/**
   * A function that is used to extract a field from a document.
   *
   * Lunr expects a field to be at the top level of a document, if however the field
   * is deeply nested within a document an extractor function can be used to extract
   * the right field for indexing.
   *
   * @callback fieldExtractor
   * @param {object} doc - The document being added to the index.
   * @returns {?(string|object|object[])} obj - The object that will be indexed for this field.
   * @example <caption>Extracting a nested field</caption>
   * function (doc) { return doc.nested.field }
   */
/**
   * Adds a field to the list of document fields that will be indexed. Every document being
   * indexed should have this field. Null values for this field in indexed documents will
   * not cause errors but will limit the chance of that document being retrieved by searches.
   *
   * All fields should be added before adding documents to the index. Adding fields after
   * a document has been indexed will have no effect on already indexed documents.
   *
   * Fields can be boosted at build time. This allows terms within that field to have more
   * importance when ranking search results. Use a field boost to specify that matches within
   * one field are more important than other fields.
   *
   * @param {string} fieldName - The name of a field to index in all documents.
   * @param {object} attributes - Optional attributes associated with this field.
   * @param {number} [attributes.boost=1] - Boost applied to all terms within this field.
   * @param {fieldExtractor} [attributes.extractor] - Function to extract a field from a document.
   * @throws {RangeError} fieldName cannot contain unsupported characters '/'
   */lunr.Builder.prototype.field=function(t,r){if(/\//.test(t))throw new RangeError("Field '"+t+"' contains illegal character '/'");(this||e)._fields[t]=r||{}};
/**
   * A parameter to tune the amount of field length normalisation that is applied when
   * calculating relevance scores. A value of 0 will completely disable any normalisation
   * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b
   * will be clamped to the range 0 - 1.
   *
   * @param {number} number - The value to set for this tuning parameter.
   */lunr.Builder.prototype.b=function(t){(this||e)._b=t<0?0:t>1?1:t};
/**
   * A parameter that controls the speed at which a rise in term frequency results in term
   * frequency saturation. The default value is 1.2. Setting this to a higher value will give
   * slower saturation levels, a lower value will result in quicker saturation.
   *
   * @param {number} number - The value to set for this tuning parameter.
   */lunr.Builder.prototype.k1=function(t){(this||e)._k1=t};
/**
   * Adds a document to the index.
   *
   * Before adding fields to the index the index should have been fully setup, with the document
   * ref and all fields to index already having been specified.
   *
   * The document must have a field name as specified by the ref (by default this is 'id') and
   * it should have all fields defined for indexing, though null or undefined values will not
   * cause errors.
   *
   * Entire documents can be boosted at build time. Applying a boost to a document indicates that
   * this document should rank higher in search results than other documents.
   *
   * @param {object} doc - The document to add to the index.
   * @param {object} attributes - Optional attributes associated with this document.
   * @param {number} [attributes.boost=1] - Boost applied to all terms within this document.
   */lunr.Builder.prototype.add=function(t,r){var i=t[(this||e)._ref],n=Object.keys((this||e)._fields);(this||e)._documents[i]=r||{};(this||e).documentCount+=1;for(var s=0;s<n.length;s++){var a=n[s],o=(this||e)._fields[a].extractor,u=o?o(t):t[a],l=this.tokenizer(u,{fields:[a]}),c=(this||e).pipeline.run(l),h=new lunr.FieldRef(i,a),d=Object.create(null);(this||e).fieldTermFrequencies[h]=d;(this||e).fieldLengths[h]=0;(this||e).fieldLengths[h]+=c.length;for(var f=0;f<c.length;f++){var p=c[f];void 0==d[p]&&(d[p]=0);d[p]+=1;if(void 0==(this||e).invertedIndex[p]){var y=Object.create(null);y["_index"]=(this||e).termIndex;(this||e).termIndex+=1;for(var v=0;v<n.length;v++)y[n[v]]=Object.create(null);(this||e).invertedIndex[p]=y}void 0==(this||e).invertedIndex[p][a][i]&&((this||e).invertedIndex[p][a][i]=Object.create(null));for(var m=0;m<(this||e).metadataWhitelist.length;m++){var g=(this||e).metadataWhitelist[m],x=p.metadata[g];void 0==(this||e).invertedIndex[p][a][i][g]&&((this||e).invertedIndex[p][a][i][g]=[]);(this||e).invertedIndex[p][a][i][g].push(x)}}}};lunr.Builder.prototype.calculateAverageFieldLengths=function(){var t=Object.keys((this||e).fieldLengths),r=t.length,i={},n={};for(var s=0;s<r;s++){var a=lunr.FieldRef.fromString(t[s]),o=a.fieldName;n[o]||(n[o]=0);n[o]+=1;i[o]||(i[o]=0);i[o]+=(this||e).fieldLengths[a]}var u=Object.keys((this||e)._fields);for(var s=0;s<u.length;s++){var l=u[s];i[l]=i[l]/n[l]}(this||e).averageFieldLength=i};lunr.Builder.prototype.createFieldVectors=function(){var t={},r=Object.keys((this||e).fieldTermFrequencies),i=r.length,n=Object.create(null);for(var s=0;s<i;s++){var a=lunr.FieldRef.fromString(r[s]),o=a.fieldName,u=(this||e).fieldLengths[a],l=new lunr.Vector,c=(this||e).fieldTermFrequencies[a],h=Object.keys(c),d=h.length;var f=(this||e)._fields[o].boost||1,p=(this||e)._documents[a.docRef].boost||1;for(var y=0;y<d;y++){var v=h[y],m=c[v],g=(this||e).invertedIndex[v]._index,x,w,Q;if(void 0===n[v]){x=lunr.idf((this||e).invertedIndex[v],(this||e).documentCount);n[v]=x}else x=n[v];w=x*(((this||e)._k1+1)*m)/((this||e)._k1*(1-(this||e)._b+(this||e)._b*(u/(this||e).averageFieldLength[o]))+m);w*=f;w*=p;Q=Math.round(1e3*w)/1e3;l.insert(g,Q)}t[a]=l}(this||e).fieldVectors=t};lunr.Builder.prototype.createTokenSet=function(){(this||e).tokenSet=lunr.TokenSet.fromArray(Object.keys((this||e).invertedIndex).sort())};
/**
   * Builds the index, creating an instance of lunr.Index.
   *
   * This completes the indexing process and should only be called
   * once all documents have been added to the index.
   *
   * @returns {lunr.Index}
   */lunr.Builder.prototype.build=function(){this.calculateAverageFieldLengths();this.createFieldVectors();this.createTokenSet();return new lunr.Index({invertedIndex:(this||e).invertedIndex,fieldVectors:(this||e).fieldVectors,tokenSet:(this||e).tokenSet,fields:Object.keys((this||e)._fields),pipeline:(this||e).searchPipeline})};
/**
   * Applies a plugin to the index builder.
   *
   * A plugin is a function that is called with the index builder as its context.
   * Plugins can be used to customise or extend the behaviour of the index
   * in some way. A plugin is just a function, that encapsulated the custom
   * behaviour that should be applied when building the index.
   *
   * The plugin function will be called with the index builder as its argument, additional
   * arguments can also be passed when calling use. The function will be called
   * with the index builder as its context.
   *
   * @param {Function} plugin The plugin to apply.
   */lunr.Builder.prototype.use=function(t){var r=Array.prototype.slice.call(arguments,1);r.unshift(this||e);t.apply(this||e,r)};
/**
   * Contains and collects metadata about a matching document.
   * A single instance of lunr.MatchData is returned as part of every
   * lunr.Index~Result.
   *
   * @constructor
   * @param {string} term - The term this match data is associated with
   * @param {string} field - The field in which the term was found
   * @param {object} metadata - The metadata recorded about this term in this field
   * @property {object} metadata - A cloned collection of metadata associated with this document.
   * @see {@link lunr.Index~Result}
   */lunr.MatchData=function(t,r,i){var n=Object.create(null),s=Object.keys(i||{});for(var a=0;a<s.length;a++){var o=s[a];n[o]=i[o].slice()}(this||e).metadata=Object.create(null);if(void 0!==t){(this||e).metadata[t]=Object.create(null);(this||e).metadata[t][r]=n}};
/**
   * An instance of lunr.MatchData will be created for every term that matches a
   * document. However only one instance is required in a lunr.Index~Result. This
   * method combines metadata from another instance of lunr.MatchData with this
   * objects metadata.
   *
   * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
   * @see {@link lunr.Index~Result}
   */lunr.MatchData.prototype.combine=function(t){var r=Object.keys(t.metadata);for(var i=0;i<r.length;i++){var n=r[i],s=Object.keys(t.metadata[n]);void 0==(this||e).metadata[n]&&((this||e).metadata[n]=Object.create(null));for(var a=0;a<s.length;a++){var o=s[a],u=Object.keys(t.metadata[n][o]);void 0==(this||e).metadata[n][o]&&((this||e).metadata[n][o]=Object.create(null));for(var l=0;l<u.length;l++){var c=u[l];void 0==(this||e).metadata[n][o][c]?(this||e).metadata[n][o][c]=t.metadata[n][o][c]:(this||e).metadata[n][o][c]=(this||e).metadata[n][o][c].concat(t.metadata[n][o][c])}}}};
/**
   * Add metadata for a term/field pair to this instance of match data.
   *
   * @param {string} term - The term this match data is associated with
   * @param {string} field - The field in which the term was found
   * @param {object} metadata - The metadata recorded about this term in this field
   */lunr.MatchData.prototype.add=function(t,r,i){if(t in(this||e).metadata)if(r in(this||e).metadata[t]){var n=Object.keys(i);for(var s=0;s<n.length;s++){var a=n[s];a in(this||e).metadata[t][r]?(this||e).metadata[t][r][a]=(this||e).metadata[t][r][a].concat(i[a]):(this||e).metadata[t][r][a]=i[a]}}else(this||e).metadata[t][r]=i;else{(this||e).metadata[t]=Object.create(null);(this||e).metadata[t][r]=i}};lunr.Query=function(t){(this||e).clauses=[];(this||e).allFields=t};lunr.Query.wildcard=new String("*");lunr.Query.wildcard.NONE=0;lunr.Query.wildcard.LEADING=1;lunr.Query.wildcard.TRAILING=2;lunr.Query.presence={OPTIONAL:1,REQUIRED:2,PROHIBITED:3};
/**
   * A single clause in a {@link lunr.Query} contains a term and details on how to
   * match that term against a {@link lunr.Index}.
   *
   * @typedef {Object} lunr.Query~Clause
   * @property {string[]} fields - The fields in an index this clause should be matched against.
   * @property {number} [boost=1] - Any boost that should be applied when matching this clause.
   * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.
   * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.
   * @property {number} [wildcard=lunr.Query.wildcard.NONE] - Whether the term should have wildcards appended or prepended.
   * @property {number} [presence=lunr.Query.presence.OPTIONAL] - The terms presence in any matching documents.
   */
/**
   * Adds a {@link lunr.Query~Clause} to this query.
   *
   * Unless the clause contains the fields to be matched all fields will be matched. In addition
   * a default boost of 1 is applied to the clause.
   *
   * @param {lunr.Query~Clause} clause - The clause to add to this query.
   * @see lunr.Query~Clause
   * @returns {lunr.Query}
   */lunr.Query.prototype.clause=function(t){"fields"in t||(t.fields=(this||e).allFields);"boost"in t||(t.boost=1);"usePipeline"in t||(t.usePipeline=true);"wildcard"in t||(t.wildcard=lunr.Query.wildcard.NONE);t.wildcard&lunr.Query.wildcard.LEADING&&t.term.charAt(0)!=lunr.Query.wildcard&&(t.term="*"+t.term);t.wildcard&lunr.Query.wildcard.TRAILING&&t.term.slice(-1)!=lunr.Query.wildcard&&(t.term=t.term+"*");"presence"in t||(t.presence=lunr.Query.presence.OPTIONAL);(this||e).clauses.push(t);return this||e};
/**
   * A negated query is one in which every clause has a presence of
   * prohibited. These queries require some special processing to return
   * the expected results.
   *
   * @returns boolean
   */lunr.Query.prototype.isNegated=function(){for(var t=0;t<(this||e).clauses.length;t++)if((this||e).clauses[t].presence!=lunr.Query.presence.PROHIBITED)return false;return true};
/**
   * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}
   * to the list of clauses that make up this query.
   *
   * The term is used as is, i.e. no tokenization will be performed by this method. Instead conversion
   * to a token or token-like string should be done before calling this method.
   *
   * The term will be converted to a string by calling `toString`. Multiple terms can be passed as an
   * array, each term in the array will share the same options.
   *
   * @param {object|object[]} term - The term(s) to add to the query.
   * @param {object} [options] - Any additional properties to add to the query clause.
   * @returns {lunr.Query}
   * @see lunr.Query#clause
   * @see lunr.Query~Clause
   * @example <caption>adding a single term to a query</caption>
   * query.term("foo")
   * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>
   * query.term("foo", {
   *   fields: ["title"],
   *   boost: 10,
   *   wildcard: lunr.Query.wildcard.TRAILING
   * })
   * @example <caption>using lunr.tokenizer to convert a string to tokens before using them as terms</caption>
   * query.term(lunr.tokenizer("foo bar"))
   */lunr.Query.prototype.term=function(t,r){if(Array.isArray(t)){t.forEach((function(e){this.term(e,lunr.utils.clone(r))}),this||e);return this||e}var i=r||{};i.term=t.toString();this.clause(i);return this||e};lunr.QueryParseError=function(t,r,i){(this||e).name="QueryParseError";(this||e).message=t;(this||e).start=r;(this||e).end=i};lunr.QueryParseError.prototype=new Error;lunr.QueryLexer=function(t){(this||e).lexemes=[];(this||e).str=t;(this||e).length=t.length;(this||e).pos=0;(this||e).start=0;(this||e).escapeCharPositions=[]};lunr.QueryLexer.prototype.run=function(){var t=lunr.QueryLexer.lexText;while(t)t=t(this||e)};lunr.QueryLexer.prototype.sliceString=function(){var t=[],r=(this||e).start,i=(this||e).pos;for(var n=0;n<(this||e).escapeCharPositions.length;n++){i=(this||e).escapeCharPositions[n];t.push((this||e).str.slice(r,i));r=i+1}t.push((this||e).str.slice(r,(this||e).pos));(this||e).escapeCharPositions.length=0;return t.join("")};lunr.QueryLexer.prototype.emit=function(t){(this||e).lexemes.push({type:t,str:this.sliceString(),start:(this||e).start,end:(this||e).pos});(this||e).start=(this||e).pos};lunr.QueryLexer.prototype.escapeCharacter=function(){(this||e).escapeCharPositions.push((this||e).pos-1);(this||e).pos+=1};lunr.QueryLexer.prototype.next=function(){if((this||e).pos>=(this||e).length)return lunr.QueryLexer.EOS;var t=(this||e).str.charAt((this||e).pos);(this||e).pos+=1;return t};lunr.QueryLexer.prototype.width=function(){return(this||e).pos-(this||e).start};lunr.QueryLexer.prototype.ignore=function(){(this||e).start==(this||e).pos&&((this||e).pos+=1);(this||e).start=(this||e).pos};lunr.QueryLexer.prototype.backup=function(){(this||e).pos-=1};lunr.QueryLexer.prototype.acceptDigitRun=function(){var e,t;do{e=this.next();t=e.charCodeAt(0)}while(t>47&&t<58);e!=lunr.QueryLexer.EOS&&this.backup()};lunr.QueryLexer.prototype.more=function(){return(this||e).pos<(this||e).length};lunr.QueryLexer.EOS="EOS";lunr.QueryLexer.FIELD="FIELD";lunr.QueryLexer.TERM="TERM";lunr.QueryLexer.EDIT_DISTANCE="EDIT_DISTANCE";lunr.QueryLexer.BOOST="BOOST";lunr.QueryLexer.PRESENCE="PRESENCE";lunr.QueryLexer.lexField=function(e){e.backup();e.emit(lunr.QueryLexer.FIELD);e.ignore();return lunr.QueryLexer.lexText};lunr.QueryLexer.lexTerm=function(e){if(e.width()>1){e.backup();e.emit(lunr.QueryLexer.TERM)}e.ignore();if(e.more())return lunr.QueryLexer.lexText};lunr.QueryLexer.lexEditDistance=function(e){e.ignore();e.acceptDigitRun();e.emit(lunr.QueryLexer.EDIT_DISTANCE);return lunr.QueryLexer.lexText};lunr.QueryLexer.lexBoost=function(e){e.ignore();e.acceptDigitRun();e.emit(lunr.QueryLexer.BOOST);return lunr.QueryLexer.lexText};lunr.QueryLexer.lexEOS=function(e){e.width()>0&&e.emit(lunr.QueryLexer.TERM)};lunr.QueryLexer.termSeparator=lunr.tokenizer.separator;lunr.QueryLexer.lexText=function(e){while(true){var t=e.next();if(t==lunr.QueryLexer.EOS)return lunr.QueryLexer.lexEOS;if(92!=t.charCodeAt(0)){if(":"==t)return lunr.QueryLexer.lexField;if("~"==t){e.backup();e.width()>0&&e.emit(lunr.QueryLexer.TERM);return lunr.QueryLexer.lexEditDistance}if("^"==t){e.backup();e.width()>0&&e.emit(lunr.QueryLexer.TERM);return lunr.QueryLexer.lexBoost}if("+"==t&&1===e.width()){e.emit(lunr.QueryLexer.PRESENCE);return lunr.QueryLexer.lexText}if("-"==t&&1===e.width()){e.emit(lunr.QueryLexer.PRESENCE);return lunr.QueryLexer.lexText}if(t.match(lunr.QueryLexer.termSeparator))return lunr.QueryLexer.lexTerm}else e.escapeCharacter()}};lunr.QueryParser=function(t,r){(this||e).lexer=new lunr.QueryLexer(t);(this||e).query=r;(this||e).currentClause={};(this||e).lexemeIdx=0};lunr.QueryParser.prototype.parse=function(){(this||e).lexer.run();(this||e).lexemes=(this||e).lexer.lexemes;var t=lunr.QueryParser.parseClause;while(t)t=t(this||e);return(this||e).query};lunr.QueryParser.prototype.peekLexeme=function(){return(this||e).lexemes[(this||e).lexemeIdx]};lunr.QueryParser.prototype.consumeLexeme=function(){var t=this.peekLexeme();(this||e).lexemeIdx+=1;return t};lunr.QueryParser.prototype.nextClause=function(){var t=(this||e).currentClause;(this||e).query.clause(t);(this||e).currentClause={}};lunr.QueryParser.parseClause=function(e){var t=e.peekLexeme();if(void 0!=t)switch(t.type){case lunr.QueryLexer.PRESENCE:return lunr.QueryParser.parsePresence;case lunr.QueryLexer.FIELD:return lunr.QueryParser.parseField;case lunr.QueryLexer.TERM:return lunr.QueryParser.parseTerm;default:var r="expected either a field or a term, found "+t.type;t.str.length>=1&&(r+=" with value '"+t.str+"'");throw new lunr.QueryParseError(r,t.start,t.end)}};lunr.QueryParser.parsePresence=function(e){var t=e.consumeLexeme();if(void 0!=t){switch(t.str){case"-":e.currentClause.presence=lunr.Query.presence.PROHIBITED;break;case"+":e.currentClause.presence=lunr.Query.presence.REQUIRED;break;default:var r="unrecognised presence operator'"+t.str+"'";throw new lunr.QueryParseError(r,t.start,t.end)}var i=e.peekLexeme();if(void 0==i){var r="expecting term or field, found nothing";throw new lunr.QueryParseError(r,t.start,t.end)}switch(i.type){case lunr.QueryLexer.FIELD:return lunr.QueryParser.parseField;case lunr.QueryLexer.TERM:return lunr.QueryParser.parseTerm;default:var r="expecting term or field, found '"+i.type+"'";throw new lunr.QueryParseError(r,i.start,i.end)}}};lunr.QueryParser.parseField=function(e){var t=e.consumeLexeme();if(void 0!=t){if(-1==e.query.allFields.indexOf(t.str)){var r=e.query.allFields.map((function(e){return"'"+e+"'"})).join(", "),i="unrecognised field '"+t.str+"', possible fields: "+r;throw new lunr.QueryParseError(i,t.start,t.end)}e.currentClause.fields=[t.str];var n=e.peekLexeme();if(void 0==n){var i="expecting term, found nothing";throw new lunr.QueryParseError(i,t.start,t.end)}switch(n.type){case lunr.QueryLexer.TERM:return lunr.QueryParser.parseTerm;default:var i="expecting term, found '"+n.type+"'";throw new lunr.QueryParseError(i,n.start,n.end)}}};lunr.QueryParser.parseTerm=function(e){var t=e.consumeLexeme();if(void 0!=t){e.currentClause.term=t.str.toLowerCase();-1!=t.str.indexOf("*")&&(e.currentClause.usePipeline=false);var r=e.peekLexeme();if(void 0!=r)switch(r.type){case lunr.QueryLexer.TERM:e.nextClause();return lunr.QueryParser.parseTerm;case lunr.QueryLexer.FIELD:e.nextClause();return lunr.QueryParser.parseField;case lunr.QueryLexer.EDIT_DISTANCE:return lunr.QueryParser.parseEditDistance;case lunr.QueryLexer.BOOST:return lunr.QueryParser.parseBoost;case lunr.QueryLexer.PRESENCE:e.nextClause();return lunr.QueryParser.parsePresence;default:var i="Unexpected lexeme type '"+r.type+"'";throw new lunr.QueryParseError(i,r.start,r.end)}else e.nextClause()}};lunr.QueryParser.parseEditDistance=function(e){var t=e.consumeLexeme();if(void 0!=t){var r=parseInt(t.str,10);if(isNaN(r)){var i="edit distance must be numeric";throw new lunr.QueryParseError(i,t.start,t.end)}e.currentClause.editDistance=r;var n=e.peekLexeme();if(void 0!=n)switch(n.type){case lunr.QueryLexer.TERM:e.nextClause();return lunr.QueryParser.parseTerm;case lunr.QueryLexer.FIELD:e.nextClause();return lunr.QueryParser.parseField;case lunr.QueryLexer.EDIT_DISTANCE:return lunr.QueryParser.parseEditDistance;case lunr.QueryLexer.BOOST:return lunr.QueryParser.parseBoost;case lunr.QueryLexer.PRESENCE:e.nextClause();return lunr.QueryParser.parsePresence;default:var i="Unexpected lexeme type '"+n.type+"'";throw new lunr.QueryParseError(i,n.start,n.end)}else e.nextClause()}};lunr.QueryParser.parseBoost=function(e){var t=e.consumeLexeme();if(void 0!=t){var r=parseInt(t.str,10);if(isNaN(r)){var i="boost must be numeric";throw new lunr.QueryParseError(i,t.start,t.end)}e.currentClause.boost=r;var n=e.peekLexeme();if(void 0!=n)switch(n.type){case lunr.QueryLexer.TERM:e.nextClause();return lunr.QueryParser.parseTerm;case lunr.QueryLexer.FIELD:e.nextClause();return lunr.QueryParser.parseField;case lunr.QueryLexer.EDIT_DISTANCE:return lunr.QueryParser.parseEditDistance;case lunr.QueryLexer.BOOST:return lunr.QueryParser.parseBoost;case lunr.QueryLexer.PRESENCE:e.nextClause();return lunr.QueryParser.parsePresence;default:var i="Unexpected lexeme type '"+n.type+"'";throw new lunr.QueryParseError(i,n.start,n.end)}else e.nextClause()}};(function(e,r){t=r()})(this||e,(function(){return lunr}))})();var r=t;export default r;

