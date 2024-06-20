

/**
 * page router.
 */

import { factories } from '@strapi/strapi';
const { createCoreRouter } = factories;

const router = createCoreRouter('api::page.page', {
  config: {
    find: {
      middlewares: ["api::page.page-populate-middleware"]
    },
    findOne: {
      middlewares: ["api::page.page-populate-middleware"]
    },
  }
});

export default router;
