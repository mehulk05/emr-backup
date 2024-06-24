// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  NEW_UI_DOMAIN: 'https://devemr.growthemr.com',
  CHAT_BOT_DOMAIN: 'https://chatbot.growthemr.com',
  SSR_DOMAIN: 'https://portal.growthemr.com',
  SSR_HOST: 'portal.growthemr.com',
  FORM_MAX_SIZE: 2097152,
  OLD_EMR_DOMAIN: 'https://devemr.growthemr.com',
  BOOKING_DOMAIN_URL: 'https://devemr.growthemr.com',
  IMPORT_EXPORT_CENTER: 'https://api.batch-upload.growthemr.com',
  HOST_NAME: 'localhost',

  SERVER_API_URL: 'https://api.growthemr.com',
  // SERVER_API_URL: 'http://localhost:8080',
  EMR_CHAT_BOT_REGION: 'us-east-1',
  CHAT_BOT_LAMBDA_URL:
    'https://o984hip783.execute-api.us-east-1.amazonaws.com/default/MyFunction',
  //STRIPE_KEY: "pk_test_TYooMQauvdEDq54NiTphI7jx",
  FACEBOOK_CONNECT_URL:
    'https://www.facebook.com/v10.0/dialog/oauth?client_id=1215709718876516&redirect_uri=https://devemr.growthemr.com/post-library/facebook/callback&scope=pages_manage_posts,pages_read_user_content,pages_show_list&response_type=token&state=channel_Facebook',
  INSTAGRAM_CONNECT_URL:
    'https://www.facebook.com/v10.0/dialog/oauth?client_id=1215709718876516&redirect_uri=https://devemr.growthemr.com/post-library/facebook/callback&scope=instagram_basic,instagram_content_publish&response_type=token&state=channel_Instagram',
  siteKey: '6LfWEkwhAAAAAN6xg27w8u0MZZg0QCR_P_9LWj-_',
  LINKEDIN_CONNECT_URL:
    'https://www.linkedin.com/oauth/v2/authorization?client_id=78dff4ml90h7wo&redirect_uri=http://localhost:4200/post-library/linkedin/callback&scope=r_liteprofile,r_emailaddress,w_member_social&response_type=code&state=123456',
  G99_REVIEW_DOMAIN: 'https://reviews.growthemr.com/',
  G99_REVIEW_MANAGER_API_URL: 'https://api.review-manager.growthemr.com',
  SERVER_AI_API_URL: 'https://api.growthemr.com',
  ONBOARDING_FORMS: [
    {
      bid: 1668,
      fid: 10415
    }
  ],
  DEFAULT_TWILIO_NUMBER: '+18647219863',
  SMILE_VIRTUAL_BUSINESS_ID: 1752,
  AESTHETIC_VIRTUAL_BUSINESS_ID: 3032
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
