import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "/index.html", // Default entry point
        404: "/src/html/404.html", // Additional HTML file
        contact: "/src/html/contact.html", // Additional HTML file
        events: "/src/html/events.html", // Additional HTML file
        gallery: "/src/html/gallery.html", // Additional HTML file
        home: "/src/html/home.html", // Additional HTML file
        news: "/src/html/news.html", // Additional HTML file
        contact_script: "/src/ts/contact.ts", // Additional TS file
        events_script: "/src/ts/events.ts", // Additional TS file
        gallery_script: "/src/ts/gallery.ts", // Additional TS file
        home_script: "/src/ts/home.ts", // Additional TS file
        news_script: "/src/ts/news.ts", // Additional TS file
        // Add more HTML files as needed
      },
    },
  },
});
