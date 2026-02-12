exports.POST = async (req, res) => {
  const db = require('../../db');
  const jsonwebtoken = require('jsonwebtoken');
  const userid = req.user.id;

  if (!userid) {
    return res.status(401).json({ msg: 'user not found' });
  }

  const sql = `
    SELECT
      id,
      username,
      status,
      firstname,
      lastname,
      email,
      gender,
      mailingList,
      lang,
      subscribeduntil,
      createdAt
    FROM
      users
    WHERE
      id = ?
    LIMIT 1
    ;
  `;

  db.query(sql, [userid], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res
        .status(500)
        .json({ msg: 'unable to query for user', msgType: 'error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: 'user not found', msgType: 'error' });
    }

    const user = result[0];

    if (user.subscribeduntil === null) {
      return res.json({ msg: 'no active subscription', msgType: 'error' });
    }

    const now = new Date();
    const subscribedUntil = new Date(user.subscribeduntil);

    if (now >= subscribedUntil) {
      return res.json({ msg: 'subscription expired', msgType: 'error' });
    }

    const {
      id,
      username,
      status,
      firstname,
      lastname,
      email,
      gender,
      mailingList,
      lang,
      subscribeduntil,
      createdAt,
    } = result[0];

    const refreshToken = jsonwebtoken.sign(
      {
        id: id,
        username: username,
        status: status,
        firstname: firstname,
        lastname: lastname,
        email: email,
        gender: gender,
        mailingList: mailingList,
        lang: lang,
        subscribeduntil: subscribeduntil,
        createdAt: createdAt,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    const accessToken = jsonwebtoken.sign(
      {
        id: id,
        username: username,
        status: status,
        firstname: firstname,
        lastname: lastname,
        email: email,
        gender: gender,
        mailingList: mailingList,
        lang: lang,
        subscribeduntil: subscribeduntil,
        createdAt: createdAt,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' }
    );

    return res.json({
      msg: 'subscription active',
      refreshToken: refreshToken,
      accessToken: accessToken,
    });
  });
};
