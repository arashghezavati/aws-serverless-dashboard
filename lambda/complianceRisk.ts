

import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler = async (event: any) => {
  try {
    // Fetch the compliance data for all policies
    const params = {
      TableName: process.env.TABLE_NAME!, 
      Limit: 10,
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
