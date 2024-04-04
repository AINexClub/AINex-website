import { SupabaseClient } from "@supabase/supabase-js";

// Helper Functions
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
export async function executeNewsScript(
  supabase: SupabaseClient<any, "public", any>,
) {
  // Add event listener to the form submission
  const newsForm = document.getElementById("news-form") as HTMLFormElement;
  if (newsForm) {
    newsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(newsForm);
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
}
