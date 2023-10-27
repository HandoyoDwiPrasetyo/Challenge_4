const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const { PORT = 8000 } = process.env;

const PUBLIC_DIRECTORY = path.join(__dirname, "../public");

function getHtml(page) {
  const htmlFilePath = path.join(PUBLIC_DIRECTORY, `${page}.html`);
  console.log(htmlFilePath);
  return fs.readFileSync(htmlFilePath, "utf-8");
}

function getJSON(data) {
  const toJSON = JSON.stringify(data);
  return toJSON;
}

function router() {
  const routes = {
    get: () => {},
    post: () => {},
  };
  const get = (path, cb) => {
    routes.get[path] = cb;
  };
  const post = (path, cb) => {
    routes.post[path] = cb;
  };
  return {
    get,
    post,
    routes,
  };
}

const appRouter = router();

// appRouter.get("/", (req, res) => {
//   const pageContent = getHtml("index.example");
//   res.setHeader("Content-Type", "text/html");
//   res.writeHead(200);
//   res.end(pageContent);
// });

function getContent(filename) {
  const filePath = path.join(PUBLIC_DIRECTORY, filename);
  try {
    // Membaca isi berkas yang sesuai dengan nama berkas (misalnya, index.html, style.css, script.js)
    const content = fs.readFileSync(filePath);

    return content;
  } catch (error) {
    // Handle kesalahan jika berkas tidak ditemukan
    console.error(`Error reading file: ${error}`);
    return "Internal Server Error";
  }
}

const server = () => {
  return (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const { pathname } = parsedUrl;

    // console.log(pathname);

    const isCss = pathname.includes("/css");
    const isJs = pathname.includes("/script");
    const isImages = pathname.includes("/images");

    // if (req.method === "GET" && appRouter.routes.get[pathname]) {
    //   appRouter.routes.get[pathname](req, res);
    // } else if (req.method === "POST" && appRouter.routes.post[pathname]) {
    //   appRouter.routes.post[pathname](req, res);
    //   res.end(getContent(pathname));
    // } else {
    if (pathname === "/") {
      const pageContent = getHtml("index");
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(pageContent);
    } else if (pathname === "/search") {
      const pageContent = getHtml("search");
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(pageContent);
    } else if (isCss || isJs || isImages) {
      res.end(getContent(pathname));
    } else {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(404);
      res.end(getHtml("404"));
    }
    // }
  };
};

http.createServer(server()).listen(PORT, "localhost", () => {
  console.log("Server is running, open http://localhost:%d", PORT);
});
