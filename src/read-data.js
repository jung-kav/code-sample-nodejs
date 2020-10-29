const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  endpoint: new AWS.Endpoint("http://localhost:8000"),
  region: "us-west-2",
  // what could you do to improve performance?
});

const tableName = "SchoolStudents";
const studentLastNameGsiName = "studentLastNameGsi";

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.studentId
 * @param {string} [event.studentLastName]
 */
exports.handler = async (event) => {
  // TODO use the AWS.DynamoDB.DocumentClient to write a query against the 'SchoolStudents' table and return the results.
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
  // Initialize parameters needed to call DynamoDB
  const { schoolId, studentId } = event;
  const params = {
    TableName: tableName,
    IndexName: studentLastNameGsiName,
    KeyConditionExpression: "HashKey = :hkey and RangeKey > :rkey",
    ExpressionAttributeValues: {
      ":hkey": schoolId,
      ":rkey": studentId,
    },
  };

  const result = await dynamodb.query(params).promise();
  console.log(result);

  return JSON.stringify(result);

  // TODO (extra credit) if event.studentLastName exists then query using the 'studentLastNameGsi' GSI and return the results.

  // TODO (extra credit) limit the amount of records returned in the query to 5 and then implement the logic to return all
  //  pages of records found by the query (uncomment the test which exercises this functionality)
};
