const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  endpoint: new AWS.Endpoint("http://localhost:8000"),
  region: "us-west-2",
  // what could you do to improve performance?
});

const tableName = "SchoolStudents";

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.schoolName
 * @param {string} event.studentId
 * @param {string} event.studentFirstName
 * @param {string} event.studentLastName
 * @param {string} event.studentGrade
 */
exports.handler = async (event) => {
  const {
    schoolId,
    schoolName,
    studentId,
    studentFirstName,
    studentLastName,
    studentGrade,
  } = event;

  // validate that all expected attributes are present (assume they are all required)
  if (
    schoolId &&
    schoolName &&
    studentId &&
    studentFirstName &&
    studentLastName &&
    studentGrade
  ) {
    // use the AWS.DynamoDB.DocumentClient to save the 'SchoolStudent' record
    dynamodb.put(
      {
        TableName: tableName,
        Item: {
          schoolId,
          schoolName,
          studentId,
          studentFirstName,
          studentLastName,
          studentGrade,
        },
      },
      (err, data) => {
        return new Promise((resolve, reject) => {
          if (data) {
            resolve(data);
          }
          reject(err);
        });
      }
    );
  }

  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
};
