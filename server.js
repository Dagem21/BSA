const { parse } = require("url");
const next = require("next");
const { createServer } = require("http");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
    });
});
