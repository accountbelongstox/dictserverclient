


import { factories } from '@strapi/strapi';
const {createCoreRouter} = factories

const productFeatureRouter = createCoreRouter('api::product-feature.product-feature');

export default productFeatureRouter;
