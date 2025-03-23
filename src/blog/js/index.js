function executePageSpecificCode() {
  commonScripts();
  const currentPath = window.location.pathname;

  if (currentPath.endsWith("index.html") || currentPath === "/") {
    initializeHomePageScripts();
  } else {
    console.log("No specific code for this page.");
  }
}

executePageSpecificCode();

function commonScripts() {
  const mobileMenuIcon = document.querySelector(".mobile-menu-icon");
  const mobileNavMenu = document.querySelector(".nav__mobile");
  const checkbox = document.querySelector(".checkbox");
  mobileNavMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav__link")) {
      checkbox.checked = false;
    }
  });

  mobileMenuIcon.addEventListener("click", () => {
    const src = mobileMenuIcon.getAttribute("src");
    if (src.endsWith("close.svg")) {
      mobileMenuIcon.setAttribute("src", "./assets/img/dist/icons/burger.svg");
    }
    if (src.endsWith("burger.svg")) {
      mobileMenuIcon.setAttribute("src", "./assets/img/dist/icons/close.svg");
    }
  });

  // =================

  const chipLabelsBlock = document.querySelector(".chip__labels");
  const chipLabelsArr = document.querySelectorAll(".chip__label");

  if (chipLabelsBlock) {
    chipLabelsBlock.addEventListener("click", (e) => {
      if (e.target.classList.contains("chip__label")) {
        chipLabelsArr.forEach((label) =>
          label.classList.remove("chip__label--active")
        );
        e.target.classList.add("chip__label--active");
      }
    });
  }

  document.querySelectorAll(".view__rb").forEach((radio) => {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".chip__label").forEach((label) => {
        label.classList.remove("chip__label--active");
      });

      const activeLabel = document.querySelector(`label[for="${this.id}"]`);

      if (activeLabel) {
        activeLabel.classList.add("chip__label--active");
      }
    });
  });
}

function initializeHomePageScripts() {
  // SERVICE CARDS OPTIMIATION

  const serviceCardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          const sourse = video.querySelector("source");
          const dataSrc = sourse.dataset.src;
          sourse.src = dataSrc;
          video.load();
          serviceCardsObserver.unobserve(video);
        }
      });
    },
    { rootMargin: "200px 0px 0px", threshold: 0.5 }
  );
  document.querySelectorAll(".prod-icon-cont").forEach((card) => {
    serviceCardsObserver.observe(card);
  });
}

// HOME INSTRUCTION SECTION
const instructionsradioButtonsBlock = document.querySelector(
  ".instructions-view__rbs"
);
// get instructions content
const instructionsHeadingEl = document.querySelector(
  ".instructions-view-heading"
);
const instructionsParagraphEl = document.querySelector(
  ".instructions-view-paragraph"
);
const instructionLinkEl = document.querySelector(".view-inctruction-link");
const instructionsVideoSrcEl = document.querySelector(
  ".instructions-view-videoSrc"
);
const instructionsVideoEl = document.querySelector(".instructions-view__video");

fetch("./json/instructions.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load JSON");
    }
    return response.json();
  })
  .then((instructionsSourses) => {
    if (instructionsradioButtonsBlock) {
      instructionsradioButtonsBlock.addEventListener("click", (event) => {
        if (event.target && event.target.type === "radio") {
          const instructionId = event.target.id;
          try {
            const { heading, paragraph, instructionLink, videoSrc } =
              instructionsSourses[instructionId];

            instructionsHeadingEl.textContent = heading;
            instructionsParagraphEl.textContent = paragraph;
            instructionLinkEl.href = instructionLink;
            instructionsVideoSrcEl.src = videoSrc;
            instructionsVideoEl.load();
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  });

// HOME COURSES SECTION

//   const coursesRadioButtonsBlock = document.querySelector(".courses-view__rbs");
//   const courseHeadingEl = document.querySelector(".course-view-heading");
//   const courseParagraphEl = document.querySelector(".course-view-paragraph");
//   const courseLinkEl = document.querySelector(".view-course-link");
//   const courseVideoSrcEl = document.querySelector(".course-view-videoSrc");
//   const courseVideoEl = document.querySelector(".course-view__video");

//   fetch("./json/courses.json")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Failed to load JSON");
//       }
//       return response.json();
//     })
//     .then((coursesSourses) => {
//       coursesRadioButtonsBlock.addEventListener("click", (event) => {
//         if (event.target && event.target.type === "radio") {
//           const courseId = event.target.id;
//           try {
//             const { heading, paragraph, instructionLink, videoSrc } =
//               coursesSourses[courseId];

//             courseHeadingEl.textContent = heading;
//             courseParagraphEl.textContent = paragraph;
//             courseLinkEl.href = instructionLink;
//             courseVideoSrcEl.src = videoSrc;
//             courseVideoEl.load();
//           } catch (error) {
//             console.error(error);
//           }
//         }
//       });
//     });

// function initializeBlogPageScripts() {
//   const blogTagsBlock = document.querySelector(".blog__tags");
//   const blogTagItems = document.querySelectorAll(".blog__tag");
//   blogTagsBlock.addEventListener("click", (e) => {
//     if (e.target.classList.contains("blog__tag")) {
//       blogTagItems.forEach((item) =>
//         item.classList.remove("blog__tag--active")
//       );
//       e.target.classList.add("blog__tag--active");
//     }
//   });
// }
