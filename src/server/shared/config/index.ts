/**
 * Application configuration
 */
export const config = {
  /**
   * Server configuration
   */
  server: {
    port: process.env.PORT || 3001,
  },

  /**
   * Database configuration
   */
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/thesis_grey',
  },

  /**
   * Authentication configuration
   */
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'development_jwt_secret',
    jwtExpiresIn: '1d',
  },

  /**
   * Search configuration
   */
  search: {
    serperApiKey: process.env.SERPER_API_KEY || '',
    defaultMaxResults: 100,
  },

  /**
   * Logging configuration
   */
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
