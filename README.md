# Policy and Compliance Management Architecture

This diagram illustrates the policy and compliance management workflow for the project, which is deployed on AWS using several services like API Gateway, Lambda, S3, SQS, DynamoDB, and SNS.

![Policy and Compliance Management Diagram](./images/Untitled%20Diagram.drawio.png)

## Architecture Explanation

1. **User Interaction**: 
   - Users interact with the system through **API Gateway**. They can either upload a policy or fetch compliance data.

2. **Policy Management Flow**: 
   - API Gateway routes the policy upload request to **SQS (Simple Queue Service)**.
   - **SQS** queues the request and triggers a **Lambda function** for managing policies.
   - The **Lambda function**:
     - Uploads the policy document to **S3** for storage.
     - Stores metadata (policyId, filePath, timestamp) in **DynamoDB**.
   - Once the file is uploaded to S3, **SNS** sends notifications.
   - If necessary, **DynamoDB Streams** can trigger further actions.

3. **Compliance Management Flow**: 
   - The API Gateway directly routes the request to the **Compliance Lambda** without involving SQS.
   - The **Lambda function** fetches compliance-related data from **DynamoDB** and updates compliance metrics if needed.

4. **Storage and Notifications**:
   - **S3** stores policy documents, while **DynamoDB** holds metadata and compliance information.
   - **SNS** is used to send notifications based on actions triggered by S3 or DynamoDB.
