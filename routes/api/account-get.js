exports.POST = async (req, res) => {
  const db = require('../../db');
  const jsonwebtoken = require('jsonwebtoken');

  const sql = `
    SELECT
      username, status, firstname, lastname, email, gender, mailingList, paypalSubscriptionDetails
    FROM
      users
    WHERE
      id = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [req.user.id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send({
        msg: 'unable to query for user',
        msgType: 'error',
      });
    }

    if (!result.length) {
      return res.status(404).send({
        msg: 'user not found',
        msgType: 'error',
      });
    }

    if (
      result[0].paypalSubscriptionDetails &&
      result[0].paypalSubscriptionDetails.length
    ) {
      result[0].paypalSubscriptionDetails = JSON.parse(
        paypalSubscriptionDetails
      );
    }

    return res.status(200).send({
      msg: 'account info retrieved',
      msgType: 'success',
      acctInfo: result[0],
    });
  });
};
