const KJUR = require('jsrsasign');

exports.generateSignature = (req, res) => {
  try {
    const { meetingNumber, role } = req.body; // role: 0 for student, 1 for mentor
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const oPayload = {
      sdkKey: process.env.ZOOM_CLIENT_ID,
      mn: meetingNumber,
      role: role,
      iat: iat,
      exp: exp,
      appKey: process.env.ZOOM_CLIENT_ID,
      tokenExp: iat + 60 * 60 * 2
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_CLIENT_SECRET);

    res.json({ signature });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};