
// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import * as sns from 'aws-cdk-lib/aws-sns';
// import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
// import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
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
//       // stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
//     });

//     // SNS Topic
//     const complianceNotificationTopic = new sns.Topic(this, 'ComplianceNotificationTopic', {
//       displayName: 'Compliance Notifications',
//     });

//     // Subscribe email to the SNS Topic
//     complianceNotificationTopic.addSubscription(new snsSubscriptions.EmailSubscription('arash.ghezavati@gmail.com'));
    
//     // Set up S3 bucket notifications to trigger SNS
//     policyBucket.addEventNotification(
//       s3.EventType.OBJECT_CREATED_PUT, 
//       new s3n.SnsDestination(complianceNotificationTopic)
//     );

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

//     // Grant permissions to the lambdas
//     policyBucket.grantReadWrite(policyManagementLambda);
//     complianceTable.grantReadWriteData(policyManagementLambda);
//     complianceTable.grantReadWriteData(complianceRiskLambda);

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
//   }
// }

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sqsEvents from 'aws-cdk-lib/aws-lambda-event-sources';

export class GovernanceDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const policyBucket = new s3.Bucket(this, 'PolicyBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedOrigins: ['http://localhost:3000'], 
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
    });

    // SNS
    const complianceNotificationTopic = new sns.Topic(this, 'ComplianceNotificationTopic', {
      displayName: 'Compliance Notifications',
    });

    // Subscribe email to the SNS Topic
    complianceNotificationTopic.addSubscription(new snsSubscriptions.EmailSubscription('arash.ghezavati@gmail.com'));

    // Set up S3 bucket notifications to trigger SNS
    policyBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT, 
      new s3n.SnsDestination(complianceNotificationTopic)
    );

    // SQS Queue
    const complianceQueue = new sqs.Queue(this, 'ComplianceQueue', {
      visibilityTimeout: cdk.Duration.seconds(30),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Subscribe SQS queue to SNS topic
    complianceNotificationTopic.addSubscription(new snsSubscriptions.SqsSubscription(complianceQueue));

    // Policy Management Lambda
    const policyManagementLambda = new lambda.Function(this, 'PolicyManagementLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'policyManagement.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        BUCKET_NAME: policyBucket.bucketName,
        TABLE_NAME: complianceTable.tableName,
        QUEUE_URL: complianceQueue.queueUrl,
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

    // Compliance Processor Lambda
    const complianceProcessorLambda = new lambda.Function(this, 'ComplianceProcessorLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'complianceProcessor.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: complianceTable.tableName,
      },
    });

    // Grant permissions to the lambdas
    policyBucket.grantReadWrite(policyManagementLambda);
    complianceTable.grantReadWriteData(policyManagementLambda);
    complianceTable.grantReadWriteData(complianceRiskLambda);
    complianceTable.grantReadWriteData(complianceProcessorLambda);
    complianceQueue.grantSendMessages(policyManagementLambda); // Grant permission to send messages to SQS
    complianceQueue.grantConsumeMessages(complianceProcessorLambda); // Grant permission to read messages from SQS

    // Add SQS as an event source for Compliance Processor Lambda
    complianceProcessorLambda.addEventSource(new sqsEvents.SqsEventSource(complianceQueue));

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
  }
}
