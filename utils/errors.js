// const { SOME_ERROR_CODE } = require("../utils/errors");
// const {
//   NOT_FOUND_ERROR_CODE,
//   BAD_REQUEST_STATUS_CODE,
// } = require("../utils/errors");

// const createUser = (req, res) => {
//   User.create(...)    // arguments omitted
//     .then(...)        // handle successful request
//     .catch((err) => {
//       console.error(err);
//       if (err.name === 'SomeErrorName') {
//         return res.status(SOME_ERROR_CODE).send({ message: "Appropriate error message" })
//       } else {
//         // if no errors match, return a response with status code 500
//       }
//     });
// }

const NOT_FOUND_ERROR_CODE = 404;
const BAD_REQUEST_STATUS_CODE = 400;
const SERVER_ERROR_STATUS_CODE = 500;

module.exports = {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_STATUS_CODE,
};
