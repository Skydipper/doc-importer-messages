const uuid = require('uuid4');

const MESSAGE_TYPES = {
    EXECUTION_CREATE: 'EXECUTION_CREATE',
    EXECUTION_CONCAT: 'EXECUTION_CONCAT',
    EXECUTION_DELETE: 'EXECUTION_DELETE',
    EXECUTION_CONFIRM_DELETE: 'EXECUTION_CONFIRM_DELETE'
};

/**
 * Represents a Message.
 * @constructor
 * @param {string} type - The type of the message.
 */
class Message {

    constructor(type, taskId) {
        this.id = uuid();
        this.type = MESSAGE_TYPES[type] ? type : null;
        this.taskId = taskId;
    }

    validate() {
        if (!this.type) {
            throw new Error('Invalid message type');
        }
        if (!this.taskId) {
            throw new Error('Invalid taskId');
        }
    }

}

/**
 * Represents a CreateMessage.
 * @constructor
 * @param {string} type - The type of the message.
 * @param {string} taskId - The taskId of the message.
 * @param {object} props - The props of the message.
 */
class CreateMessage extends Message {

    constructor(taskId, props) {
        super(MESSAGE_TYPES.EXECUTION_CREATE, taskId);
        this.fileUrl = props.fileUrl;
        this.data = props.data;
        this.legend = props.legend;
        this.provider = props.provider;
        this.datasetId = props.datasetId;
        this.validate();
    }

    validate() {
        super.validate();
        if (!this.datasetId) {
            throw new Error('DatasetId required');
        }
    }

}


/**
 * Represents a ConcatMessage.
 * @constructor
 * @param {string} type - The type of the message.
 * @param {string} taskId - The taskId of the message.
 * @param {object} props - The props of the message.
 */
class ConcatMessage extends Message {

    constructor(taskId, props) {
        super(MESSAGE_TYPES.EXECUTION_CONCAT, taskId);
        this.fileUrl = props.fileUrl;
        this.data = props.data;
        this.legend = props.legend;
        this.provider = props.provider;
        this.datasetId = props.datasetId;
        this.index = props.index;
        this.validate();
    }

    validate() {
        super.validate();
        if (!this.datasetId) {
            throw new Error('DatasetId required');
        }
        if (!this.index) {
            throw new Error('Index required');
        }
    }

}

/**
 * Represents a DeleteMessage.
 * @constructor
 * @param {string} type - The type of the message.
 * @param {string} taskId - The taskId of the message.
 * @param {object} props - The props of the message.
 */
class DeleteMessage extends Message {

    constructor(taskId, props) {
        super(MESSAGE_TYPES.EXECUTION_CONCAT, taskId);
        this.query = props.query;
        this.validate();
    }

    validate() {
        super.validate();
        if (!this.query) {
            throw new Error('Query required');
        }
    }

}

/**
 * Represents a ConfirmDeleteMessage.
 * @constructor
 * @param {string} type - The type of the message.
 * @param {string} taskId - The taskId of the message.
 * @param {object} props - The props of the message.
 */
class ConfirmDeleteMessage extends Message {

    constructor(taskId, props) {
        super(MESSAGE_TYPES.EXECUTION_CONCAT, taskId);
        this.elasticTaskId = props.elasticTaskId;
        this.validate();
    }

    validate() {
        super.validate();
        if (!this.elasticTaskId) {
            throw new Error('ElasticTaskId required');
        }
    }

}

function createMessage(type, props) {

    switch (type) {

        case MESSAGE_TYPES.EXECUTION_CREATE:
            return new CreateMessage(props.taskId, props);
        case MESSAGE_TYPES.EXECUTION_CONCAT:
            return new ConcatMessage(props.taskId, props);
        case MESSAGE_TYPES.EXECUTION_DELETE:
            return new DeleteMessage(props.taskId, props);
        case MESSAGE_TYPES.EXECUTION_CONFIRM_DELETE:
            return new ConfirmDeleteMessage(props.taskId, props);
        default:
            return new Message(type);

    }

}

module.exports = {
    createMessage,
    MESSAGE_TYPES
};