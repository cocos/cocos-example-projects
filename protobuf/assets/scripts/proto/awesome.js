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
             * @property {number|Long|null} [level] AwesomeMessage level
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
             * AwesomeMessage level.
             * @member {number|Long} level
             * @memberof awesome.AwesomeMessage
             * @instance
             */
            AwesomeMessage.prototype.level = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
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
                if (message.level != null && message.hasOwnProperty("level"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.level);
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
                    case 4:
                        message.level = reader.int64();
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
                if (message.level != null && message.hasOwnProperty("level"))
                    if (!$util.isInteger(message.level) && !(message.level && $util.isInteger(message.level.low) && $util.isInteger(message.level.high)))
                        return "level: integer|Long expected";
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
                if (object.level != null)
                    if ($util.Long)
                        (message.level = $util.Long.fromValue(object.level)).unsigned = false;
                    else if (typeof object.level === "string")
                        message.level = parseInt(object.level, 10);
                    else if (typeof object.level === "number")
                        message.level = object.level;
                    else if (typeof object.level === "object")
                        message.level = new $util.LongBits(object.level.low >>> 0, object.level.high >>> 0).toNumber();
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
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.level = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.level = options.longs === String ? "0" : 0;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.age != null && message.hasOwnProperty("age"))
                    object.age = message.age;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                if (message.level != null && message.hasOwnProperty("level"))
                    if (typeof message.level === "number")
                        object.level = options.longs === String ? String(message.level) : message.level;
                    else
                        object.level = options.longs === String ? $util.Long.prototype.toString.call(message.level) : options.longs === Number ? new $util.LongBits(message.level.low >>> 0, message.level.high >>> 0).toNumber() : message.level;
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
    
        awesome.QuestInfo = (function() {
    
            /**
             * Properties of a QuestInfo.
             * @memberof awesome
             * @interface IQuestInfo
             * @property {number|null} [questId] QuestInfo questId
             * @property {boolean|null} [finished] QuestInfo finished
             * @property {boolean|null} [recved] QuestInfo recved
             * @property {number|null} [conditionParam1] QuestInfo conditionParam1
             * @property {number|null} [conditionParam2] QuestInfo conditionParam2
             */
    
            /**
             * Constructs a new QuestInfo.
             * @memberof awesome
             * @classdesc Represents a QuestInfo.
             * @implements IQuestInfo
             * @constructor
             * @param {awesome.IQuestInfo=} [properties] Properties to set
             */
            function QuestInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * QuestInfo questId.
             * @member {number} questId
             * @memberof awesome.QuestInfo
             * @instance
             */
            QuestInfo.prototype.questId = 0;
    
            /**
             * QuestInfo finished.
             * @member {boolean} finished
             * @memberof awesome.QuestInfo
             * @instance
             */
            QuestInfo.prototype.finished = false;
    
            /**
             * QuestInfo recved.
             * @member {boolean} recved
             * @memberof awesome.QuestInfo
             * @instance
             */
            QuestInfo.prototype.recved = false;
    
            /**
             * QuestInfo conditionParam1.
             * @member {number} conditionParam1
             * @memberof awesome.QuestInfo
             * @instance
             */
            QuestInfo.prototype.conditionParam1 = 0;
    
            /**
             * QuestInfo conditionParam2.
             * @member {number} conditionParam2
             * @memberof awesome.QuestInfo
             * @instance
             */
            QuestInfo.prototype.conditionParam2 = 0;
    
            /**
             * Creates a new QuestInfo instance using the specified properties.
             * @function create
             * @memberof awesome.QuestInfo
             * @static
             * @param {awesome.IQuestInfo=} [properties] Properties to set
             * @returns {awesome.QuestInfo} QuestInfo instance
             */
            QuestInfo.create = function create(properties) {
                return new QuestInfo(properties);
            };
    
            /**
             * Encodes the specified QuestInfo message. Does not implicitly {@link awesome.QuestInfo.verify|verify} messages.
             * @function encode
             * @memberof awesome.QuestInfo
             * @static
             * @param {awesome.IQuestInfo} message QuestInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            QuestInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.questId != null && message.hasOwnProperty("questId"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.questId);
                if (message.finished != null && message.hasOwnProperty("finished"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.finished);
                if (message.recved != null && message.hasOwnProperty("recved"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.recved);
                if (message.conditionParam1 != null && message.hasOwnProperty("conditionParam1"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.conditionParam1);
                if (message.conditionParam2 != null && message.hasOwnProperty("conditionParam2"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.conditionParam2);
                return writer;
            };
    
            /**
             * Encodes the specified QuestInfo message, length delimited. Does not implicitly {@link awesome.QuestInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof awesome.QuestInfo
             * @static
             * @param {awesome.IQuestInfo} message QuestInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            QuestInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a QuestInfo message from the specified reader or buffer.
             * @function decode
             * @memberof awesome.QuestInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {awesome.QuestInfo} QuestInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            QuestInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.awesome.QuestInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.questId = reader.int32();
                        break;
                    case 2:
                        message.finished = reader.bool();
                        break;
                    case 3:
                        message.recved = reader.bool();
                        break;
                    case 4:
                        message.conditionParam1 = reader.int32();
                        break;
                    case 5:
                        message.conditionParam2 = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a QuestInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof awesome.QuestInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {awesome.QuestInfo} QuestInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            QuestInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a QuestInfo message.
             * @function verify
             * @memberof awesome.QuestInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            QuestInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.questId != null && message.hasOwnProperty("questId"))
                    if (!$util.isInteger(message.questId))
                        return "questId: integer expected";
                if (message.finished != null && message.hasOwnProperty("finished"))
                    if (typeof message.finished !== "boolean")
                        return "finished: boolean expected";
                if (message.recved != null && message.hasOwnProperty("recved"))
                    if (typeof message.recved !== "boolean")
                        return "recved: boolean expected";
                if (message.conditionParam1 != null && message.hasOwnProperty("conditionParam1"))
                    if (!$util.isInteger(message.conditionParam1))
                        return "conditionParam1: integer expected";
                if (message.conditionParam2 != null && message.hasOwnProperty("conditionParam2"))
                    if (!$util.isInteger(message.conditionParam2))
                        return "conditionParam2: integer expected";
                return null;
            };
    
            /**
             * Creates a QuestInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof awesome.QuestInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {awesome.QuestInfo} QuestInfo
             */
            QuestInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.awesome.QuestInfo)
                    return object;
                var message = new $root.awesome.QuestInfo();
                if (object.questId != null)
                    message.questId = object.questId | 0;
                if (object.finished != null)
                    message.finished = Boolean(object.finished);
                if (object.recved != null)
                    message.recved = Boolean(object.recved);
                if (object.conditionParam1 != null)
                    message.conditionParam1 = object.conditionParam1 | 0;
                if (object.conditionParam2 != null)
                    message.conditionParam2 = object.conditionParam2 | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a QuestInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof awesome.QuestInfo
             * @static
             * @param {awesome.QuestInfo} message QuestInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            QuestInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.questId = 0;
                    object.finished = false;
                    object.recved = false;
                    object.conditionParam1 = 0;
                    object.conditionParam2 = 0;
                }
                if (message.questId != null && message.hasOwnProperty("questId"))
                    object.questId = message.questId;
                if (message.finished != null && message.hasOwnProperty("finished"))
                    object.finished = message.finished;
                if (message.recved != null && message.hasOwnProperty("recved"))
                    object.recved = message.recved;
                if (message.conditionParam1 != null && message.hasOwnProperty("conditionParam1"))
                    object.conditionParam1 = message.conditionParam1;
                if (message.conditionParam2 != null && message.hasOwnProperty("conditionParam2"))
                    object.conditionParam2 = message.conditionParam2;
                return object;
            };
    
            /**
             * Converts this QuestInfo to JSON.
             * @function toJSON
             * @memberof awesome.QuestInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            QuestInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return QuestInfo;
        })();
    
        awesome.MoreAwesomeMessage = (function() {
    
            /**
             * Properties of a MoreAwesomeMessage.
             * @memberof awesome
             * @interface IMoreAwesomeMessage
             * @property {string|null} [myName] MoreAwesomeMessage myName
             * @property {number|null} [someAge] MoreAwesomeMessage someAge
             * @property {Uint8Array|null} [theData] MoreAwesomeMessage theData
             * @property {number|Long|null} [nextLevel] MoreAwesomeMessage nextLevel
             * @property {awesome.IAwesomeMessage|null} [msg] MoreAwesomeMessage msg
             * @property {Array.<awesome.IQuestInfo>|null} [quests] MoreAwesomeMessage quests
             */
    
            /**
             * Constructs a new MoreAwesomeMessage.
             * @memberof awesome
             * @classdesc Represents a MoreAwesomeMessage.
             * @implements IMoreAwesomeMessage
             * @constructor
             * @param {awesome.IMoreAwesomeMessage=} [properties] Properties to set
             */
            function MoreAwesomeMessage(properties) {
                this.quests = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MoreAwesomeMessage myName.
             * @member {string} myName
             * @memberof awesome.MoreAwesomeMessage
             * @instance
             */
            MoreAwesomeMessage.prototype.myName = "";
    
            /**
             * MoreAwesomeMessage someAge.
             * @member {number} someAge
             * @memberof awesome.MoreAwesomeMessage
             * @instance
             */
            MoreAwesomeMessage.prototype.someAge = 0;
    
            /**
             * MoreAwesomeMessage theData.
             * @member {Uint8Array} theData
             * @memberof awesome.MoreAwesomeMessage
             * @instance
             */
            MoreAwesomeMessage.prototype.theData = $util.newBuffer([]);
    
            /**
             * MoreAwesomeMessage nextLevel.
             * @member {number|Long} nextLevel
             * @memberof awesome.MoreAwesomeMessage
             * @instance
             */
            MoreAwesomeMessage.prototype.nextLevel = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * MoreAwesomeMessage msg.
             * @member {awesome.IAwesomeMessage|null|undefined} msg
             * @memberof awesome.MoreAwesomeMessage
             * @instance
             */
            MoreAwesomeMessage.prototype.msg = null;
    
            /**
             * MoreAwesomeMessage quests.
             * @member {Array.<awesome.IQuestInfo>} quests
             * @memberof awesome.MoreAwesomeMessage
             * @instance
             */
            MoreAwesomeMessage.prototype.quests = $util.emptyArray;
    
            /**
             * Creates a new MoreAwesomeMessage instance using the specified properties.
             * @function create
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {awesome.IMoreAwesomeMessage=} [properties] Properties to set
             * @returns {awesome.MoreAwesomeMessage} MoreAwesomeMessage instance
             */
            MoreAwesomeMessage.create = function create(properties) {
                return new MoreAwesomeMessage(properties);
            };
    
            /**
             * Encodes the specified MoreAwesomeMessage message. Does not implicitly {@link awesome.MoreAwesomeMessage.verify|verify} messages.
             * @function encode
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {awesome.IMoreAwesomeMessage} message MoreAwesomeMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MoreAwesomeMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.myName != null && message.hasOwnProperty("myName"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.myName);
                if (message.someAge != null && message.hasOwnProperty("someAge"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.someAge);
                if (message.theData != null && message.hasOwnProperty("theData"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.theData);
                if (message.nextLevel != null && message.hasOwnProperty("nextLevel"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.nextLevel);
                if (message.msg != null && message.hasOwnProperty("msg"))
                    $root.awesome.AwesomeMessage.encode(message.msg, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.quests != null && message.quests.length)
                    for (var i = 0; i < message.quests.length; ++i)
                        $root.awesome.QuestInfo.encode(message.quests[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified MoreAwesomeMessage message, length delimited. Does not implicitly {@link awesome.MoreAwesomeMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {awesome.IMoreAwesomeMessage} message MoreAwesomeMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MoreAwesomeMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MoreAwesomeMessage message from the specified reader or buffer.
             * @function decode
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {awesome.MoreAwesomeMessage} MoreAwesomeMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MoreAwesomeMessage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.awesome.MoreAwesomeMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.myName = reader.string();
                        break;
                    case 2:
                        message.someAge = reader.int32();
                        break;
                    case 3:
                        message.theData = reader.bytes();
                        break;
                    case 4:
                        message.nextLevel = reader.int64();
                        break;
                    case 5:
                        message.msg = $root.awesome.AwesomeMessage.decode(reader, reader.uint32());
                        break;
                    case 6:
                        if (!(message.quests && message.quests.length))
                            message.quests = [];
                        message.quests.push($root.awesome.QuestInfo.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MoreAwesomeMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {awesome.MoreAwesomeMessage} MoreAwesomeMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MoreAwesomeMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MoreAwesomeMessage message.
             * @function verify
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MoreAwesomeMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.myName != null && message.hasOwnProperty("myName"))
                    if (!$util.isString(message.myName))
                        return "myName: string expected";
                if (message.someAge != null && message.hasOwnProperty("someAge"))
                    if (!$util.isInteger(message.someAge))
                        return "someAge: integer expected";
                if (message.theData != null && message.hasOwnProperty("theData"))
                    if (!(message.theData && typeof message.theData.length === "number" || $util.isString(message.theData)))
                        return "theData: buffer expected";
                if (message.nextLevel != null && message.hasOwnProperty("nextLevel"))
                    if (!$util.isInteger(message.nextLevel) && !(message.nextLevel && $util.isInteger(message.nextLevel.low) && $util.isInteger(message.nextLevel.high)))
                        return "nextLevel: integer|Long expected";
                if (message.msg != null && message.hasOwnProperty("msg")) {
                    var error = $root.awesome.AwesomeMessage.verify(message.msg);
                    if (error)
                        return "msg." + error;
                }
                if (message.quests != null && message.hasOwnProperty("quests")) {
                    if (!Array.isArray(message.quests))
                        return "quests: array expected";
                    for (var i = 0; i < message.quests.length; ++i) {
                        var error = $root.awesome.QuestInfo.verify(message.quests[i]);
                        if (error)
                            return "quests." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a MoreAwesomeMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {awesome.MoreAwesomeMessage} MoreAwesomeMessage
             */
            MoreAwesomeMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.awesome.MoreAwesomeMessage)
                    return object;
                var message = new $root.awesome.MoreAwesomeMessage();
                if (object.myName != null)
                    message.myName = String(object.myName);
                if (object.someAge != null)
                    message.someAge = object.someAge | 0;
                if (object.theData != null)
                    if (typeof object.theData === "string")
                        $util.base64.decode(object.theData, message.theData = $util.newBuffer($util.base64.length(object.theData)), 0);
                    else if (object.theData.length)
                        message.theData = object.theData;
                if (object.nextLevel != null)
                    if ($util.Long)
                        (message.nextLevel = $util.Long.fromValue(object.nextLevel)).unsigned = false;
                    else if (typeof object.nextLevel === "string")
                        message.nextLevel = parseInt(object.nextLevel, 10);
                    else if (typeof object.nextLevel === "number")
                        message.nextLevel = object.nextLevel;
                    else if (typeof object.nextLevel === "object")
                        message.nextLevel = new $util.LongBits(object.nextLevel.low >>> 0, object.nextLevel.high >>> 0).toNumber();
                if (object.msg != null) {
                    if (typeof object.msg !== "object")
                        throw TypeError(".awesome.MoreAwesomeMessage.msg: object expected");
                    message.msg = $root.awesome.AwesomeMessage.fromObject(object.msg);
                }
                if (object.quests) {
                    if (!Array.isArray(object.quests))
                        throw TypeError(".awesome.MoreAwesomeMessage.quests: array expected");
                    message.quests = [];
                    for (var i = 0; i < object.quests.length; ++i) {
                        if (typeof object.quests[i] !== "object")
                            throw TypeError(".awesome.MoreAwesomeMessage.quests: object expected");
                        message.quests[i] = $root.awesome.QuestInfo.fromObject(object.quests[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a MoreAwesomeMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof awesome.MoreAwesomeMessage
             * @static
             * @param {awesome.MoreAwesomeMessage} message MoreAwesomeMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MoreAwesomeMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.quests = [];
                if (options.defaults) {
                    object.myName = "";
                    object.someAge = 0;
                    if (options.bytes === String)
                        object.theData = "";
                    else {
                        object.theData = [];
                        if (options.bytes !== Array)
                            object.theData = $util.newBuffer(object.theData);
                    }
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.nextLevel = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.nextLevel = options.longs === String ? "0" : 0;
                    object.msg = null;
                }
                if (message.myName != null && message.hasOwnProperty("myName"))
                    object.myName = message.myName;
                if (message.someAge != null && message.hasOwnProperty("someAge"))
                    object.someAge = message.someAge;
                if (message.theData != null && message.hasOwnProperty("theData"))
                    object.theData = options.bytes === String ? $util.base64.encode(message.theData, 0, message.theData.length) : options.bytes === Array ? Array.prototype.slice.call(message.theData) : message.theData;
                if (message.nextLevel != null && message.hasOwnProperty("nextLevel"))
                    if (typeof message.nextLevel === "number")
                        object.nextLevel = options.longs === String ? String(message.nextLevel) : message.nextLevel;
                    else
                        object.nextLevel = options.longs === String ? $util.Long.prototype.toString.call(message.nextLevel) : options.longs === Number ? new $util.LongBits(message.nextLevel.low >>> 0, message.nextLevel.high >>> 0).toNumber() : message.nextLevel;
                if (message.msg != null && message.hasOwnProperty("msg"))
                    object.msg = $root.awesome.AwesomeMessage.toObject(message.msg, options);
                if (message.quests && message.quests.length) {
                    object.quests = [];
                    for (var j = 0; j < message.quests.length; ++j)
                        object.quests[j] = $root.awesome.QuestInfo.toObject(message.quests[j], options);
                }
                return object;
            };
    
            /**
             * Converts this MoreAwesomeMessage to JSON.
             * @function toJSON
             * @memberof awesome.MoreAwesomeMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MoreAwesomeMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MoreAwesomeMessage;
        })();
    
        return awesome;
    })();

    return $root;
})(protobuf).awesome;
