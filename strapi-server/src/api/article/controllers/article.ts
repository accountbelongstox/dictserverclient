

/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

const articleController = createCoreController('api::article.article');

export default articleController;
