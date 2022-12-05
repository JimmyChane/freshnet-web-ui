// tools
import AppLayout from "./tools/AppLayout.js";
import Navigation from "./tools/Navigation.js";
import Notification from "./tools/Notification.js";
import TimeNowGetter from "./tools/TimeNowGetter.js";
import ApiHost from "./host/ApiHost.js";

// vue
import Vue from "vue";
import Router from "./main.router.js";
import Stores from "./main.stores.js";
import Mixin from "./main.mixin.js";

// app
import App from "./app/App.vue";

Vue.config.productionTip = false;
Vue.prototype.host = ApiHost;
Vue.mixin(Mixin);

class U {
	static objectToArray(object = {}) {
		return Object.keys(typeof object === "object" ? object : {}).map((key) => ({
			key,
			value: object[key],
		}));
	}
	static confineRouteQuery(previousQuery, nextQuery) {
		let nextQueries = U.objectToArray(previousQuery);
		let queries = U.objectToArray(nextQuery);
		let isChanged = false;

		for (let query of queries) {
			const current = nextQueries.find((current) => current.key === query.key);

			if (current && current.value !== query.value) {
				current.value = query.value;
				isChanged = true;
			} else if (
				!current &&
				query.value !== null &&
				query.value !== undefined
			) {
				nextQueries.push({ key: query.key, value: query.value });
				isChanged = true;
			}

			if (current && current.value === null) {
				nextQueries.splice(nextQueries.indexOf(current), 1);
				isChanged = true;
			}
		}

		if (!isChanged) return;

		return nextQueries.reduce((query, newQuery) => {
			query[newQuery.key] = newQuery.value;
			return query;
		}, {});
	}

	static isObject(obj) {
		return typeof obj === "object";
	}
	static isString(str) {
		return typeof str === "string";
	}
	static isPassed(user, permissions) {
		permissions = Array.isArray(permissions) ? permissions : [];

		if (permissions.length > 0) {
			if (user.isTypeAdmin() && !permissions.includes("admin")) return false;
			if (user.isTypeStaff() && !permissions.includes("staff")) return false;
		}

		return true;
	}

	static parseIcon(icon) {
		icon = U.isObject(icon) ? icon : null;
		if (icon === null) return null;
		const light = icon === null ? "" : ApiHost.res(`icon/${icon.light}.svg`);
		const dark = icon === null ? "" : ApiHost.res(`icon/${icon.dark}.svg`);
		return { light, dark };
	}

	static parseKey(str) {
		return this.isString(str) ? str.trim().replace(" ", "") : "";
	}
	static parseArray(array) {
		return Array.isArray(array) ? array : [];
	}
	static parseObject(obj) {
		return this.isObject(obj) ? obj : {};
	}
	static parseString(str) {
		return this.isString(str) ? str : "";
	}

	static parseGroup2s(array) {
		return U.parseArray(array).map((obj) => {
			return {
				key: obj.key,
				title: obj.title,
				icon: obj.icon,
				values: obj.values,
				children: obj.children,
				userPermissions: obj.userPermissions,
			};
		});
	}
}

