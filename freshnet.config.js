const host = "https://api.freshnet.app";
// const host = "http://localhost";

module.exports = {
   devPort: 8080,

   host,
   hostApi: `${host}`,
   hostRes: `${host}/res`,

   cloudinaryRes: "https://res.cloudinary.com/freshnet/image/upload/resource",

   exportAbsolutePath: "../freshnet-express/public/page",
};
