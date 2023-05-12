const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init(process.env.MIX_PANEL_TOKEN);

module.exports = mixpanel;  