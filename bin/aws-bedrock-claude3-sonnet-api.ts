#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsBedrockClaude3SonnetApiStack } from '../lib/aws-bedrock-claude3-sonnet-api-stack';

const app = new cdk.App();
new AwsBedrockClaude3SonnetApiStack(app, 'AwsBedrockClaude3SonnetApiStack', {
   env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});