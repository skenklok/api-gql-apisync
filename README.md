# GraphQL API layer using AWS AppSync and Lambda adapters

This repository contains a serverless GraphQL API built with AWS CDK, AppSync, and Lambda. The API allows you to fetch weather data for a specific city.

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

npx cdk deploy


After the deployment is complete, you will see the GraphQL API URL and API key in the output.

### Testing

You can test the GraphQL API using a tool like [Postman](https://www.postman.com/downloads/) or [GraphQL Playground](https://github.com/graphql/graphql-playground).

1. In the testing tool, create a new POST request with the following headers:

Content-Type: application/json
x-api-key: Your_ApiGqlAppsyncStack_GraphQLAPI_KEY


2. Set the request URL to `ApiGqlAppsyncStack.GraphQLAPI_URL`.

3. In the request body, add a GraphQL query. For example, to get the weather for "New York":

```json
{
  "query": "query { getWeather(city: \"New York\") { city temperature condition description }}"
}
```

4. Send the request. The response will contain the weather data for the specified city.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Replace `your-github-username` and `your-repo-name` with your actual GitHub username and repository name.
