import { factories } from '@strapi/strapi';

const { createCoreRouter } = factories;

const leadFormSubmissionRouter = createCoreRouter('api::lead-form-submission.lead-form-submission');

export default leadFormSubmissionRouter;
