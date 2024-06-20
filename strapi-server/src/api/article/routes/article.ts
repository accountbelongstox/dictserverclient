

/**
 * article router.
 */

import { factories } from '@strapi/strapi';

const { createCoreRouter } = factories;

const articleRouter = createCoreRouter('api::article.article');

export default articleRouter;
