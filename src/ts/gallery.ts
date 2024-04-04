import { SupabaseClient } from "@supabase/supabase-js";

// Interfaces
interface GalleryItem {
  title: string;
  description: string;
  images: string[];
}

// Helper Functions
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

// Main Function
export const executeGalleryScript = async (
  supabase: SupabaseClient<any, "public", any>,
) => {
  // Fetch data from Supabase
  const { data: galleryItems, error } = await supabase
    .from("gallery")
    .select("*");

  if (error) {
    console.error("Error fetching gallery items:", error);
    return;
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
