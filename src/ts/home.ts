import { SupabaseClient } from "@supabase/supabase-js";

// Helper Functions
function createMemberCard(member: any): string {
  return `
    <div class="card bg-base-200 shadow-xl">
      <figure>
        <img src="${member.image_url}" alt="Member" class="rounded-lg" />
      </figure>
      <div class="card-body">
        <h3 class="card-title">${member.name}</h3>
        <p>${member.position}</p>
        ${
          member.contact_info
            ? `<a class="link link-primary" href="mailto: ${member.contact_info}"> ${member.contact_info}</a>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderMemberCards(members: any[]): string {
  let memberCards = "";
  members.forEach((member) => {
    memberCards += createMemberCard(member);
  });
  return memberCards;
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
export const executeHomeScript = async (
  supabase: SupabaseClient<any, "public", any>,
) => {
  // Fetch members from Supabase
  const { data: members, error } = await supabase.from("members").select("*");

  if (error) {
    console.error("Error fetching members:", error);
    return;
  }

  // Render member cards
  const memberCardsHTML = renderMemberCards(members);
  const memberCardsContainer = document.getElementById(
    "member-cards-container",
  );
  if (memberCardsContainer) {
    memberCardsContainer.innerHTML = memberCardsHTML;
  }

  // Add event listener to the form submission
  const homeForm = document.getElementById("home-form") as HTMLFormElement;
  if (homeForm) {
    homeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(homeForm);
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
