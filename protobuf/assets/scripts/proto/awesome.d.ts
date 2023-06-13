declare global {
 // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.

/** Namespace awesome. */
export namespace awesome {

    /** Properties of an AwesomeMessage. */
    interface IAwesomeMessage {

        /** AwesomeMessage name */
        name?: (string|null);

        /** AwesomeMessage age */
        age?: (number|null);

        /** AwesomeMessage data */
        data?: (Uint8Array|null);

        /** AwesomeMessage level */
        level?: (number|Long|null);
    }

    /** Represents an AwesomeMessage. */
    class AwesomeMessage implements IAwesomeMessage {

        /**
         * Constructs a new AwesomeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: awesome.IAwesomeMessage);

        /** AwesomeMessage name. */
        public name: string;

        /** AwesomeMessage age. */
        public age: number;

        /** AwesomeMessage data. */
        public data: Uint8Array;

        /** AwesomeMessage level. */
        public level: (number|Long);

        /**
         * Creates a new AwesomeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AwesomeMessage instance
         */
        public static create(properties?: awesome.IAwesomeMessage): awesome.AwesomeMessage;

        /**
         * Encodes the specified AwesomeMessage message. Does not implicitly {@link awesome.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: awesome.IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link awesome.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: awesome.IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): awesome.AwesomeMessage;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): awesome.AwesomeMessage;

        /**
         * Verifies an AwesomeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AwesomeMessage
         */
        public static fromObject(object: { [k: string]: any }): awesome.AwesomeMessage;

        /**
         * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
         * @param message AwesomeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: awesome.AwesomeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AwesomeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a QuestInfo. */
    interface IQuestInfo {

        /** QuestInfo questId */
        questId?: (number|null);

        /** QuestInfo finished */
        finished?: (boolean|null);

        /** QuestInfo recved */
        recved?: (boolean|null);

        /** QuestInfo conditionParam1 */
        conditionParam1?: (number|null);

        /** QuestInfo conditionParam2 */
        conditionParam2?: (number|null);
    }

    /** Represents a QuestInfo. */
    class QuestInfo implements IQuestInfo {

        /**
         * Constructs a new QuestInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: awesome.IQuestInfo);

        /** QuestInfo questId. */
        public questId: number;

        /** QuestInfo finished. */
        public finished: boolean;

        /** QuestInfo recved. */
        public recved: boolean;

        /** QuestInfo conditionParam1. */
        public conditionParam1: number;

        /** QuestInfo conditionParam2. */
        public conditionParam2: number;

        /**
         * Creates a new QuestInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestInfo instance
         */
        public static create(properties?: awesome.IQuestInfo): awesome.QuestInfo;

        /**
         * Encodes the specified QuestInfo message. Does not implicitly {@link awesome.QuestInfo.verify|verify} messages.
         * @param message QuestInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: awesome.IQuestInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QuestInfo message, length delimited. Does not implicitly {@link awesome.QuestInfo.verify|verify} messages.
         * @param message QuestInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: awesome.IQuestInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuestInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): awesome.QuestInfo;

        /**
         * Decodes a QuestInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QuestInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): awesome.QuestInfo;

        /**
         * Verifies a QuestInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QuestInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QuestInfo
         */
        public static fromObject(object: { [k: string]: any }): awesome.QuestInfo;

        /**
         * Creates a plain object from a QuestInfo message. Also converts values to other types if specified.
         * @param message QuestInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: awesome.QuestInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QuestInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MoreAwesomeMessage. */
    interface IMoreAwesomeMessage {

        /** MoreAwesomeMessage myName */
        myName?: (string|null);

        /** MoreAwesomeMessage someAge */
        someAge?: (number|null);

        /** MoreAwesomeMessage theData */
        theData?: (Uint8Array|null);

        /** MoreAwesomeMessage nextLevel */
        nextLevel?: (number|Long|null);

        /** MoreAwesomeMessage msg */
        msg?: (awesome.IAwesomeMessage|null);

        /** MoreAwesomeMessage quests */
        quests?: (awesome.IQuestInfo[]|null);
    }

    /** Represents a MoreAwesomeMessage. */
    class MoreAwesomeMessage implements IMoreAwesomeMessage {

        /**
         * Constructs a new MoreAwesomeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: awesome.IMoreAwesomeMessage);

        /** MoreAwesomeMessage myName. */
        public myName: string;

        /** MoreAwesomeMessage someAge. */
        public someAge: number;

        /** MoreAwesomeMessage theData. */
        public theData: Uint8Array;

        /** MoreAwesomeMessage nextLevel. */
        public nextLevel: (number|Long);

        /** MoreAwesomeMessage msg. */
        public msg?: (awesome.IAwesomeMessage|null);

        /** MoreAwesomeMessage quests. */
        public quests: awesome.IQuestInfo[];

        /**
         * Creates a new MoreAwesomeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MoreAwesomeMessage instance
         */
        public static create(properties?: awesome.IMoreAwesomeMessage): awesome.MoreAwesomeMessage;

        /**
         * Encodes the specified MoreAwesomeMessage message. Does not implicitly {@link awesome.MoreAwesomeMessage.verify|verify} messages.
         * @param message MoreAwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: awesome.IMoreAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MoreAwesomeMessage message, length delimited. Does not implicitly {@link awesome.MoreAwesomeMessage.verify|verify} messages.
         * @param message MoreAwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: awesome.IMoreAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MoreAwesomeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MoreAwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): awesome.MoreAwesomeMessage;

        /**
         * Decodes a MoreAwesomeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MoreAwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): awesome.MoreAwesomeMessage;

        /**
         * Verifies a MoreAwesomeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MoreAwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MoreAwesomeMessage
         */
        public static fromObject(object: { [k: string]: any }): awesome.MoreAwesomeMessage;

        /**
         * Creates a plain object from a MoreAwesomeMessage message. Also converts values to other types if specified.
         * @param message MoreAwesomeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: awesome.MoreAwesomeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MoreAwesomeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
 
} 
 export {}