

// import { S3, DynamoDB } from 'aws-sdk';

// const s3 = new S3();
// const dynamoDB = new DynamoDB.DocumentClient();

// export const handler = async (event: any) => {
//   if (event.httpMethod === 'OPTIONS') {
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*", // Adjust as necessary
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "OPTIONS,POST",
//       },
//     };
//   }

//   try {
//     // Parse the incoming request body
//     const requestBody = JSON.parse(event.body);
//     const { policyId, fileName } = requestBody;

//     // Define the S3 file path
//     const filePath = `policy/${fileName}`;

//     // Generate pre-signed URL for S3 upload
//     const s3Params = {
//       Bucket: process.env.BUCKET_NAME!, // Ensure this environment variable is set
//       Key: filePath,
//       Expires: 60 * 5, // URL expires in 5 minutes
//       ContentType: 'application/pdf',
//     };

//     const uploadUrl = s3.getSignedUrl('putObject', s3Params);

//     // Store metadata in DynamoDB
//     // const dbParams = {
//     //   TableName: process.env.TABLE_NAME!, // Ensure this environment variable is set
//     //   Item: {
//     //     policyId,
//     //     filePath,
//     //     timestamp: new Date().toISOString(),
//     //   },
//     // };
//    const dbParams = {
//   TableName: process.env.TABLE_NAME!,
//   Item: {
//     policyId,
//     filePath,
//     timestamp: new Date().toISOString(),
//     complianceStatus: 'Not Started',  // Add default values
//     auditStatus: 'Pending',
//     lastAuditDate: null,
//     nonComplianceReports: 0,
//     evidenceAvailable: false,
//   },
// };



//     await dynamoDB.put(dbParams).promise();

//     // Return the pre-signed URL and success message
//     return {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         "Access-Control-Allow-Headers": "*", // Allow all headers
//         "Access-Control-Allow-Methods": "OPTIONS,POST", // Specify allowed methods
//       },
//       body: JSON.stringify({
//         message: "Policy uploaded successfully!",
//         uploadUrl, // Added the pre-signed URL to the response body
//       }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "*",
//         "Access-Control-Allow-Methods": "OPTIONS,POST",
//       },
//       body: JSON.stringify({
//         message: "Error uploading policy.",
//         error: (error as Error).message,
//       }),
//     };
//   }
// };
// import { S3, DynamoDB } from 'aws-sdk';

// const s3 = new S3();
// const dynamoDB = new DynamoDB.DocumentClient();

// export const handler = async (event: any) => {
//   if (event.httpMethod === 'OPTIONS') {
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Content-Type",
//         "Access-Control-Allow-Methods": "OPTIONS,POST",
//       },
//     };
//   }

//   try {
//     // Parse the incoming request body
//     const requestBody = JSON.parse(event.body);
//     const { policyId, fileName } = requestBody;

//     // Define the S3 file path
//     const filePath = `policy/${fileName}`;

//     // Generate pre-signed URL for S3 upload
//     const s3Params = {
//       Bucket: process.env.BUCKET_NAME!,
//       Key: filePath,
//       Expires: 60 * 5, // URL expires in 5 minutes
//       ContentType: 'application/pdf',
      
//     };

//     const uploadUrl = s3.getSignedUrl('putObject', s3Params);

//     // Store metadata in DynamoDB (with the new fields)
//     const dbParams = {
//       TableName: process.env.TABLE_NAME!, // Ensure this environment variable is set
//       Item: {
//         policyId,
//         filePath,
//         timestamp: new Date().toISOString(),
//         complianceStatus: 'Not Started', // Default compliance status
//         auditStatus: 'Pending', // Default audit status
//         lastAuditDate: null, // No audit done yet
//         nonComplianceReports: 0, // Default value
//         evidenceAvailable: false, // Default value
//       },
//     };
    

//     await dynamoDB.put(dbParams).promise();

//     // Return the pre-signed URL and success message
//     return {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         "Access-Control-Allow-Headers": "*",
//         "Access-Control-Allow-Methods": "OPTIONS,POST",
//       },
//       body: JSON.stringify({
//         message: "Policy uploaded successfully!",
//         uploadUrl,
//       }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "*",
//         "Access-Control-Allow-Methods": "OPTIONS,POST",
//       },
//       body: JSON.stringify({
//         message: "Error uploading policy.",
//         error: (error as Error).message,
//       }),
//     };
//   }
// };
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
        complianceStatus: 'Not Started',  // Adding default compliance status
        auditStatus: 'Pending',  // Adding default audit status
        lastAuditDate: null,  // Adding default audit date as null
        nonComplianceReports: 0,  // Adding default non-compliance report count as 0
        evidenceAvailable: false,  // Adding default evidence available as false
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
