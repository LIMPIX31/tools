let hook;

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib').brotliDecompressSync(Buffer.from('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', 'base64')).toString();

  return hook;
};
