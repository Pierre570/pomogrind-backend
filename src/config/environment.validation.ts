import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required().default(3600),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required().default(86400),
});
