export default {
	development: {
		port: 80,
		host: "127.0.0.1",
	},
	production: {
		port: 80,

		originApi: "www.freshnet.app/api",
		originRes: "www.freshnet.app/resource",
		cloudinary: "https://res.cloudinary.com/freshnet/image/upload", // not sure
		cloudinaryRes: "https://res.cloudinary.com/freshnet/image/upload/resource",
	},
	export: {
		absolutePath: "../express/public/page", // not sure
	},
};
