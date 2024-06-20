"use strict";

interface PopulateFields {
  fields?: string[];
  populate?: boolean | PopulateFields | PopulateFields[] | string[] | any;
  media?: {
    fields: string[];
  };
}

const populate: { [key: string]: PopulateFields } = {
  contentSections: {
    populate: {
      picture: {
        fields: ["url", "alternativeText", "caption", "width", "height"],
      },
      buttons: {
        populate: true,
      },
      feature: {
        populate: {
          fields: ["title", "description", "showLink", "newTab", "url", "text"],
          media: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      testimonials: {
        populate: {
          picture: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      plans: {
        populate: ["product_features"],
      },
      submitButton: {
        populate: true,
      },
    },
  },
  seo: {
    fields: ["metaTitle", "metaDescription"],
    populate: { shareImage: true },
  }
};

interface StrapiContext {
  query: {
    populate: typeof populate;
    filters?: {
      slug?: string;
    };
    locale?: string;
  };
}

export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: StrapiContext, next: () => Promise<any>) => {
    ctx.query = {
      populate,
      filters: { slug: ctx.query.filters?.slug },
      locale: ctx.query.locale,
    };

    console.log("page-populate-middleware.ts: ctx.query = ", ctx.query);

    await next();
  };
};
