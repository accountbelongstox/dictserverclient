

/**
 *  lead-form-submission controller
 */

import { factories } from '@strapi/strapi';

const { createCoreController } = factories;

const leadFormSubmissionController = createCoreController('api::lead-form-submission.lead-form-submission');

export default leadFormSubmissionController;
