

/**
 * category service.
 */

import { factories } from '@strapi/strapi';

const { createCoreService } = factories;

const categoryService = createCoreService('api::category.category');

export default categoryService;
