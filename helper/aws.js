const AWS = require('aws-sdk');

const SQS = new AWS.SQS({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
});

module.exports = {
    SQS,
    helper: {
        sendMessage: async (queue, message) => {
            const parameter = {
                MessageBody: typeof message === 'string' ? message : JSON.stringify(message),
                QueueUrl: (await SQS.getQueueUrl({QueueName: queue}).promise()).QueueUrl,
            };
            return SQS.sendMessage(parameter).promise()
        },
        receiveMessage: async (queue) => {
            const parameter = {
                QueueUrl: (await SQS.getQueueUrl({QueueName: queue}).promise()).QueueUrl
            }

            return SQS.receiveMessage(parameter).promise()
        },
        deleteMessage: async (queue, ReceiptHandle) => {
            const parameter = {
                QueueUrl: (await SQS.getQueueUrl({QueueName: queue}).promise()).QueueUrl,
                ReceiptHandle
            }

            return SQS.deleteMessage(parameter).promise()
        },
      getEncodingJob: video => {
        return {
          permlink: video.permlink,
          filename: video.filename,
          thumbnail: video.thumbnail
        }
      },
    }
};
