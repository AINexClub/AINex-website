import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ojepejzxawymsazrmpdm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZXBlanp4YXd5bXNhenJtcGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4MTUxMzQsImV4cCI6MjAyNzM5MTEzNH0.DqTfpHgOjeJfE7E2WH_pE2ZUlKXSVGAWyXAvpH4BtvE";

const supabase = createClient(supabaseUrl, supabaseKey);

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
        executeHomeScript();
        break;
      case "/gallery":
        executeGalleryScript();
        break;
      case "/events":
        executeEventsScript();
        break;
      case "/news":
        executeNewsScript();
        break;
      case "/contact":
        executeContactScript();
        break;
      // Add more cases for other routes and their respective scripts
      default:
        break;
    }
  }
};

const executeContactScript = async () => {
  // Add event listener to the form submission
  const contactForm = document.getElementById(
    "contact-form",
  ) as HTMLFormElement;
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      try {
        // Fetch the user's existing data based on the email
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (fetchError) {
          console.error("Error fetching user:", fetchError);
          return;
        }

        // Handle existing user or insert new data
        if (existingUser) {
          // User exists, delete their data first
          const { error: deleteError } = await supabase
            .from("users")
            .delete()
            .eq("email", email);

          if (deleteError) {
            console.error("Error deleting user:", deleteError);
            return;
          }
        }

        // Insert the new form data
        const { error: insertError } = await supabase
          .from("users")
          .insert({ name, email });

        if (insertError) {
          console.error("Error submitting form:", insertError);
        } else {
          console.log("Form submitted successfully");
          contactForm.style.display = "none"; // Hide the form
          const thanksDiv = document.createElement("div");
          thanksDiv.innerHTML = createThanksDiv();
          const mainPage = document.getElementById("contact-div");
          if (mainPage) {
            mainPage.appendChild(thanksDiv);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }

      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
    });
  }

  function createThanksDiv() {
    return `
    <div class="mt-4 bg-primary text-primary-content rounded-lg shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Thank you for your submission!</h2>
        <p>Your message has been received, and we'll get back to you shortly.</p>
      </div>
    </div>
    `;
  }
};

const executeNewsScript = async () => {
  // Add event listener to the form submission
  const newsForm = document.getElementById("news-form") as HTMLFormElement;
  if (newsForm) {
    newsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(newsForm);
      const name = formData.get("name");
      const email = formData.get("email");

      try {
        const { error } = await supabase
          .from("users")
          .upsert({ name, email }, { onConflict: "email" });

        if (error) {
          console.error("Error submitting form:", error);
        } else {
          console.log("Form submitted successfully");
          newsForm.style.display = "none"; // Hide the form
          const thanksDiv = document.createElement("div");
          thanksDiv.innerHTML = createThanksDiv();
          const mainPage = document.getElementById("news-div");
          if (mainPage) {
            mainPage.appendChild(thanksDiv);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }

      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
    });
  }

  function createThanksDiv() {
    return `
    <div class="mt-4 bg-primary text-primary-content rounded-lg shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Thank you for your submission!</h2>
        <p>We'll get back to you shortly.</p>
      </div>
    </div>
    `;
  }
};

