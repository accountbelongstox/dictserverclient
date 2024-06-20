

/**
 * global router.
 */
import { factories } from '@strapi/strapi';

const { createCoreRouter } = factories;

const globalRouter = createCoreRouter('api::global.global');

export default globalRouter;
