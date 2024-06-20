

/**
 * author service.
 */
import { factories } from '@strapi/strapi';

const { createCoreService } = factories;

const authorService = createCoreService('api::author.author');

export default authorService;