const executeEventsScript = async () => {
  interface EventItem {
    title: string;
    description: string;
    date: string;
    location: string;
    image_url: string;
  }

  const { data: eventItems, error } = await supabase.from("events").select("*");

  if (error) {
    console.error("Error fetching events:", error);
    return;
  }

  function createEventCard({
    title,
    description,
    date,
    location,
    image_url,
  }: EventItem): string {
    return `
      <div class="card bg-base-100 shadow-xl">
        <figure>
          <img src="${image_url}" alt="Event Image" class="h-[34vh] w-[34vh]" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">${title}</h2>
          <p>${description}</p>
          <div class="card-actions">
            <div class="badge badge-primary">${date}</div>
            <div class="badge badge-accent">${location}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEventSection(): string {
    const eventCards = eventItems!.map(createEventCard).join("");

    return `
      <div class="h-[85vh] overflow-y-scroll">
        <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-10 py-16">
          <div class="container mx-auto">
            <h2 class="mb-8 text-center text-4xl font-bold text-white">Participate in our Upcoming Event</h2>
            <div class="flex justify-center">
              <label for="participate-modal" class="hover:btn-wide-active btn btn-primary btn-wide transform transition-all duration-300 ease-in-out hover:scale-105">
                <span class="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </span>
                Participate Now
              </label>
            </div>
          </div>
        </div>
  
        <div class="hero-container bg-base-200 p-10">
          <h1 class="mb-8 text-4xl font-bold">Upcoming Events</h1>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            ${eventCards}
          </div>
        </div>
      </div>
  
      <input type="checkbox" id="participate-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative" id="participate-modal-div">
          <label for="participate-modal" class="btn btn-circle btn-sm absolute right-2 top-2">✕</label>
          <h3 class="text-lg font-bold">Participation form</h3>
          <form class="card-body" id="participate-form" 
                action="https://api.web3forms.com/submit"
                method="POST"
          >
            <input
              type="hidden"
              name="access_key"
              value="274c294b-5bea-4657-9b5e-fab0051e2f83"
            />
            <input type="hidden" name="form" value="Participation-form" />
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control mt-6">
              <button class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function createThanksDiv() {
    return `
    <div class="mt-4 bg-primary text-primary-content rounded-lg shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Thank you for your submission!</h2>
        <p>We'll get back to you shortly.</p>
      </div>
    </div>
    `;
  }

  const eventsContainer = document.getElementById("events-container");
  if (eventsContainer) {
    eventsContainer.innerHTML = renderEventSection();
  }

  // Add event listener to the form submission
  const participateForm = document.getElementById(
    "participate-form",
  ) as HTMLFormElement;
  if (participateForm) {
    participateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(participateForm);
      const name = formData.get("name");
      const email = formData.get("email");

      try {
        const { error } = await supabase
          .from("users")
          .upsert({ name, email }, { onConflict: "email" });

        if (error) {
          console.error("Error submitting form:", error);
        } else {
          console.log("Form submitted successfully");
          participateForm.style.display = "none"; // Hide the form
          const thanksDiv = document.createElement("div");
          thanksDiv.innerHTML = createThanksDiv();
          const mainPage = document.getElementById("participate-modal-div");
          if (mainPage) {
            mainPage.appendChild(thanksDiv);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }

      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
    });
  }
};

const executeHomeScript = async () => {
  // members.ts
  const { data: members, error } = await supabase.from("members").select("*");

  if (error) {
    console.error("Error fetching members:", error);
    return;
  }

  function createMemberCard(member: any): string {
    return `
      <div class="card bg-base-200 shadow-xl">
        <figure>
          <img src="${member.image_url}" alt="Member" class="rounded-lg" />
        </figure>
        <div class="card-body">
          <h3 class="card-title">${member.name}</h3>
          <p>${member.position}</p>
          ${member.contact_info ? `<a class="link link-primary" href="mailto: ${member.contact_info}"> ${member.contact_info}</a>` : ""}
        </div>
      </div>
    `;
  }

  function renderMemberCards(): string {
    let memberCards = "";
    members!.forEach((member) => {
      memberCards += createMemberCard(member);
    });
    return memberCards;
  }

  const memberCardsHTML = renderMemberCards();
  const memberCardsContainer = document.getElementById(
    "member-cards-container",
  );
  if (memberCardsContainer) {
    memberCardsContainer.innerHTML = memberCardsHTML;
  }

  function createThanksDiv() {
    return `
    <div class="mt-4 bg-primary text-primary-content rounded-lg shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Thank you for your submission!</h2>
        <p>We'll get back to you shortly.</p>
      </div>
    </div>
    `;
  }

  // Add event listener to the form submission
  const homeForm = document.getElementById("home-form") as HTMLFormElement;
  if (homeForm) {
    homeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(homeForm);
      const name = formData.get("name");
      const email = formData.get("email");

      try {
        const { error } = await supabase
          .from("users")
          .upsert({ name, email }, { onConflict: "email" });

        if (error) {
          console.error("Error submitting form:", error);
        } else {
          console.log("Form submitted successfully");
          homeForm.style.display = "none"; // Hide the form
          const thanksDiv = document.createElement("div");
          thanksDiv.innerHTML = createThanksDiv();
          const mainPage = document.getElementById("home-modal-div");
          if (mainPage) {
            mainPage.appendChild(thanksDiv);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }

      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
    });
  }
};

const executeGalleryScript = async () => {
  // Define interfaces
  interface GalleryItem {
    title: string;
    description: string;
    images: string[];
  }

  // Define reusable functions
  function createHeroContent(title: string, description: string): string {
    return `
  <div class="hero h-[85vh]">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-3xl font-bold md:text-5xl">${title}</h1>
        <p class="py-6">${description}</p>
      </div>
    </div>
  </div>
`;
  }

  function createSlideNavigation(prev?: string, next?: string): string {
    return `
  <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
    ${prev || '<p class="animate-bounce text-xl text-primary"></p>'}
    ${next || '<p class="animate-bounce text-xl text-primary"></p>'}
  </div>
`;
  }

  // Fetch data from Supabase
  const { data: galleryItems, error } = await supabase
    .from("gallery")
    .select("*");

  if (error) {
    console.error("Error fetching gallery items:", error);
    return;
  }

  function createGalleryCard(galleryItem: GalleryItem): string {
    const { title, description, images } = galleryItem;

    const imageElements = images
      .map(
        (image, index) => `
<img src="${image}" class="w-full" alt="Gallery Image ${index + 1}" />
`,
      )
      .join("");

    return `
<div class="card overflow-hidden bg-base-100 shadow-xl">
  <div class="card-body p-4 md:p-6">
    <h2 class="card-title text-lg md:text-2xl">${title}</h2>
    <p class="text-sm md:text-base">${description}</p>
  </div>
  <div class="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3">
    ${imageElements}
  </div>
</div>
`;
  }

  // Define carousel items
  const carouselItems = [
    {
      id: "slide1",
      content: createHeroContent(
        "Our Gallery",
        "Explore our collection of images showcasing our products, events, and more.",
      ),
      nextSlide: createSlideNavigation(
        undefined,
        `<p class="animate-bounce text-xl text-primary">slide ❯</p>`,
      ),
    },
    ...galleryItems.map((item, index) => ({
      id: `slide${index + 2}`,
      content: `
  <div class="container mx-auto overflow-y-scroll px-2 py-4 md:px-4 md:py-8">
    ${createGalleryCard(item)}
  </div>
`,
      prevSlide: createSlideNavigation(
        `<p class="animate-bounce text-xl text-primary">❮ slide</p>`,
      ),
      nextSlide: createSlideNavigation(
        undefined,
        `<p class="animate-bounce text-xl text-primary">slide ❯</p>`,
      ),
    })),
    {
      id: `slide${galleryItems.length + 2}`,
      content: createHeroContent(
        "Thank You",
        "We appreciate your interest in our gallery. Feel free to explore more!",
      ),
      prevSlide: createSlideNavigation(
        `<p class="animate-bounce text-xl text-primary">❮ slide</p>`,
      ),
    },
  ];

  // Render carousel
  function renderCarousel(): string {
    let carouselHTML = '<div class="carousel h-[85vh] bg-base-200">';

    carouselItems.forEach(({ id, content, prevSlide, nextSlide }) => {
      carouselHTML += `
    <div id="${id}" class="carousel-item relative w-full">
      ${content}
      ${createSlideNavigation(prevSlide, nextSlide)}
    </div>
  `;
    });

    carouselHTML += "</div>";
    return carouselHTML;
  }

  // Render the carousel
  const carouselContainer = document.getElementById("carousel-container");
  if (carouselContainer) {
    carouselContainer.innerHTML = renderCarousel();
  }
};

// Declare the 'route' property on the 'window' object
declare global {
  interface Window {
    route: (event: Event) => void; // Adjust the type as needed
  }
}

// Now you can assign a value to 'window.route'

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
