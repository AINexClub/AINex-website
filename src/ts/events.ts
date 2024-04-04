import { SupabaseClient } from "@supabase/supabase-js";

// Interfaces
interface EventItem {
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
}

// Helper Functions
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

function renderEventSection(eventItems: EventItem[]): string {
  const eventCards = eventItems.map(createEventCard).join("");

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

function createThanksDiv(): string {
  return `
    <div class="mt-4 bg-primary text-primary-content rounded-lg shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Thank you for your submission!</h2>
        <p>We'll get back to you shortly.</p>
      </div>
    </div>
  `;
}

// Main Function
export const executeEventsScript = async (
  supabase: SupabaseClient<any, "public", any>,
) => {
  // Fetch events from Supabase
  const { data: eventItems, error } = await supabase.from("events").select("*");

  if (error) {
    console.error("Error fetching events:", error);
    return;
  }

  // Render event section
  const eventsContainer = document.getElementById("events-container");
  if (eventsContainer) {
    eventsContainer.innerHTML = renderEventSection(eventItems);
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
      const form = formData.get("form");

      try {
        const { error } = await supabase
          .from("users")
          .upsert({ name, email, form }, { onConflict: "email" });

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
