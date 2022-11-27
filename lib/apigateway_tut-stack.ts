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

    const deleteLambda = new lambda.Function(this, "deleteItemJJ", {
      code: new lambda.AssetCode("./src"),
      handler: "delete.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    });

    const updateLambda = new lambda.Function(this, "updateItemJJ", {
      code: new lambda.AssetCode("./src"),
      handler: "update.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    });

    const getItemByIdLambda = new lambda.Function(this, "getItemByIdJJ", {
      code: new lambda.AssetCode("./src"),
      handler: "getById.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    });

    dynamoTable.grantReadData(getAll);
    dynamoTable.grantReadWriteData(createLambda);
    dynamoTable.grantReadWriteData(deleteLambda);
    dynamoTable.grantReadWriteData(updateLambda);
    dynamoTable.grantReadData(getItemByIdLambda);

    const api = new apigateway.RestApi(this, "jjapigateway", {
      restApiName: "JJ test api",
    });

    const rootApi = api.root.addResource("root");
    
    const getApi = rootApi.addResource('getItem')
    const getAllIntegration = new apigateway.LambdaIntegration(getAll);
    getApi.addMethod("GET", getAllIntegration);

    const createApi = rootApi.addResource('createItem');
    const createApiIntegration = new apigateway.LambdaIntegration(createLambda);
    createApi.addMethod("POST", createApiIntegration)

    // need this for the path parameter so I imagine put is the same and get by id
    const customer = rootApi.addResource('{id}');
    const deleteApiIntegration = new apigateway.LambdaIntegration(deleteLambda);
    customer.addMethod("DELETE", deleteApiIntegration);

    const getByIdIntegration = new apigateway.LambdaIntegration(getItemByIdLambda);
    customer.addMethod("GET",getByIdIntegration);




    const updateApi = rootApi.addResource('updateItem');
    const updateApiIntegration = new apigateway.LambdaIntegration(updateLambda);
    updateApi.addMethod("PUT", updateApiIntegration);

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
