const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('baerer ')){
      req.token = authorization.substring(7)
      next()
    } else {
      res.status(401).json({ error: "invalid token" })
    }
  }

  module.exports = tokenExtractor