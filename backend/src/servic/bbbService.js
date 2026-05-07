const crypto = require('crypto');

const BBB_URL = () => {
  const url = (process.env.BBB_URL || '').replace(/\/+$/, '');
  if (!url) {
    console.error('⚠️ BBB_URL is not set in .env');
  }
  return url;
};

const BBB_SECRET = () => {
  const secret = process.env.BBB_SECRET || '';
  if (!secret) {
    console.error('⚠️ BBB_SECRET is not set in .env');
  }
  return secret;
};

/**
 * Generate SHA-256 checksum for BBB API calls
 */
const generateChecksum = (apiCall, queryString) => {
  const data = apiCall + queryString + BBB_SECRET();
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Build query string from params object
 */
const buildQueryString = (params) => {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
};

/**
 * Create a BBB meeting
 */
exports.createMeeting = async (meetingID, meetingName, options = {}) => {
  const attendeePW = options.attendeePW || crypto.randomBytes(4).toString('hex');
  const moderatorPW = options.moderatorPW || crypto.randomBytes(4).toString('hex');

  const params = {
    meetingID,
    name: meetingName,
    attendeePW,
    moderatorPW,
    welcome: `Welcome to ${meetingName}`,
    record: options.record || 'false',
    autoStartRecording: 'false',
    allowStartStopRecording: 'true',
    muteOnStart: 'true',
  };

  const queryString = buildQueryString(params);
  const checksum = generateChecksum('create', queryString);
  const createUrl = `${BBB_URL()}/api/create?${queryString}&checksum=${checksum}`;

  console.log('📡 BBB Create URL:', createUrl.replace(BBB_SECRET(), '***'));

  try {
    const response = await fetch(createUrl);
    
    if (!response.ok) {
      console.error(`❌ BBB HTTP Error: ${response.status} ${response.statusText}`);
      throw new Error(`BBB server returned ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    console.log('📩 BBB Response:', text.substring(0, 500));

    // Check for errors in the XML response
    if (text.includes('<returncode>FAILED</returncode>')) {
      const msgMatch = text.match(/<message>(.*?)<\/message>/);
      throw new Error(msgMatch ? msgMatch[1] : 'BBB meeting creation failed');
    }

    // Build join URLs
    const moderator_url = getJoinUrl(meetingID, 'Moderator', moderatorPW);
    const join_url = getJoinUrl(meetingID, 'Student', attendeePW);

    return {
      meetingID,
      attendeePW,
      moderatorPW,
      moderator_url,
      join_url,
    };
  } catch (error) {
    console.error('❌ BBB Create Meeting Error:', error.message);
    throw error;
  }
};

/**
 * Generate a BBB join URL for a given user
 */
const getJoinUrl = (meetingID, fullName, password) => {
  const params = {
    meetingID,
    fullName,
    password,
    redirect: 'true',
  };

  const queryString = buildQueryString(params);
  const checksum = generateChecksum('join', queryString);
  return `${BBB_URL()}/api/join?${queryString}&checksum=${checksum}`;
};

exports.getJoinUrl = getJoinUrl;
