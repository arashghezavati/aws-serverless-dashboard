

// import { DynamoDB } from 'aws-sdk';

// const dynamoDB = new DynamoDB.DocumentClient();
// export const handler = async (event: any) => {
//   console.log("Lambda started");
//   console.log("Event received", JSON.stringify(event, null, 2)); 
  
//   try {
//     const params = {
//       TableName: process.env.TABLE_NAME!,
//       Limit: 10,
//     };

//     console.log("Fetching data from DynamoDB with params:", JSON.stringify(params));

//     const result = await dynamoDB.scan(params).promise();

//     console.log("DynamoDB result:", JSON.stringify(result));

//     if (result.Items) {
//       const complianceData = result.Items.map(item => ({
//         policyId: item.policyId,
//         filePath: item.filePath,
//         timestamp: item.timestamp,
//         complianceStatus: item.complianceStatus || 'Not Started',
//         auditStatus: item.auditStatus || 'Not Audited',
//         lastAuditDate: item.lastAuditDate || 'N/A',
//         nonComplianceReports: item.nonComplianceReports || 0,
//         evidenceAvailable: item.evidenceAvailable ? 'Yes' : 'No',
//       }));

//       console.log("Compliance data processed", JSON.stringify(complianceData));

//       return {
//         statusCode: 200,
//         body: JSON.stringify(complianceData),
//       };
//     } else {
//       console.log("No compliance records found");
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ message: 'No compliance records found' }),
//       };
//     }
//   } catch (error) {
//     console.error("Error occurred:", (error as Error).message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Internal server error', error: (error as Error).message }),
//     };
//   }
// };

import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
export const handler = async (event: any) => {
  console.log("Lambda started");
  console.log("Event received", JSON.stringify(event, null, 2)); 
  
  try {
    const params = {
      TableName: process.env.TABLE_NAME!,
      Limit: 10,
    };

    console.log("Fetching data from DynamoDB with params:", JSON.stringify(params));

    const result = await dynamoDB.scan(params).promise();

    console.log("DynamoDB result:", JSON.stringify(result));

    if (result.Items) {
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

      console.log("Compliance data processed", JSON.stringify(complianceData));

      return {
        statusCode: 200,
        body: JSON.stringify(complianceData),
      };
    } else {
      console.log("No compliance records found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No compliance records found' }),
      };
    }
  } catch (error) {
    console.error("Error occurred:", (error as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: (error as Error).message }),
    };
  }
};
