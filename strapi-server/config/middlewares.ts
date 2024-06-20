module.exports = ({ env }) => [
    "strapi::errors",
    {
        name: "strapi::security",
        config: {
            contentSecurityPolicy: {
                directives: {
                    // 'connect-src': ["'self'", 'https:'],
                    // 'img-src': ["'self'", 'data:', 'blob:', 'embed.api.video', 'cdn.api.video/vod/'],
                    // 'frame-src': ["'self'", 'data:', 'blob:', 'embed.api.video'],
                    upgradeInsecureRequests: null,
                    "frame-src": ["http://localhost:*", "self", "sandbox.embed.apollographql.com"],
                },
            },
        },
    },
    {
        name: 'strapi::body',
        config: {
            formlimit: "256mb", // modify form body
            jsonlimit: "256mb", // modify json body
            textlimit: "256mb", // modify text body
            formidable: {
                maxfilesize: 200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
            },
        },
    },
    {
        name: 'strapi::query',
        config: {
            arrayLimit: 10000000,
            depth: 1000,
        },
    },
    //   'strapi::cors',
    {
        name: 'strapi::cors',
        config: {
            origin: ['*']
        },
    },
    'strapi::poweredBy',
    'strapi::logger',
    //'strapi::query',
    //'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
]