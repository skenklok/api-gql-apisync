// 1. Import dependencies
const cdk = require('aws-cdk-lib');
const appsync = require('aws-cdk-lib/aws-appsync');
const lambda = require('aws-cdk-lib/aws-lambda');

// 2. setup a static expiration date for the API KEY
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const WORKSHOP_DATE = new Date(); // date of this workshop
WORKSHOP_DATE.setHours(0);
WORKSHOP_DATE.setMinutes(0);
WORKSHOP_DATE.setSeconds(0);
WORKSHOP_DATE.setMilliseconds(0);
const KEY_EXPIRATION_DATE = new Date(WORKSHOP_DATE.getTime() + SEVEN_DAYS);

class ApiGqlAppsyncStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // 3. Define your AppSync API
    const api = new appsync.GraphqlApi(this, 'WorkshopAPI', {
      name: 'WorkshopAPI',
      // 3. a. create schema using our schema definition
      schema: appsync.SchemaFile.fromAsset('appsync/schema.graphql'),
      // 3. b. Authorization mode
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: 'API_KEY',
          apiKeyConfig: {
            name: 'default',
            description: 'default auth mode',
            expires: cdk.Expiration.atDate(KEY_EXPIRATION_DATE),
          },
        },
      },
    });

    // 4. Create a Lambda function as a data source for REST API calls
    const restApiLambda = new lambda.Function(this, 'RestApiLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda-adapters/lambda'),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
    });
    
      // 4. Create a Lambda function as a data source for REST API calls
      const albumApiLambda = new lambda.Function(this, 'albumApiLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda-adapters/album'),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
    });
    

    // 5. Set up Lambda function as a data source and grant access
    const lambdaDataSource = api.addLambdaDataSource('restApiLambdaDataSource', restApiLambda);
    const albumApiLambdaDataSource = api.addLambdaDataSource('albumApiLambdaDataSource', albumApiLambda);

    // 6. Create a new resolver to use the Lambda function as a data source
    api.createResolver('QueryRestApiLambdaResolver', {
      typeName: 'Query',
      fieldName: 'getWeather',
      dataSource: lambdaDataSource,
    });

    api.createResolver('QueryAlbumApiLambdaDataSource', {
      typeName: 'Query',
      fieldName: 'albums',
      dataSource: albumApiLambdaDataSource,
    });

    api.createResolver('QueryAlbumApiLambdaDataSource', {
      typeName: 'Query',
      fieldName: 'album',
      dataSource: albumApiLambdaDataSource,
    });

    // 7. Stack Outputs
    new cdk.CfnOutput(this, 'GraphQLAPI_ID', { value: api.apiId });
    new cdk.CfnOutput(this, 'GraphQLAPI_URL', { value: api.graphqlUrl });
    new cdk.CfnOutput(this, 'GraphQLAPI_KEY', { value: api.apiKey });
    new cdk.CfnOutput(this, 'STACK_REGION', { value: this.region });
  }
}

module.exports = { ApiGqlAppsyncStack };
