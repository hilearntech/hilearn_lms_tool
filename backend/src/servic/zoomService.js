const axios = require('axios');

const getZoomToken = async () => {
  const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
  
  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
};


exports.createMeeting = async (topic, startTime, duration) => {
  const token = await getZoomToken();
  const response = await axios.post(
    'https://api.zoom.us/v2/users/me/meetings',
    {
      topic: topic,
      type: 2, 
      start_time: startTime,
      duration: duration,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: true,
      }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  return {
    join_url: response.data.join_url,   
    start_url: response.data.start_url, 
    meeting_id: response.data.id,
    password: response.data.password
  };
};