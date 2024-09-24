


// import { S3, DynamoDB } from 'aws-sdk';

// const s3 = new S3();
// const dynamoDB = new DynamoDB.DocumentClient();
// export const handler = async (event: any) => {
//   try {
//     const policyId = event.queryStringParameters?.policyId;

//     const getPresignedDownloadUrl = (filePath: string) => {
//       const s3Params = {
//         Bucket: process.env.BUCKET_NAME!,
//         Key: filePath,
//         Expires: 60 * 15, // URL expires in 5 minutes
//       };
//       return s3.getSignedUrl('getObject', s3Params);
//     };

//     if (policyId) {
//       const params = {
//         TableName: process.env.TABLE_NAME!,
//         Key: { policyId },
//       };

//       const result = await dynamoDB.get(params).promise();

//       if (result.Item) {
//         const downloadUrl = getPresignedDownloadUrl(result.Item.filePath);
//         return {
//           statusCode: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Headers': 'Content-Type',
//             'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
//           },
//           body: JSON.stringify({
//             ...result.Item,
//             downloadUrl,
//           }),
//         };
//       } else {
//         return {
//           statusCode: 404,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//           },
//           body: JSON.stringify({ message: 'Policy not found' }),
//         };
//       }
//     } else {
//       const params = {
//         TableName: process.env.TABLE_NAME!,
//         Limit: 10,
//       };

//       const result = await dynamoDB.scan(params).promise();
//       const itemsWithUrls = result.Items?.map((item) => ({
//         ...item,
//         downloadUrl: getPresignedDownloadUrl(item.filePath),
//       }));

//       return {
//         statusCode: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Headers': 'Content-Type',
//           'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
//         },
//         body: JSON.stringify(itemsWithUrls),
//       };
//     }
//   } catch (error) {
//     return {
//       statusCode: 500,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: JSON.stringify({
//         message: 'Internal server error',
//         error: (error as Error).message,
//       }),
//     };
//   }
// };



// import { S3, DynamoDB } from 'aws-sdk';

// const s3 = new S3();
// const dynamoDB = new DynamoDB.DocumentClient();

// export const handler = async (event: any) => {
//   try {
//     const policyId = event.queryStringParameters?.policyId;

//     const getPresignedDownloadUrl = (filePath: string) => {
//       const s3Params = {
//         Bucket: process.env.BUCKET_NAME!,
//         Key: filePath,
        

//         Expires: 60 * 15, // URL expires in 15 minutes
//       };
//       return s3.getSignedUrl('getObject', s3Params);
//     };

//     // If policyId is provided, fetch a single policy
//     if (policyId) {
//       const params = {
//         TableName: process.env.TABLE_NAME!,
//         Key: { policyId },
        

//       };

//       const result = await dynamoDB.get(params).promise();

//       if (result.Item) {
//         const downloadUrl = getPresignedDownloadUrl(result.Item.filePath);
//         return {
//           statusCode: 200,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Headers': 'Content-Type',
//             'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
//           },
//           body: JSON.stringify({
//             ...result.Item,
//             downloadUrl,
//           }),
//         };
//       } else {
//         return {
//           statusCode: 404,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//           },
//           body: JSON.stringify({ message: 'Policy not found' }),
//         };
//       }
//     } 
//     // If no policyId is provided, fetch all policies
//     else {
//       const params = {
//         TableName: process.env.TABLE_NAME!,
//         Limit: 10,
//       };

//       const result = await dynamoDB.scan(params).promise();
//       const itemsWithUrls = result.Items?.map((item) => ({
//         ...item,
//         downloadUrl: getPresignedDownloadUrl(item.filePath),
//       }));

//       return {
//         statusCode: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Headers': 'Content-Type',
//           'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
//         },
//         body: JSON.stringify(itemsWithUrls),
//       };
//     }
//   } catch (error) {
//     return {
//       statusCode: 500,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: JSON.stringify({
//         message: 'Internal server error',
//         error: (error as Error).message,
//       }),
//     };
//   }
// };


import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  try {
    // Fetch the compliance data for all policies
    const params = {
      TableName: process.env.TABLE_NAME!, // Ensure the table name is correct
      Limit: 10, // Limit the number of records returned, adjust as needed
    };

    const result = await dynamoDB.scan(params).promise();

    // Check if there are any records
    if (result.Items) {
      // Return the compliance data, including the complianceStatus, auditStatus, etc.
      const complianceData = result.Items.map(item => ({
        policyId: item.policyId,
        filePath: item.filePath,
        timestamp: item.timestamp,
        complianceStatus: item.complianceStatus || 'Not Started',
        auditStatus: item.auditStatus || 'Not Audited',
        lastAuditDate: item.lastAuditDate || 'N/A',
        nonComplianceReports: item.nonComplianceReports || 0,
        evidenceAvailable: item.evidenceAvailable ? 'Yes' : 'No',
      }));

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,GET',
        },
        body: JSON.stringify(complianceData),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,GET',
        },
        body: JSON.stringify({ message: 'No compliance records found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: (error as Error).message,
      }),
    };
  }
};