new Vue({
	host: ApiHost,
	router: Router,
	store: Stores.store,

	data() {
		return {
			console: {
				log(param1, param2) {
					param2 === undefined
						? console.log(param1)
						: console.log(param1, param2);
				},
				error(param1, param2) {
					param2 === undefined
						? console.error(param1)
						: console.error(param1, param2);
				},
			},
			keyGetter: new TimeNowGetter(),
			window: { innerWidth: 0, innerHeight: 0 },

			appLayout: null,
			navigation: null,
			snackbars: [],
			imageViewer: { isShowing: false, image: null, thumbnails: [] },
		};
	},
	computed: {
		user: (c) => c.loginStore.getters.user,

		// app
		app: (c) => (c.$children.length ? c.$children[0] : null),

		// pages
		pages() {
			const pages = U.parseArray(App._children());
			if (pages.length < 1) return [];

			const listGroup1 = pages.map((page) => {
				// get property
				let { key, title, icon, userPermissions } = page;
				const { _children, _groups, _queries } = page;

				// get ready
				key = U.parseKey(page.key);
				title = U.parseString(page.title).trim();
				icon = U.parseIcon(page.icon);
				const children = typeof _children === "function" ? _children() : [];
				const groups = typeof _groups === "function" ? _groups() : [];
				const queries = typeof _queries === "function" ? _queries() : [];

				// parsing
				const parsedChildren = U.parseGroup2s([{ values: children }]).map(
					(obj) => {
						obj.isLink = true;
						obj.isQuery = false;
						return obj;
					},
				);
				const parsedGroups = U.parseGroup2s(groups).map((obj) => {
					obj.isLink = true;
					obj.isQuery = false;
					return obj;
				});
				const parsedQueries = U.parseGroup2s(queries).map((obj) => {
					obj.isLink = true;
					obj.isQuery = true;
					return obj;
				});

				const returnParsedGroups = [
					...parsedChildren,
					...parsedGroups,
					...parsedQueries,
				]
					.map((group) => {
						if (!U.isPassed(this.user, group.userPermissions)) return group;

						group.key = U.parseKey(group.key);
						group.title = U.parseString(group.title);

						if (!Array.isArray(group.values)) group.values = [];
						if (Array.isArray(group.children))
							group.values.unshift(...group.children);

						return group;
					})
					.reduce((groups, group) => {
						if (!U.isPassed(this.user, group.userPermissions)) return groups;

						// get property
						let { key, title } = group;
						const { isLink, isQuery } = group;

						const views = U.parseArray(group.values)
							.map((value) => {
								if (!U.isPassed(this.user, value.userPermissions)) return null;
								const key = U.parseKey(value.key);
								const title = U.parseString(value.title);
								const icon = U.parseIcon(value.icon);
								return { key, icon, title };
							})
							.filter((view) => view !== null);

						let found = groups.find((group) => group.key === key);
						if (!found) {
							groups.push(
								(found = { key, title, isLink, isQuery, groups: [] }),
							);
						}
						found.groups.push(...views);

						return groups;
					}, []);

				return {
					key,
					title,
					icon,
					userPermissions,
					groups: returnParsedGroups,
				};
			});

			listGroup1.forEach((group1) => {
				const listGroup2 = group1.groups;
				listGroup2.forEach((group2) => {
					const listGroup3 = group2.groups;
					if (listGroup3.length === 0) {
						listGroup2.splice(listGroup2.indexOf(group2), 1);
					}
				});
			});

			return listGroup1;
		},
		paths: (c) => c.$route.path.split("/").filter((path) => path),
		currentPaths() {
			let { fullPath } = this.$route;

			let questionMarkIndex = fullPath.indexOf("?");
			if (questionMarkIndex !== -1) {
				fullPath = fullPath.substring(0, questionMarkIndex);
			}

			return fullPath.split(/[/]/).filter((path) => path);
		},
		currentPageKey() {
			let paths = this.currentPaths;
			return paths.length > 0 ? paths[0] : "";
		},
		currentViewKey() {
			let paths = this.currentPaths;
			return paths.length > 1 ? paths[1] : "";
		},

		// app layout mode
		APP_LAYOUT_MODE: (c) => ({
			NORMAL: AppLayout.Layout.NORMAL,
			FULL: AppLayout.Layout.FULL,
		}),
		appLayoutCurrentRequest: (c) => c.appLayout.getCurrentLayout(),
		appLayoutMode: (c) => c.appLayoutCurrentRequest,

		// navigation
		DRAWER_VISIBILITY: (c) => {
			return {
				NONE: Navigation.Visibility.NONE,
				EXPANDED: Navigation.Visibility.EXPANDED,
				COLLAPSED: Navigation.Visibility.COLLAPSED,
			};
		},
		DRAWER_LAYOUT: (c) => {
			return {
				WIDE: Navigation.Layout.WIDE,
				THIN: Navigation.Layout.THIN,
			};
		},
	},
	watch: {
		currentPaths() {
			this.closeNavigationDrawer();
		},
	},
	methods: {
		imageViewerShow(image = null, thumbnails = []) {
			this.imageViewer.image = image;
			this.imageViewer.thumbnails = thumbnails;
			this.imageViewer.isShowing = true;
		},
		imageViewerHide() {
			this.imageViewer.isShowing = false;
			setTimeout(() => {
				this.imageViewer.thumbnails = [];
				this.imageViewer.image = null;
			}, 300);
		},

		// app layout
		setAppLayout(layout) {
			this.appLayout.setLayout(layout);
		},

		// navigation
		openNavigationDrawer() {
			this.navigation.setVisibility(this.DRAWER_VISIBILITY.EXPANDED);
		},
		closeNavigationDrawer() {
			this.navigation.setVisibility(this.DRAWER_VISIBILITY.COLLAPSED);
		},
		setNavigationDrawerVisibiliy(visibility) {
			this.navigation.setVisibility(visibility);
		},

		// get full icon url on server localhost/res/icon/${name}.svg
		icon(name) {
			console.trace();
			console.warn("please consider using host.icon() instead");
			return this.host.res(`icon/${name}.svg`);
		},

		// send a snackbar notification
		feedback(param) {
			if (typeof param === "string") {
				param = { text: param };
			}

			this.snackbars.push(new Notification(this, param).show());

			return;
			if (this.app) this.app.showSnackbar(param);
		},

		// external interaction
		copyText(text) {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.setAttribute("readonly", "");
			textarea.style = { position: "absolute", left: "-9999px" };
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			textarea.remove();
		},
		openLink(link, target = "_blank") {
			let a = document.createElement("a");
			a.style = {
				position: "absolute",
				opacity: "0",
				"pointer-events": "none",
			};
			a.href = link;
			a.target = target;
			a.dispatchEvent(
				new MouseEvent("click", {
					view: window,
					bubbles: true,
					cancelable: false,
				}),
			);
			a.remove();
		},
		pushDownload(filename, content) {
			const element = document.createElement("a");
			element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
				content,
			)}`;
			element.download = filename;
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},
		print(element) {
			// this.printUsingNative(element);
			this.printUsingPHE(element);
		},
		printUsingNative(element) {
			const eWindow = window.open("", "PRINT", "height=400,width=600");

			eWindow.document.write("<html>");

			eWindow.document.write("<head>");
			eWindow.document.write(`<title>${document.title}</title>`);
			eWindow.document.write("</head>");

			eWindow.document.write("<body>");
			eWindow.document.write(element.innerHTML);
			eWindow.document.write("</body>");

			// console.log(element.innerHTML);

			// function dumpCSSText(element) {
			// 	let str = "";
			// 	let obj = getComputedStyle(element);
			// 	for (let i = 0; i < obj.length; i++) {
			// 		str += `${obj[i]}:${obj.getPropertyValue(obj[i])};`;
			// 	}
			// 	return str;
			// }

			// console.log(dumpCSSText(element));

			eWindow.document.write("</html>");

			eWindow.document.close(); // necessary for IE >= 10
			eWindow.focus(); // necessary for IE >= 10*/

			eWindow.print();
			eWindow.close();
		},
		printUsingPHE(element) {
			let PHE = require("print-html-element"); // https://www.npmjs.com/package/print-html-element

			// const options = {
			// 	// printMode: "iframe", // 'iframe', 'popup'
			// 	// pageTitle: "",
			// 	// templateString: "",
			// 	// popupProperties: "scrollbars=false",
			// 	// stylesheets: "" | [""],
			// 	// styles: "" | [""],
			// };

			// PHE.printElement(element, options);
			PHE.printElement(element);
		},

		// routes
		nextRoute(param = {}) {
			this.setRoute(param, true);
		},
		replaceRoute(param = {}) {
			this.setRoute(param, false);
		},
		setRoute(param = {}, isNext = true) {
			let query = U.confineRouteQuery(this.$route.query, param.query);
			if (isNext) this.$router.push({ query });
			else this.$router.replace({ query });
		},

		// window
		invalidateWindow() {
			this.window.innerWidth = window.innerWidth;
			this.window.innerHeight = window.innerHeight;
		},
	},
	created() {
		this.appLayout = new AppLayout(this);
		this.navigation = new Navigation(this);
		window.addEventListener("resize", this.invalidateWindow);

		// todo implement inheritable onBack functions
		// window.addEventListener("keyup", (event) => {
		//    console.log(event);
		// });
	},
	mounted() {
		this.invalidateWindow();
	},

	render: (createElement) => createElement(App),
}).$mount("#app");
