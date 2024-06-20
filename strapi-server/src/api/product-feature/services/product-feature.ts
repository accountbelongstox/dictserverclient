

import { factories } from '@strapi/strapi';

const {createCoreService} = factories

const productFeatureService = createCoreService('api::product-feature.product-feature');

export default productFeatureService;
