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
  const query = {
    TableName: tableName,
    Limit: 5,
  };

  const getAllItems = async (params, items = []) => {
    const { LastEvaluatedKey, Items } = await dynamodb.query(params).promise();

    if (Items) {
      items.push(...Items);
    }

    if (!LastEvaluatedKey) {
      return items;
    }

    return getAllItems(
      { ...params, ExclusiveStartKey: LastEvaluatedKey },
      items
    );
  };

  if (studentLastName) {
    query.IndexName = studentLastNameGsiName;
    query.KeyConditionExpression = "studentLastName = :studentLastName";
    query.ExpressionAttributeValues = {
      ":studentLastName": studentLastName,
    };

    return getAllItems(query);
  }

  query.KeyConditionExpression = [
    ...(schoolId ? ["schoolId = :schoolId"] : []),
    ...(studentId ? ["studentId = :studentId"] : []),
  ].join(" and ");

  query.ExpressionAttributeValues = {
    ...(schoolId && { ":schoolId": schoolId }),
    ...(studentId && { ":studentId": studentId }),
  };

  return getAllItems(query);
};
