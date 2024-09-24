

import { SNS } from 'aws-sdk';

const sns = new SNS();

export const handler = async (event: any) => {
  for (const record of event.Records) {
    if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
      const message = {
        policyId: record.dynamodb.Keys.policyId.S,
        newImage: record.dynamodb.NewImage,
      };
      const params = {
        Message: JSON.stringify(message),
        TopicArn: process.env.TOPIC_ARN!,
      };
      await sns.publish(params).promise();
    }
  }
};
