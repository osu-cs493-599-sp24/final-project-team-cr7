const jwt = require("jsonwebtoken")

const secretKey = "SuperSecret"

exports.generateAuthToken = function (userId) {
  const payload = {}
  return jwt.sign(payload, secretKey, { expiresIn: "24h" })
}

exports.requireAuthentication = function (req, res, next) {
  const authHeader = req.get("Authorization") || ""
  const authHeaderParts = authHeader.split(" ")
  const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null

  try {
    const payload = jwt.verify(token, secretKey)
    req.user = payload
    next()
  } catch (e) {
    res.status(401).send({
      error: "Valid authentication token required"
    })
  }
}

exports.verifyAuthentication = function (req, res, next) {
  const authHeader = req.get("Authorization") || ""
  const authHeaderParts = authHeader.split(" ")
  const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null

  try {
      const payload = jwt.verify(token, secretKey)
      req.user = payload
      return true
  } catch (e) {
      return false
  }
}

exports.getUserById = async function (id, includePassword = false) {
  try {
    const options = includePassword ? {} : { attributes: { exclude: ['password'] } };
    const user = await User.findByPk(id, options);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

exports.validateCredentials = async function (id, password) {
  try {
    // Fetch the user by ID
    const user = await exports.getUserById(id, true);
    console.log('User:', user); // Log the user object
    
    // Compare the provided password with the hashed password
    if (!user) {
      console.log('User not found');
      return false;
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    console.log('Password match:', passwordMatch); // Log the result of password comparison
    
    return passwordMatch;
  } catch (error) {
    console.error("Error validating credentials:", error);
    throw error;
  }
};