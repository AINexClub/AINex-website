interface Routes {
  [key: string]: string;
}

const routes: Routes = {
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

const route = (event: Event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", (event.target as HTMLAnchorElement).href);
  handleLocation();
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  const mainPage = document.getElementById("main-page");
  if (mainPage) {
    mainPage.innerHTML = html;
  }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
