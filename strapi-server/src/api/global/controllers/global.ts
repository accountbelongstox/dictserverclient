

/**
 *  global controller
 */

import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

const globalController = createCoreController('api::global.global');

export default globalController;
