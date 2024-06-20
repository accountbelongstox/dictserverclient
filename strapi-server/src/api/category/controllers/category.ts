

/**
 *  category controller
 */
import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

const categoryController = createCoreController('api::category.category');

export default categoryController;
