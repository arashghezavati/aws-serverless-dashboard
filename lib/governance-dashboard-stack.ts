// // import * as cdk from 'aws-cdk-lib';
// // import { Construct } from 'constructs';
// // import * as s3 from 'aws-cdk-lib/aws-s3';
// // import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// // import * as sns from 'aws-cdk-lib/aws-sns';
// // import * as lambda from 'aws-cdk-lib/aws-lambda';
// // import * as sqs from 'aws-cdk-lib/aws-sqs';
// // import * as apigateway from 'aws-cdk-lib/aws-apigateway';

// // export class GovernanceDashboardStack extends cdk.Stack {
// //   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
// //     super(scope, id, props);

// //     // Create S3 Bucket
// // const policyBucket = new s3.Bucket(this, 'PolicyBucket', {
// //   versioned: true,
// //   removalPolicy: cdk.RemovalPolicy.DESTROY,
// //   cors: [
// //     {
// //       allowedOrigins: ['http://localhost:3000'], // Update with your actual origin
// //       allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
// //       allowedHeaders: ['*'],
// //       maxAge: 3000,
// //     },
// //   ],
// // });


// //     // Create DynamoDB Table
// //     const complianceTable = new dynamodb.Table(this, 'ComplianceTable', {
// //       partitionKey: { name: 'policyId', type: dynamodb.AttributeType.STRING },
// //       removalPolicy: cdk.RemovalPolicy.DESTROY,
// //       stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
// //     });

// //     // Create SNS Topic
// //     const complianceNotificationTopic = new sns.Topic(this, 'ComplianceNotificationTopic', {
// //       displayName: 'Compliance Notifications',
// //     });

// //     // Create Policy Management Lambda
// //     const policyManagementLambda = new lambda.Function(this, 'PolicyManagementLambda', {
// //       runtime: lambda.Runtime.NODEJS_16_X, // Update to supported runtime
// //       handler: 'policyManagement.handler',
// //       code: lambda.Code.fromAsset('lambda'), // Path to Lambda code
// //       environment: {
// //         BUCKET_NAME: policyBucket.bucketName,
// //         TABLE_NAME: complianceTable.tableName,
// //       },
// //     });

// //     // Create Compliance & Risk Lambda
// //     const complianceRiskLambda = new lambda.Function(this, 'ComplianceRiskLambda', {
// //       runtime: lambda.Runtime.NODEJS_16_X, // Update to supported runtime
// //       handler: 'complianceRisk.handler',
// //       code: lambda.Code.fromAsset('lambda'), // Path to Lambda code
// //       environment: {
// //         BUCKET_NAME: policyBucket.bucketName,  // Ensure this is set correctly
// //         TABLE_NAME: complianceTable.tableName,
// //       },
// //     });

// //     // Create DynamoDB Stream Processor Lambda
// //     const streamProcessorLambda = new lambda.Function(this, 'StreamProcessorLambda', {
// //       runtime: lambda.Runtime.NODEJS_16_X, // Update to supported runtime
// //       handler: 'streamProcessor.handler',
// //       code: lambda.Code.fromAsset('lambda'),
// //       environment: {
// //         TOPIC_ARN: complianceNotificationTopic.topicArn,
// //       },
// //     });

// //     // Grant permissions
// //     policyBucket.grantReadWrite(policyManagementLambda);
// //     complianceTable.grantReadWriteData(policyManagementLambda);
// //     complianceTable.grantReadWriteData(complianceRiskLambda);
// //     complianceNotificationTopic.grantPublish(streamProcessorLambda);
// //     complianceTable.grantStreamRead(streamProcessorLambda);

// //     // Create SQS Queue
// //     const queue = new sqs.Queue(this, 'Queue', {
// //       // SQS settings (if needed)
// //     });

// //     // Create API Gateway
// //     const api = new apigateway.RestApi(this, 'GovernanceApi', {
// //       restApiName: 'Governance Service',
// //       description: 'This service manages governance policies and compliance.',
// //     });

// //     // Create a resource for uploading policies
// //     const policyResource = api.root.addResource('policies');
// //     policyResource.addMethod('POST', new apigateway.LambdaIntegration(policyManagementLambda));

// //     // Create a resource for compliance metrics
// //     const complianceResource = api.root.addResource('compliance');
// //     complianceResource.addMethod('GET', new apigateway.LambdaIntegration(complianceRiskLambda));
// //   }
// // }
// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import * as sns from 'aws-cdk-lib/aws-sns';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// import * as apigateway from 'aws-cdk-lib/aws-apigateway';

