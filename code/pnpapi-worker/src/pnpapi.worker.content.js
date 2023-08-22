let hook;

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib').brotliDecompressSync(Buffer.from('GwsBIOTVWv1K2iHBCdNXQv/Q/MyAFzPbAftuk91Ndsuiv8uibpZFAWdaoEHNrRLiMw4vuhn8g7vWTk36q0G4rouak4TlCCaoT9VajtJ0BSq/+eY1gc0iyxPKs7Tq7Z+Eg/TRGNvaM2/Ldt56kCnqMB5Q6QuwrOSxTsLLGw+rGKWkJ36/monlgA+4cnRCZjaisFsLmBdvnaxPt9TPZ5ELwq0I5gHQPwM=', 'base64')).toString();

  return hook;
};
