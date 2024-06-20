

/**
 *  page controller
 */
import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

const pageController = createCoreController('api::page.page');

export default pageController;
