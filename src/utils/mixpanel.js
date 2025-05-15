// src/utils/mixpanel.js
import mixpanel from 'mixpanel-browser';

const TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN; 

mixpanel.init(TOKEN, {
  debug: process.env.NODE_ENV === 'development'
});

// Optionally register your sessionId once:
const sessionId = localStorage.getItem('sessionId');
if (sessionId) {
  mixpanel.register({ sessionId });
}

export default mixpanel;
