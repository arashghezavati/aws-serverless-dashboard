#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GovernanceDashboardStack } from '../lib/governance-dashboard-stack';

const app = new cdk.App();
new GovernanceDashboardStack(app, 'GovernanceDashboardStack', {
env:{
  region:'us-west-2'
}
});