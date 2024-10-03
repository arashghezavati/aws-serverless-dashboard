import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);

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
    } catch (error) {
      console.error("Error processing", error);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Messages processed successfully' }),
  };
};
