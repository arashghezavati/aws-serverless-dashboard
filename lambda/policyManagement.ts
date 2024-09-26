
import { S3, DynamoDB } from 'aws-sdk';

const s3 = new S3();
const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
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
    // Parse the incoming request body
    const requestBody = JSON.parse(event.body);
    const { policyId, fileName } = requestBody;

    // Define the S3 file path
    const filePath = `policy/${fileName}`;

    // Generate pre-signed URL for S3 upload
    const s3Params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: filePath,
      Expires: 60 * 5, // URL expires in 5 minutes
      ContentType: 'application/pdf',
    };

    const uploadUrl = s3.getSignedUrl('putObject', s3Params);

    // Add default values for compliance data
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

    // Write to DynamoDB
    await dynamoDB.put(dbParams).promise();

    // Return the pre-signed URL and success message
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
