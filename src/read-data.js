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
  const { schoolId, studentId, studentLastName } = event;
  const params = {
    TableName: tableName,
    KeyConditionExpression: "schoolId = :schoolId and studentId = :studentId",
    ExpressionAttributeValues: {
      ":schoolId": schoolId,
      ":studentId": studentId,
    },
  };

  if (studentLastName) {
    params.IndexName = studentLastNameGsiName;
    params.KeyConditionExpression = "studentLastName = :studentLastName";
    params.ExpressionAttributeValues = {
      ":studentLastName": studentLastName,
    };
  }

  return await dynamodb
    .query(params)
    .promise()
    .then((res) => (res.Items ? res.Items : []))
    .catch((err) => err);

  // TODO (extra credit) limit the amount of records returned in the query to 5 and then implement the logic to return all
  //  pages of records found by the query (uncomment the test which exercises this functionality)
};
