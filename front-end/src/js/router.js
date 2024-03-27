"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const routes = {
    404: "/front-end/src/html/pages/404.html",
    "/": "/front-end/src/html/pages/home.html",
    "/about": "/front-end/src/html/pages/about.html",
    "/members": "/front-end/src/html/pages/members.html",
    "/events": "/front-end/src/html/pages/events.html",
    "/gallery": "/front-end/src/html/pages/gallery.html",
    "/contact": "/front-end/src/html/pages/contact.html",
    "/news": "/front-end/src/html/pages/news.html",
    "/login": "/front-end/src/html/pages/login.html",
};
const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};
const handleLocation = () => __awaiter(void 0, void 0, void 0, function* () {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = yield fetch(route).then((data) => data.text());
    const mainPage = document.getElementById("main-page");
    if (mainPage) {
        mainPage.innerHTML = html;
    }
});
window.onpopstate = handleLocation;
window.route = route;
handleLocation();
