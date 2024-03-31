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
        // Add more HTML files as needed
      },
    },
  },
});
