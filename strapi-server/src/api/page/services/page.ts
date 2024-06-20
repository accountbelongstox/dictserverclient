

/**
 * page service.
 */

import { factories } from '@strapi/strapi';
const {createCoreService} = factories
const pageService = createCoreService('api::page.page');

export default pageService;