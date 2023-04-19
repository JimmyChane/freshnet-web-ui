// tools
import AppLayout from "./tools/AppLayout.js";
import Navigation from "./tools/Navigation.js";
import HostApi from "./host/HostApi.js";
import U from "@/U";
import HostIcon from "@/host/HostIcon";

// vue
import Vue from "vue";
import Router from "./main.router.js";
import Stores from "./main.stores.js";
import Mixin from "./main.mixin.js";

// app
import App from "./app/App.vue";

Vue.config.productionTip = false;
Vue.prototype.host = HostApi;
Vue.mixin(Mixin);

const objectToArray = (object = {}) => {
   return Object.keys(typeof object === "object" ? object : {}).map((key) => ({
      key,
      value: object[key],
   }));
};
const isPassed = (user, permissions) => {
   permissions = Array.isArray(permissions) ? permissions : [];

   if (permissions.length > 0) {
      if (user.isTypeAdmin() && !permissions.includes("admin")) return false;
      if (user.isTypeStaff() && !permissions.includes("staff")) return false;
   }

   return true;
};
const parseIcon = (icon) => {
   if (!U.isObjectOnly(icon)) return null;

   const light =
      icon.light instanceof HostIcon
         ? icon.light.toUrl()
         : HostApi.icon(icon.light);
   const dark =
      icon.dark instanceof HostIcon
         ? icon.dark.toUrl()
         : HostApi.icon(icon.dark);

   return { light, dark };
};
const parseKey = (str) => U.optString(str).trim().replace(" ", "");
const parseGroup2s = (array) => {
   return U.optArray(array).map((obj) => {
      return {
         key: obj.key,
         title: obj.title,
         icon: obj.icon,
         values: obj.values,
         children: obj.children,
         userPermissions: obj.userPermissions,
      };
   });
};

class RouteQuery {
   static isValidKey(key) {
      return U.isString(key) && !key.includes(" ");
   }
   static isValidValue(value) {
      return value !== null && value !== undefined && value !== "";
   }
   static replace(currentQuery, pendingQuery) {
      const nextQueries = objectToArray(currentQuery);
      const pendingQueries = objectToArray(pendingQuery);
      let isChanged = false;

      for (const pendingQuery of pendingQueries) {
         if (!U.isObjectOnly(pendingQuery)) continue;

         const { key, value } = pendingQuery;
         if (!this.isValidKey(key)) continue;

         const nextQuery = nextQueries.find((nextQuery) => {
            return nextQuery.key === key;
         });

         if (!U.isObjectOnly(nextQuery)) {
            nextQueries.push({ key, value });
            isChanged = true;
            continue;
         }

         if (nextQuery.value !== pendingQuery.value) {
            nextQuery.value = pendingQuery.value;
            isChanged = true;
            continue;
         }

         if (!this.isValidValue(nextQuery.value)) {
            nextQueries.splice(nextQueries.indexOf(nextQuery), 1);
            isChanged = true;
            continue;
         }
      }

      if (!isChanged) return;

      return nextQueries
         .filter((nextQuery) => {
            return (
               this.isValidKey(nextQuery.key) &&
               this.isValidValue(nextQuery.value)
            );
         })
         .reduce((query, nextQuery) => {
            query[nextQuery.key] = nextQuery.value;
            return query;
         }, {});
   }
}

new Vue({
   host: HostApi,
   router: Router,
   store: Stores.store,

   data: (c) => ({
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
      window: { innerWidth: 0, innerHeight: 0 },

      appLayout: null,
      navigation: null,
   }),
   computed: {
      user: (c) => c.loginStore.getters.user,

      // app
      app: (c) => (c.$children.length ? c.$children[0] : null),

      // pages
      pages() {
         const pages = U.optArray(App._children());
         if (pages.length < 1) return [];

         const listGroup1 = pages.map((page) => {
            // get property
            let { key, title, icon, userPermissions } = page;
            const { _children, _groups, _queries } = page;

            // get ready
            key = parseKey(page.key);
            title = U.optString(page.title).trim();
            icon = parseIcon(page.icon);
            const children = U.isFunction(_children) ? _children() : [];
            const groups = U.isFunction(_groups) ? _groups() : [];
            const queries = U.isFunction(_queries) ? _queries() : [];

            // parsing
            const parsedChildren = parseGroup2s([{ values: children }]).map(
               (obj) => {
                  obj.isLink = true;
                  obj.isQuery = false;
                  return obj;
               },
            );
            const parsedGroups = parseGroup2s(groups).map((obj) => {
               obj.isLink = true;
               obj.isQuery = false;
               return obj;
            });
            const parsedQueries = parseGroup2s(queries).map((obj) => {
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
                  if (!isPassed(this.user, group.userPermissions)) return group;

                  group.key = parseKey(group.key);
                  group.title = U.optString(group.title);
                  group.values = U.optArray(group.values);
                  if (Array.isArray(group.children)) {
                     group.values.unshift(...group.children);
                  }

                  return group;
               })
               .reduce((groups, group) => {
                  if (!isPassed(this.user, group.userPermissions)) {
                     return groups;
                  }

                  // get property
                  let { key, title } = group;
                  const { isLink, isQuery } = group;

                  const views = U.optArray(group.values)
                     .map((value) => {
                        if (!isPassed(this.user, value.userPermissions)) {
                           return null;
                        }
                        const key = parseKey(value.key);
                        const title = U.optString(value.title);
                        const icon = parseIcon(value.icon);
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
   },
   watch: {
      currentPaths() {
         this.navigation.closeNavigationDrawer();
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
      // window.onhashchange = () => {
      // 	console.log("onhashchange");
      // };
      // window.addEventListener(
      // 	"popstate",
      // 	(event) => {
      // 		console.log("popstate", event);

      // 		if (this.onBackPressed()) {
      // 			// history.go(1);

      // 			// return false;

      // 			// history.pushState(null, document.title, location.href);

      // 			event.preventDefault = true;
      // 		} else {
      // 			// history.back();
      // 		}

      // 		// if (!this.onBackPressed()) history.back();
      // 		// else history.go(1);
      // 	},
      // 	false,
      // );
      // window.onpopstate = (event) => {
      // 	console.log("onpopstate", event);

      // 	return;

      // 	// "event" object seems to contain value only when the back button is clicked
      // 	// and if the pop state event fires due to clicks on a button
      // 	// or a link it comes up as "undefined"

      // 	if (event) {
      // 		// Code to handle back button or prevent from navigation
      // 	} else {
      // 		// Continue user action through link or button
      // 	}
      // };
   },
   mounted() {
      this.invalidateWindow();
   },
   methods: {
      onBackPressed() {
         return true;
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
      nextQuery(param = {}) {
         this.setQuery(param, true);
      },
      replaceQuery(param = {}) {
         this.setQuery(param, false);
      },
      setQuery(param = {}, isNext = true) {
         const query = RouteQuery.replace(this.$route.query, param.query);

         if (!query) return;

         if (isNext) {
            this.$router.push({ query });
         } else {
            this.$router.replace({ query });
         }
      },

      // window
      invalidateWindow() {
         this.window.innerWidth = window.innerWidth;
         this.window.innerHeight = window.innerHeight;
      },
   },

   render: (createElement) => createElement(App),
}).$mount("#app");
