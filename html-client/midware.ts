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
    "settings", {
        parser: {
            enabled: true,
            multipart: true,
            formLimit: '10mb', // modify here limit of the form body
            jsonLimit: '10mb', // modify here limit of the JSON body
            textLimit: '10mb', // modify here limit of the text body
            formidable: {
                maxFileSize: 100 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
            }
        }
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
]