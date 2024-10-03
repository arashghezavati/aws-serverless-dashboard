
// // import { S3, DynamoDB } from 'aws-sdk';

// // const s3 = new S3();
// // const dynamoDB = new DynamoDB.DocumentClient();

// // export const handler = async (event: any) => {
// //   console.log('event received',JSON.stringify(event,null,2))

// //   if (event.httpMethod === 'OPTIONS') {
// //     return {
// //       statusCode: 200,
// //       headers: {
// //         "Access-Control-Allow-Origin": "*",
// //         "Access-Control-Allow-Headers": "Content-Type",
// //         "Access-Control-Allow-Methods": "OPTIONS,POST",
// //       },
// //     };
// //   }

// //   try {
// //     // Parse the incoming request body
// //     const requestBody = JSON.parse(event.body);
// //     const { policyId, fileName } = requestBody;

// //     // Define the S3 file path
// //     const filePath = `policy/${fileName}`;

// //     // Generate pre-signed URL for S3 upload
// //     const s3Params = {
// //       Bucket: process.env.BUCKET_NAME!,
// //       Key: filePath,
// //       Expires: 60 * 5, // URL expires in 5 minutes
// //       ContentType: 'application/pdf',
// //     };

// //     const uploadUrl = s3.getSignedUrl('putObject', s3Params);

// //     // Add default values for compliance data
// //     const dbParams = {
// //       TableName: process.env.TABLE_NAME!,
// //       Item: {
// //         policyId,
// //         filePath,
// //         timestamp: new Date().toISOString(),
// //         complianceStatus: 'Not Started',  // Adding default compliance status
// //         auditStatus: 'Pending',  // Adding default audit status
// //         lastAuditDate: null,  // Adding default audit date as null
// //         nonComplianceReports: 0,  // Adding default non-compliance report count as 0
// //         evidenceAvailable: false,  // Adding default evidence available as false
// //       },
// //     };

// //     // Write to DynamoDB
// //     await dynamoDB.put(dbParams).promise();

// //     // Return the pre-signed URL and success message
// //     return {
// //       statusCode: 200,
// //       headers: {
// //         'Access-Control-Allow-Origin': '*',
// //         "Access-Control-Allow-Headers": "*",
// //         "Access-Control-Allow-Methods": "OPTIONS,POST",
// //       },
// //       body: JSON.stringify({
// //         message: "Policy uploaded successfully!",
// //         uploadUrl,
// //       }),
// //     };
// //   } catch (error) {
// //     return {
// //       statusCode: 500,
// //       headers: {
// //         "Access-Control-Allow-Origin": "*",
// //         "Access-Control-Allow-Headers": "*",
// //         "Access-Control-Allow-Methods": "OPTIONS,POST",
// //       },
// //       body: JSON.stringify({
// //         message: "Error uploading policy.",
// //         error: (error as Error).message,
// //       }),
// //     };
// //   }
// // };


// import { S3, DynamoDB } from 'aws-sdk';

// const s3 = new S3();
// const dynamoDB = new DynamoDB.DocumentClient();

// export const handler = async (event: any) => {
//   console.log('Event received from SQS:', JSON.stringify(event, null, 2));

//   for (const record of event.Records) {
//     const messageBody = JSON.parse(record.body);
//     console.log('Message body:', messageBody);

//     const { policyId, fileName } = messageBody;

//     try {
//       const filePath = `policy/${fileName}`;
//       const s3Params = {
//         Bucket: process.env.BUCKET_NAME!,
//         Key: filePath,
//         Expires: 60 * 5, // URL expires in 5 minutes
//         ContentType: 'application/pdf',
//       };

//       const uploadUrl = s3.getSignedUrl('putObject', s3Params);
//       console.log('Generated pre-signed URL:', uploadUrl);

//       const dbParams = {
//         TableName: process.env.TABLE_NAME!,
//         Item: {
//           policyId,
//           filePath,
//           timestamp: new Date().toISOString(),
//           complianceStatus: 'Not Started',
//           auditStatus: 'Pending',
//           lastAuditDate: null,
//           nonComplianceReports: 0,
//           evidenceAvailable: false,
//           uploadUrl, // Optionally store the generated URL
//         },
//       };

//       await dynamoDB.put(dbParams).promise();
//       console.log('Policy information stored in DynamoDB successfully.');

//     } catch (error) {
//       console.error('Error processing the SQS message:');
//       throw error; // Optional: rethrow to allow for retry logic
//     }
//   }

//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: 'Policies processed successfully!' }),
//   };
// };

import { S3, DynamoDB, SQS } from 'aws-sdk';

const s3 = new S3();
const dynamoDB = new DynamoDB.DocumentClient();
const sqs = new SQS();

export const handler = async (event: any) => {
  console.log('event received', JSON.stringify(event, null, 2));

// This checks if the HTTP method is OPTIONS, which is used for CORS pre-flight requests. 
// If true, it responds with appropriate headers to allow cross-origin requests.
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
    // This sets up parameters for generating a pre-signed URL. 
    // This URL allows the client to upload the policy document directly to S3 without exposing AWS credentials. 
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

    // Send a message to SQS
    const messageBody = {
      policyId,
      filePath,
      action: 'PolicyUploaded',
    };

    await sqs.sendMessage({
      QueueUrl: process.env.QUEUE_URL!,
      MessageBody: JSON.stringify(messageBody),
    }).promise();

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
