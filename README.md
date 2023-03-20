
# GraphQL AppSync with Lambda Data Sources 

This repository provides an example of how to build an AWS AppSync API with Lambda data sources using the AWS CDK.

## Architecture

The architecture of this example is based on the following components:

AWS AppSync API: This is the GraphQL API that we will be building using the AWS AppSync service.
AWS Lambda functions: These are the data sources for the AppSync API. We have two Lambda functions in this example:
weather: This function returns the weather for a specified location by making a REST API call to a weather service.
album: This function returns a list of albums for a specified artist by making a REST API call to the iTunes API.
AWS CDK: This is the infrastructure as code tool we use to deploy our architecture. We use CDK to define the API, the Lambda functions, and the necessary permissions and mappings between them.

The following diagram shows the high-level architecture of this example:

```yaml
      ┌─────────────┐
      │   AppSync   │
      │     API     │
      └──────┬──────┘
             │
    ┌────────┴─────────┐
    │ AWS Lambda:      │
    │  - weather       │
    │  - album         │
    └────────┬─────────┘
             │
    ┌────────┴─────────┐
    │   REST APIs:     │
    │ - Weather API    │
    │ - iTunes API     │
    └──────────────────┘
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) version 14 or later
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) version 2.0 or later
- [AWS CLI](https://aws.amazon.com/cli/) version 2 or later

### Installation

1. Clone the repository:

git clone https://github.com/your-github-username/your-repo-name.git


2. Navigate to the project directory:

cd your-repo-name


3. Install the dependencies:

npm install


### Deployment

1. Configure your AWS CLI by running:

aws configure

This command will prompt you to enter your AWS access key ID, secret access key, default region, and output format.

2. Deploy the project using AWS CDK:

cdk bootstrap # Only required once per account and region
cdk deploy

After the deployment is complete, you will see the outputs of the stack in your terminal, including the GraphQL API endpoint, API key, and other useful information.

### Testing

You can test the GraphQL API using a tool like [Postman](https://www.postman.com/downloads/) or [GraphQL Playground](https://github.com/graphql/graphql-playground).

1. In the testing tool, create a new POST request with the following headers:

Content-Type: application/json
x-api-key: Your_ApiGqlAppsyncStack_GraphQLAPI_KEY


2. Set the request URL to `ApiGqlAppsyncStack.GraphQLAPI_URL`.

3. To test the API, you can use the AWS AppSync console or a GraphQL client like GraphiQL or Apollo Studio. You will need to provide the API key in the x-api-key header for authentication.

Here are some example queries you can run:

```graphql
query {
  getWeather(location: "Seattle") {
    temperature
    description
  }
}

query {
  album(artist: "Metallica") {
    id
    name
    artist
    artworkUrl
    releaseDate
  }
}
```

4. Send the request. The response will contain the weather data for the specified city.

## License

This project is licensed under the MIT License - see the LICENSE file for details.