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
      // Add more cases for other routes and their respective scripts
      default:
        break;
    }
  }
};

const executeEventsScript = async () => {
  interface EventItem {
    title: string;
    description: string;
    date: string;
    location: string;
    imageSrc: string;
  }

  // const eventItems: EventItem[] = [
  //   {
  //     title: "Event Name",
  //     description: "Event description goes here.",
  //     date: "Date",
  //     location: "Location",
  //     imageSrc: "/src/images/Collaborate.png",
  //   },
  //   {
  //     title: "Event Name",
  //     description: "Event description goes here.",
  //     date: "Date",
  //     location: "Location",
  //     imageSrc: "/src/images/Explore.png",
  //   },
  //   {
  //     title: "Event Name",
  //     description: "Event description goes here.",
  //     date: "Date",
  //     location: "Location",
  //     imageSrc: "/src/images/Guest-speakers.png",
  //   },
  // ];

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
    const eventCards = eventItems.map(createEventCard).join("");

    return `
      <div class="h-[85vh] snap-y snap-mandatory overflow-y-scroll">
        <div class="snap-start bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-10 py-16">
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
  
        <div class="hero-container snap-start bg-base-200 p-10">
          <h1 class="mb-8 text-4xl font-bold">Upcoming Events</h1>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            ${eventCards}
          </div>
        </div>
      </div>
  
      <input type="checkbox" id="participate-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative">
          <label for="participate-modal" class="btn btn-circle btn-sm absolute right-2 top-2">✕</label>
          <h3 class="text-lg font-bold">Enter your email to participate</h3>
          <form class="modal-action">
            <input type="email" placeholder="Your email" class="input input-bordered w-full" />
            <button class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    `;
  }

  const eventsContainer = document.getElementById("events-container");
  if (eventsContainer) {
    eventsContainer.innerHTML = renderEventSection();
  }
};

const executeHomeScript = async () => {
  // members.ts
  interface Member {
    name: string;
    position: string;
    imageSrc: string;
  }

  // const members: Member[] = [
  //   {
  //     name: "John Doe",
  //     position: "President",
  //     imageSrc: "/src/images/Explore.png",
  //   },
  //   {
  //     name: "Jane Smith",
  //     position: "Vice President",
  //     imageSrc: "/src/images/Explore.png",
  //   },
  //   // Add more member data objects as needed
  // ];

  const { data: members, error } = await supabase.from("members").select("*");

  if (error) {
    console.error("Error fetching members:", error);
    return;
  }

  function createMemberCard(member: Member): string {
    return `
      <div class="card bg-base-200 shadow-xl">
        <figure>
          <img src="${member.image_url}" alt="Member" class="rounded-lg" />
        </figure>
        <div class="card-body">
          <h3 class="card-title">${member.name}</h3>
          <p>${member.position}</p>
        </div>
      </div>
    `;
  }

  function renderMemberCards(): string {
    let memberCards = "";
    members.forEach((member) => {
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
};

const executeGalleryScript = async () => {
  // Define interfaces
  interface CarouselItem {
    id: string;
    content: string;
    prevSlide?: string;
    nextSlide?: string;
  }

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
        <h1 class="text-4xl font-bold md:text-5xl">${title}</h1>
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
  <div class="card-body">
    <h2 class="card-title">${title}</h2>
    <p>${description}</p>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
      nextSlide: createSlideNavigation(undefined, "slide ❯"),
    },
    ...galleryItems.map((item, index) => ({
      id: `slide${index + 2}`,
      content: `
  <div class="container mx-auto overflow-y-scroll px-4 py-8">
    ${createGalleryCard(item)}
  </div>
`,
      prevSlide: createSlideNavigation("❮ slide"),
      nextSlide: createSlideNavigation(undefined, "slide ❯"),
    })),
    {
      id: `slide${galleryItems.length + 2}`,
      content: createHeroContent(
        "Thank You",
        "We appreciate your interest in our gallery. Feel free to explore more!",
      ),
      prevSlide: createSlideNavigation("❮ slide"),
    },
  ];

  // // Define carousel items
  // const carouselItems: CarouselItem[] = [
  //   {
  //     id: "slide1",
  //     content: createHeroContent(
  //       "Our Gallery",
  //       "Explore our collection of images showcasing our products, events, and more.",
  //     ),
  //     nextSlide: createSlideNavigation(undefined, "slide ❯"),
  //   },
  //   {
  //     id: "slide2",
  //     content: `
  //   <div class="container mx-auto overflow-y-scroll px-4 py-8">
  //     ${createGalleryCard({
  //       title: "Gallery Item 1",
  //       description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //       images: [
  //         "/src/images/Collaborate.png",
  //         "/src/images/Explore.png",
  //         "/src/images/Guest-speakers.png",
  //       ],
  //     })}
  //   </div>
  // `,
  //     prevSlide: createSlideNavigation("❮ slide"),
  //     nextSlide: createSlideNavigation(undefined, "slide ❯"),
  //   },
  //   {
  //     id: "slide3",
  //     content: createHeroContent(
  //       "Thank You",
  //       "We appreciate your interest in our gallery. Feel free to explore more!",
  //     ),
  //     prevSlide: createSlideNavigation("❮ slide"),
  //   },
  // ];

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

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
