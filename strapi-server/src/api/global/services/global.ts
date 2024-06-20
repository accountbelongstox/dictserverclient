

/**
 * global service.
 */
import { factories } from '@strapi/strapi';

const { createCoreService } = factories;

const globalService = createCoreService('api::global.global');

export default globalService;
