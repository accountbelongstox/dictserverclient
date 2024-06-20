

/**
 * author router.
 */

import { factories } from '@strapi/strapi';

const { createCoreRouter } = factories;

const authorRouter = createCoreRouter('api::author.author');

export default authorRouter;
