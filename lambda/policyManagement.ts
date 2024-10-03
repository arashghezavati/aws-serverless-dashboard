
import { S3, DynamoDB, SQS } from 'aws-sdk';

const s3 = new S3();
const dynamoDB = new DynamoDB.DocumentClient();
const sqs = new SQS();

export const handler = async (event: any) => {
  console.log('event received', JSON.stringify(event, null, 2));

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
    };
  }

  try {
  
    const requestBody = JSON.parse(event.body);
    const { policyId, fileName } = requestBody;

 
    const filePath = `policy/${fileName}`;

 
    const s3Params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: filePath,
      Expires: 60 * 5,
      ContentType: 'application/pdf',
    };

    const uploadUrl = s3.getSignedUrl('putObject', s3Params);

    const dbParams = {
      TableName: process.env.TABLE_NAME!,
      Item: {
        policyId,
        filePath,
        timestamp: new Date().toISOString(),
        complianceStatus: 'Not Started', 
        auditStatus: 'Pending',  
        lastAuditDate: null, 
        nonComplianceReports: 0,
        evidenceAvailable: false,
      },
    };

    await dynamoDB.put(dbParams).promise();

    const messageBody = {
      policyId,
      filePath,
      action: 'PolicyUploaded',
    };

    await sqs.sendMessage({
      QueueUrl: process.env.QUEUE_URL!,
      MessageBody: JSON.stringify(messageBody),
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({
        message: "Policy uploaded successfully!",
        uploadUrl,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({
        message: "Error uploading policy.",
        error: (error as Error).message,
      }),
    };
  }
};
