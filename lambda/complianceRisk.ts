


import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
export const handler = async (event: any) => {
  
  try {
    const params = {
      TableName: process.env.TABLE_NAME!,
      Limit: 10,
    };


    const result = await dynamoDB.scan(params).promise();


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


      return {
        statusCode: 200,
        body: JSON.stringify(complianceData),
      };
    } else {
      console.log("No records found");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No records found' }),
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
