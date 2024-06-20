

/**
 * article service.
 */

import { factories } from '@strapi/strapi';

const { createCoreService } = factories;

const articleService = createCoreService('api::article.article');

export default articleService;
