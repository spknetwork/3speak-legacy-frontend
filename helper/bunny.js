const crypto = require('crypto');
const securityKey = BUNNY_CDN_SECURITY_KEY;

function generateSignature(path, duration) {

  const expires = Math.round(Date.now() / 1000) + duration * 2;

  const hashableBase = securityKey + path + expires;

  const md5String = crypto.createHash("md5").update(hashableBase).digest("binary");
  const token = (new Buffer(md5String, 'binary').toString('base64')).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
  return {
    token,
    expires
  };
}


module.exports = {
  generateSignature
}
