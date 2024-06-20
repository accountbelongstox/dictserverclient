import { factories } from '@strapi/strapi';

const { createCoreService } = factories;

const leadFormSubmissionService = createCoreService('api::lead-form-submission.lead-form-submission');

export default leadFormSubmissionService;
