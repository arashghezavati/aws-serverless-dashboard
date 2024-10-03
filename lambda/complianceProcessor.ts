import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  console.log('Processing SQS messages:', JSON.stringify(event));

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    console.log('Message received:', messageBody);

    // Process the message (e.g., log it, store it in DynamoDB, etc.)
    const params = {
      TableName: process.env.TABLE_NAME!,
      Item: {
        policyId: messageBody.policyId,
        filePath: messageBody.filePath,
        timestamp: new Date().toISOString(),
        complianceStatus: 'Processed', // Indicate processing
      },
    };

    try {
      await dynamoDB.put(params).promise();
      console.log(`Successfully processed message for policyId: ${messageBody.policyId}`);
    } catch (error) {
      console.error("Error processing message:", error);
      // Handle error (e.g., send to a dead-letter queue or log the failure)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Messages processed successfully' }),
  };
};
