import 'dotenv/config';

const config = {
  "appId": process.env.PARSE_SERVER_APPLICATION_ID,
  "masterKey": process.env.PARSE_SERVER_MASTER_KEY,
  "appName": process.env.PARSE_SERVER_APP_NAME,
  "databaseURI": process.env.PARSE_SERVER_DATABASE_URI,
  "serverURL": process.env.PARSE_SERVER_URL,
  "publicServerURL": process.env.PUBLIC_SERVER_URL,
  "port": process.env.PORT || 1337,
  "liveQuery": {
    "classNames": []
  },
  "masterKeyIps": ['0.0.0.0/0', '::/0'],
  "allowClientClassCreation": true, 
  "allowExpiredAuthDataToken": false,
};

export default config;
