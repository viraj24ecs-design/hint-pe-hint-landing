export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  return res.status(200).json({
    message: 'API is working!',
    hasMongoURI: !!process.env.MONGODB_URI,
    hasJWTSecret: !!process.env.JWT_SECRET,
    mongoURILength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    nodeVersion: process.version
  });
};
