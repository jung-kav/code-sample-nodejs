const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  endpoint: new AWS.Endpoint("http://localhost:8000"),
  region: "us-west-2",
  // what could you do to improve performance?
});

const TableName = "SchoolStudents";

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

  const Item = {
    schoolId,
    schoolName,
    studentId,
    studentFirstName,
    studentLastName,
    studentGrade,
  };

  const allAttributesPresent = Object.keys(Item).every((key) => Item[key]);

  if (allAttributesPresent) {
    return dynamodb.put({ TableName, Item }).promise();
  }

  return new Promise((_, reject) => reject());
};
