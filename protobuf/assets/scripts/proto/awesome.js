/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(window || global).awesome = (function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.awesome = (function() {
    
        /**
         * Namespace awesome.
         * @exports awesome
         * @namespace
         */
        var awesome = {};
    
        awesome.AwesomeMessage = (function() {
    
            /**
             * Properties of an AwesomeMessage.
             * @memberof awesome
             * @interface IAwesomeMessage
             * @property {string|null} [name] AwesomeMessage name
             * @property {number|null} [age] AwesomeMessage age
             * @property {Uint8Array|null} [data] AwesomeMessage data
             */
    
            /**
             * Constructs a new AwesomeMessage.
             * @memberof awesome
             * @classdesc Represents an AwesomeMessage.
             * @implements IAwesomeMessage
             * @constructor
             * @param {awesome.IAwesomeMessage=} [properties] Properties to set
             */
            function AwesomeMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AwesomeMessage name.
             * @member {string} name
             * @memberof awesome.AwesomeMessage
             * @instance
             */
            AwesomeMessage.prototype.name = "";
    
            /**
             * AwesomeMessage age.
             * @member {number} age
             * @memberof awesome.AwesomeMessage
             * @instance
             */
            AwesomeMessage.prototype.age = 0;
    
            /**
             * AwesomeMessage data.
             * @member {Uint8Array} data
             * @memberof awesome.AwesomeMessage
             * @instance
             */
            AwesomeMessage.prototype.data = $util.newBuffer([]);
    
            /**
             * Creates a new AwesomeMessage instance using the specified properties.
             * @function create
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {awesome.IAwesomeMessage=} [properties] Properties to set
             * @returns {awesome.AwesomeMessage} AwesomeMessage instance
             */
            AwesomeMessage.create = function create(properties) {
                return new AwesomeMessage(properties);
            };
    
            /**
             * Encodes the specified AwesomeMessage message. Does not implicitly {@link awesome.AwesomeMessage.verify|verify} messages.
             * @function encode
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {awesome.IAwesomeMessage} message AwesomeMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AwesomeMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.age != null && message.hasOwnProperty("age"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.age);
                if (message.data != null && message.hasOwnProperty("data"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.data);
                return writer;
            };
    
            /**
             * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link awesome.AwesomeMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {awesome.IAwesomeMessage} message AwesomeMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AwesomeMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AwesomeMessage message from the specified reader or buffer.
             * @function decode
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {awesome.AwesomeMessage} AwesomeMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AwesomeMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.awesome.AwesomeMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.age = reader.int32();
                        break;
                    case 3:
                        message.data = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {awesome.AwesomeMessage} AwesomeMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AwesomeMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AwesomeMessage message.
             * @function verify
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AwesomeMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.age != null && message.hasOwnProperty("age"))
                    if (!$util.isInteger(message.age))
                        return "age: integer expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                        return "data: buffer expected";
                return null;
            };
    
            /**
             * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {awesome.AwesomeMessage} AwesomeMessage
             */
            AwesomeMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.awesome.AwesomeMessage)
                    return object;
                var message = new $root.awesome.AwesomeMessage();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.age != null)
                    message.age = object.age | 0;
                if (object.data != null)
                    if (typeof object.data === "string")
                        $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                    else if (object.data.length)
                        message.data = object.data;
                return message;
            };
    
            /**
             * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof awesome.AwesomeMessage
             * @static
             * @param {awesome.AwesomeMessage} message AwesomeMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AwesomeMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.age = 0;
                    if (options.bytes === String)
                        object.data = "";
                    else {
                        object.data = [];
                        if (options.bytes !== Array)
                            object.data = $util.newBuffer(object.data);
                    }
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.age != null && message.hasOwnProperty("age"))
                    object.age = message.age;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                return object;
            };
    
            /**
             * Converts this AwesomeMessage to JSON.
             * @function toJSON
             * @memberof awesome.AwesomeMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AwesomeMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AwesomeMessage;
        })();
    
        return awesome;
    })();

    return $root;
})(protobuf).awesome;
