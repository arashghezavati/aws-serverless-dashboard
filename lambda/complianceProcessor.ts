import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  console.log('Processing SQS messages:', JSON.stringify(event));

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    console.log('Message received:', messageBody);

    //Updataing
    const params = {
      TableName: process.env.TABLE_NAME!,
      Item: {
        policyId: messageBody.policyId,
        filePath: messageBody.filePath,
        timestamp: new Date().toISOString(),
        complianceStatus: 'Processed',
      },
    };

    try {
      await dynamoDB.put(params).promise();
      console.log(`Successfully processed message for policyId: ${messageBody.policyId}`);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Messages processed successfully' }),
  };
};
