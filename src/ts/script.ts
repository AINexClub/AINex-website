// Imports
import { createClient } from "@supabase/supabase-js";
import { executeContactScript } from "./contact";
import { executeNewsScript } from "./news";
import { executeEventsScript } from "./events";
import { executeHomeScript } from "./home";
import { executeGalleryScript } from "./gallery";

// Supabase configuration
const supabaseUrl = "https://ojepejzxawymsazrmpdm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZXBlanp4YXd5bXNhenJtcGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4MTUxMzQsImV4cCI6MjAyNzM5MTEzNH0.DqTfpHgOjeJfE7E2WH_pE2ZUlKXSVGAWyXAvpH4BtvE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes configuration
interface Routes {
  [key: string]: string;
}

const routes: Routes = {
  404: "/src/html/404.html",
  "/": "/src/html/home.html",
  "/events": "/src/html/events.html",
  "/gallery": "/src/html/gallery.html",
  "/contact": "/src/html/contact.html",
  "/news": "/src/html/news.html",
};

// Route handling
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

    // Execute scripts based on the current route
    switch (path) {
      case "/":
        executeHomeScript(supabase);
        break;
      case "/gallery":
        executeGalleryScript(supabase);
        break;
      case "/events":
        executeEventsScript(supabase);
        break;
      case "/news":
        executeNewsScript(supabase);
        break;
      case "/contact":
        executeContactScript(supabase);
        break;
      // Add more cases for other routes and their respective scripts
      default:
        break;
    }
  }
};

// Declare the 'route' property on the 'window' object
declare global {
  interface Window {
    route: (event: Event) => void;
  }
}

// Assign values to 'window.route' and 'window.onpopstate'
window.onpopstate = handleLocation;
window.route = route;

// Initial route handling
handleLocation();
