export const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dialect: process.env.MYSQL_DIALECT,
  // charset: process.env.MYSQL_CHARSET,
  // decimalNumbers: true,
  // multipleStatements: true,
}