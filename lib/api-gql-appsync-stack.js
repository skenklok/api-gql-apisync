// 1. Import dependencies
const cdk = require('aws-cdk-lib');
const appsync = require('aws-cdk-lib/aws-appsync');
const lambda = require('aws-cdk-lib/aws-lambda');

// 2. setup a static expiration date for the API KEY
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const TODAY_DATE = new Date();
TODAY_DATE.setHours(0);
TODAY_DATE.setMinutes(0);
TODAY_DATE.setSeconds(0);
TODAY_DATE.setMilliseconds(0);
const KEY_EXPIRATION_DATE = new Date(TODAY_DATE.getTime() + SEVEN_DAYS);

class ApiGqlAppsyncStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // 3. Define your AppSync API
    const api = new appsync.GraphqlApi(this, 'JourneyAPI', {
      name: 'JourneyAPI',
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
    const weatherApiLambda = new lambda.Function(this, 'WeatherApiLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda-adapters/weather'),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
    });
    
      // 4. Create a Lambda function as a data source for REST API calls
      const albumApiLambda = new lambda.Function(this, 'AlbumApiLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda-adapters/album'),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
    });
    

    // 5. Set up Lambda function as a data source and grant access
    const weatherDataSource = api.addLambdaDataSource('WeatherApiLambdaDataSource', weatherApiLambda);
    const albumLambdaDataSource = api.addLambdaDataSource('AlbumApiLambdaDataSource', albumApiLambda);

    // 6. Create a new resolver to use the Lambda function as a data source
    api.createResolver('QueryWeatherApiLambdaResolver', {
      typeName: 'Query',
      fieldName: 'getWeather',
      dataSource: weatherDataSource,
    });

    api.createResolver('QueryAlbumApiLambdaResolver', {
      typeName: 'Query',
      fieldName: 'album',
      dataSource: albumLambdaDataSource,
    });
    

    // 7. Stack Outputs
    new cdk.CfnOutput(this, 'GraphQLAPI_ID', { value: api.apiId });
    new cdk.CfnOutput(this, 'GraphQLAPI_URL', { value: api.graphqlUrl });
    new cdk.CfnOutput(this, 'GraphQLAPI_KEY', { value: api.apiKey });
    new cdk.CfnOutput(this, 'STACK_REGION', { value: this.region });
  }
}

module.exports = { ApiGqlAppsyncStack };
