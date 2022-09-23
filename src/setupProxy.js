const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://skywrangler-web-server:8080",
      changeOrigin: true,
    })
  );
};
