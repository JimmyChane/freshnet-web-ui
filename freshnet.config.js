// const host = "http://127.0.0.1";
const host = "https://www.freshnet.app";

module.exports = {
  devPort: 8080,

  host,
  hostApi: `${host}/api`,
  hostRes: `${host}/resource`,

  cloudinaryRes: "https://res.cloudinary.com/freshnet/image/upload/resource",

  exportAbsolutePath: "../freshnet-express/public/page",
};
