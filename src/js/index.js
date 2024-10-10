function executePageSpecificCode() {
  commonScripts();
  const currentPath = window.location.pathname;

  if (currentPath.endsWith("index.html") || currentPath === "/") {
    initializeHomePageScripts();
  } else if (currentPath.endsWith("blog.html")) {
    initializeBlogPageScripts();
  } else {
    console.log("No specific code for this page.");
  }
}

executePageSpecificCode();

function commonScripts() {
  const mobileNavMenu = document.querySelector(".nav__mobile");
  const checkbox = document.querySelector(".checkbox");
  console.log(mobileNavMenu);
  mobileNavMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav__link")) {
      checkbox.checked = false;
    }
  });
}

function initializeHomePageScripts() {
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
  const instructionsVideoEl = document.querySelector(
    ".instructions-view__video"
  );

  fetch("./json/instructions.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load JSON");
      }
      return response.json();
    })
    .then((instructionsSourses) => {
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
    });

  // HOME COURSES SECTION

  const coursesRadioButtonsBlock = document.querySelector(".courses-view__rbs");
  const courseHeadingEl = document.querySelector(".course-view-heading");
  const courseParagraphEl = document.querySelector(".course-view-paragraph");
  const courseLinkEl = document.querySelector(".view-course-link");
  const courseVideoSrcEl = document.querySelector(".course-view-videoSrc");
  const courseVideoEl = document.querySelector(".course-view__video");

  fetch("./json/courses.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load JSON");
      }
      return response.json();
    })
    .then((coursesSourses) => {
      coursesRadioButtonsBlock.addEventListener("click", (event) => {
        if (event.target && event.target.type === "radio") {
          const courseId = event.target.id;
          try {
            const { heading, paragraph, instructionLink, videoSrc } =
              coursesSourses[courseId];

            courseHeadingEl.textContent = heading;
            courseParagraphEl.textContent = paragraph;
            courseLinkEl.href = instructionLink;
            courseVideoSrcEl.src = videoSrc;
            courseVideoEl.load();
          } catch (error) {
            console.error(error);
          }
        }
      });
    });
}

function initializeBlogPageScripts() {
  const blogTagsBlock = document.querySelector(".blog__tags");
  const blogTagItems = document.querySelectorAll(".blog__tag");
  blogTagsBlock.addEventListener("click", (e) => {
    if (e.target.classList.contains("blog__tag")) {
      blogTagItems.forEach((item) =>
        item.classList.remove("blog__tag--active")
      );
      e.target.classList.add("blog__tag--active");
    }
  });
}
