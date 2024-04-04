import { SupabaseClient } from "@supabase/supabase-js";

// Helper Functions
function createThanksDiv(): string {
  return `
    <div class="mt-4 bg-primary text-primary-content rounded-lg shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Thank you for your submission!</h2>
        <p>Your message has been received, and we'll get back to you shortly.</p>
      </div>
    </div>
  `;
}

// Main Function
export const executeContactScript = async (
  supabase: SupabaseClient<any, "public", any>,
) => {
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
      const form = formData.get("form");
      try {
        // Fetch the user's existing data based on the email
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (fetchError) {
          console.error("Error fetching user:", fetchError);
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
          .insert({ name, email, form });

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
};
