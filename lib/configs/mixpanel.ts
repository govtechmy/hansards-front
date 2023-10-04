export default {
  name: "instance",
  id: process.env.MIXPANEL_PROJECT_ID,
  token: process.env.MIXPANEL_TOKEN,
  host: process.env.APP_URL.concat("/mp"),
  user: process.env.MIXPANEL_SA_USER,
  secret: process.env.MIXPANEL_SA_SECRET,
} as const;
