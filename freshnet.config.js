// const host = "https://www.freshnet.app";
const host = 'http://192.168.1.21'

module.exports = {
  devPort: 8080,

  host,
  hostApi: `${host}/api`,
  hostRes: `${host}/resource`,

  cloudinaryRes: "https://res.cloudinary.com/freshnet/image/upload/resource",

  exportAbsolutePath: "../freshnet-express/public/page",
};
