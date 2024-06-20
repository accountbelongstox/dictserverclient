

/**
 * category router.
 */
import { factories } from '@strapi/strapi';

const { createCoreRouter } = factories;

const categoryRouter = createCoreRouter('api::category.category');

export default categoryRouter;
