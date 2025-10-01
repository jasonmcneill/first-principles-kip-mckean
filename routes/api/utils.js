exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const jsonwebtoken = require("jsonwebtoken");
  if (!token)
    return res
      .status(400)
      .send({ msg: "missing access token", msgType: "error" });

  jsonwebtoken.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, userdata) => {
      if (err)
        return res
          .status(403)
          .send({ msg: "invalid access token", msgType: "error", err: err });
      req.user = userdata;
      next();
    }
  );
};
