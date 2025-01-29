import admin from 'firebase-admin'

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).send('Unauthorized')
  }

  const token = authorization.split(' ')[1]
  console.log(token, 'TOKEN HERE')
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    return next()
  } catch (error) {
    console.log(error)
    return res.status(401).send('Unauthorized')
  }
}

export default authMiddleware
