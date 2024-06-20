

/**
 *  author controller
 */
import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

const authorController = createCoreController('api::author.author');

export default authorController;
