require( 'dotenv' ).config()
const env = process.env;

const config = {
  db: { 
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  }
};

const configFVH = {
  db: { 
    host: env.DB_HOST_FVH,
    port: env.DB_PORT_FVH,
    user: env.DB_USER_FVH,
    password: env.DB_PASSWORD_FVH,
    database: env.DB_NAME_FVH
  }
};

module.exports = {
  config,
  configFVH
}