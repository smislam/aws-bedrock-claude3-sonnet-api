import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path = require('path');

export class AwsBedrockClaude3SonnetApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';

    const model_runner = new NodejsFunction(this, 'model-runner', {
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '/../lambda/model_caller.ts'),
      environment: {
        MODEL_ID: modelId
      },
      logRetention: RetentionDays.ONE_DAY,
      tracing: Tracing.ACTIVE,
      timeout: cdk.Duration.minutes(1)
    });

    model_runner.addToRolePolicy(new PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: [`arn:aws:bedrock:${cdk.Aws.REGION}::foundation-model/${modelId}`]
    }));

    const api = new LambdaRestApi(this, 'test-api', {
      handler: model_runner
    });

  }
}
