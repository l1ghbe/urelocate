const arr = [1, 2, 3, 4, 5, 6, 7];
const main = document.querySelector(".main");

console.log(arr);

// HOME INSTRUCTION SECTION

const radioButtonsBlock = document.querySelector(".view__rbs");
const radioButtons = document.querySelectorAll(".view__rb");

// get instructions content

const headingEl = document.querySelector(".view-heading");
const paragraphEl = document.querySelector(".view-paragraph");
const instructionLinkEl = document.querySelector(".view-inctruction-link");
const videoSrcEl = document.querySelector(".view-videoSrc");
const videoEl = document.querySelector(".view__video");

fetch("../json/instructions.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load JSON");
    }
    return response.json();
  })
  .then((instructionsSourses) => {
    radioButtonsBlock.addEventListener("click", (event) => {
      if (event.target && event.target.type === "radio") {
        const instructionId = event.target.id;
        try {
          const { heading, paragraph, instructionLink, videoSrc } =
            instructionsSourses[instructionId];

          headingEl.textContent = heading;
          paragraphEl.textContent = paragraph;
          instructionLinkEl.href = instructionLink;
          videoSrcEl.src = videoSrc;
          videoEl.load();
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
