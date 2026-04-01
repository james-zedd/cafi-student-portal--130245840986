const xss = require('xss');

const options = {
    whiteList: {
        a: ['href', 'title', 'target'],
        b: [], i: [], em: [], strong: [],
        p: [], br: [], ul: [], ol: [], li: [],
        h1: [], h2: [], h3: [], h4: [],
        blockquote: []
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style']
};

module.exports = (fields) => (req, res, next) => {
    fields.forEach(field => {
        if (req.body[field]) req.body[field] = xss(req.body[field], options);
    });
    next();
};
