import * as cdk from "aws-cdk-lib";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class ApigatewayTutStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, "jjtestdynamo", {
      partitionKey: { name: "itemId", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const getAll = new lambda.Function(this, "getAllItemsJJ", {
      code: new lambda.AssetCode("./src"),
      handler: "get-all.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    });

    const createLambda = new lambda.Function(this, "createItemsJJ", {
      code: new lambda.AssetCode("./src"),
      handler: "create.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    });

    dynamoTable.grantReadData(getAll);
    dynamoTable.grantReadWriteData(createLambda)

    const api = new apigateway.RestApi(this, "jjapigateway", {
      restApiName: "JJ test api",
    });

    const rootApi = api.root.addResource("root");
    
    const getApi = rootApi.addResource('get')
    const getAllIntegration = new apigateway.LambdaIntegration(getAll);
    getApi.addMethod("GET", getAllIntegration);

    const createApi = rootApi.addResource('create');
    const createApiIntegration = new apigateway.LambdaIntegration(createLambda);
    createApi.addMethod("POST", createApiIntegration)

    const plan = api.addUsagePlan("UsagePlan", {
      name: "EASY",
      throttle: {
        rateLimit: 20,
        burstLimit: 2,
      },
    });

    const key = api.addApiKey('ApiKey');
    plan.addApiKey(key);

    new CfnOutput(this, 'key id', {
      value: key.keyId,
    });

    new CfnOutput(this, 'api url', {
      value: api.url,
    });

  }
}