// export class GovernanceDashboardStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // S3 Bucket
//     const policyBucket = new s3.Bucket(this, 'PolicyBucket', {
//       versioned: true,
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       cors: [
//         {
//           allowedOrigins: ['http://localhost:3000'], // Update with your actual origin
//           allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
//           allowedHeaders: ['*'],
//           maxAge: 3000,
//         },
//       ],
//     });

//     // DynamoDB Table
//     const complianceTable = new dynamodb.Table(this, 'ComplianceTable', {
//       partitionKey: { name: 'policyId', type: dynamodb.AttributeType.STRING },
//       removalPolicy: cdk.RemovalPolicy.DESTROY,
//       stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
//     });

//     // SNS Topic
//     const complianceNotificationTopic = new sns.Topic(this, 'ComplianceNotificationTopic', {
//       displayName: 'Compliance Notifications',
//     });

//     // Policy Management Lambda
//     const policyManagementLambda = new lambda.Function(this, 'PolicyManagementLambda', {
//       runtime: lambda.Runtime.NODEJS_16_X,
//       handler: 'policyManagement.handler',
//       code: lambda.Code.fromAsset('lambda'),
//       environment: {
//         BUCKET_NAME: policyBucket.bucketName,
//         TABLE_NAME: complianceTable.tableName,
//       },
//     });

//     // Compliance Risk Lambda
//     const complianceRiskLambda = new lambda.Function(this, 'ComplianceRiskLambda', {
//       runtime: lambda.Runtime.NODEJS_16_X,
//       handler: 'complianceRisk.handler',
//       code: lambda.Code.fromAsset('lambda'),
//       environment: {
//         BUCKET_NAME: policyBucket.bucketName,
//         TABLE_NAME: complianceTable.tableName,
//       },
//     });

//     // NEW: Update Compliance Lambda
//     const updateComplianceLambda = new lambda.Function(this, 'UpdateComplianceLambda', {
//       runtime: lambda.Runtime.NODEJS_16_X,
//       handler: 'updateCompliance.handler',
//       code: lambda.Code.fromAsset('lambda'),
//       environment: {
//         TABLE_NAME: complianceTable.tableName,
//       },
//     });

//     // Grant permissions to the lambdas
//     policyBucket.grantReadWrite(policyManagementLambda);
//     complianceTable.grantReadWriteData(policyManagementLambda);
//     complianceTable.grantReadWriteData(complianceRiskLambda);
//     complianceTable.grantReadWriteData(updateComplianceLambda);
//     complianceNotificationTopic.grantPublish(updateComplianceLambda);

//     // API Gateway
//     const api = new apigateway.RestApi(this, 'GovernanceApi', {
//       restApiName: 'Governance Service',
//       description: 'This service manages governance policies and compliance.',
//     });

//     // Resources for uploading and retrieving policies
//     const policyResource = api.root.addResource('policies');
//     policyResource.addMethod('POST', new apigateway.LambdaIntegration(policyManagementLambda));

//     const complianceResource = api.root.addResource('compliance');
//     complianceResource.addMethod('GET', new apigateway.LambdaIntegration(complianceRiskLambda));

//     // NEW: Resource for updating compliance details
//     const complianceItemResource = complianceResource.addResource('{policyId}');
//     complianceItemResource.addMethod('PUT', new apigateway.LambdaIntegration(updateComplianceLambda));
//   }
// }
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class GovernanceDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const policyBucket = new s3.Bucket(this, 'PolicyBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedOrigins: ['http://localhost:3000'], // Update with your actual origin
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    // DynamoDB Table
    const complianceTable = new dynamodb.Table(this, 'ComplianceTable', {
      partitionKey: { name: 'policyId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // SNS Topic
    const complianceNotificationTopic = new sns.Topic(this, 'ComplianceNotificationTopic', {
      displayName: 'Compliance Notifications',
    });

    // Policy Management Lambda
    const policyManagementLambda = new lambda.Function(this, 'PolicyManagementLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'policyManagement.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: policyBucket.bucketName,
        TABLE_NAME: complianceTable.tableName,
      },
    });

    // Compliance Risk Lambda
    const complianceRiskLambda = new lambda.Function(this, 'ComplianceRiskLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'complianceRisk.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: policyBucket.bucketName,
        TABLE_NAME: complianceTable.tableName,
      },
    });

    // // NEW: Update Compliance Lambda
    // const updateComplianceLambda = new lambda.Function(this, 'UpdateComplianceLambda', {
    //   runtime: lambda.Runtime.NODEJS_16_X,
    //   handler: 'updateCompliance.handler',
    //   code: lambda.Code.fromAsset('lambda'),
    //   environment: {
    //     TABLE_NAME: complianceTable.tableName,
    //   },
    // });

    // Grant permissions to the lambdas
    policyBucket.grantReadWrite(policyManagementLambda);
    complianceTable.grantReadWriteData(policyManagementLambda);
    complianceTable.grantReadWriteData(complianceRiskLambda);
    // complianceTable.grantReadWriteData(updateComplianceLambda);
    // complianceNotificationTopic.grantPublish(updateComplianceLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, 'GovernanceApi', {
      restApiName: 'Governance Service',
      description: 'This service manages governance policies and compliance.',
    });

    // Resources for uploading and retrieving policies
    const policyResource = api.root.addResource('policies');
    policyResource.addMethod('POST', new apigateway.LambdaIntegration(policyManagementLambda));

    const complianceResource = api.root.addResource('compliance');
    complianceResource.addMethod('GET', new apigateway.LambdaIntegration(complianceRiskLambda));

    // // NEW: Resource for updating compliance details
    // const complianceItemResource = complianceResource.addResource('{policyId}');
    // complianceItemResource.addMethod('PUT', new apigateway.LambdaIntegration(updateComplianceLambda));
  }
}
