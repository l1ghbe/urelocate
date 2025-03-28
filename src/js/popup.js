document.addEventListener("DOMContentLoaded", async () => {
  const popupOverlay = document.getElementById("popupOverlay");
  const popupForm = document.getElementById("popupForm");
  const closePopup = document.getElementById("closePopup");
  const popupFormElement = document.getElementById("telegramPopupForm");
  const allInstructionBtns = document.querySelectorAll(
    ".view-inctruction-link"
  );

  let TOKEN, CHAT_ID, GOOGLE_SHEET_URL;

  // Fetch configuration from /config/config.json
  try {
    const response = await fetch("./config/config.json");
    if (!response.ok) throw new Error("Failed to load config file.");
    const config = await response.json();
    TOKEN = config.privateBotToken;
    CHAT_ID = config.privateChatId;
    GOOGLE_SHEET_URL = config.googleSheetWebAppUrl;
  } catch (error) {
    console.error("Error loading config:", error);
    return; // Stop execution if config cannot be loaded
  }
  // Open popup
  allInstructionBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      popupOverlay.classList.add("show");
      popupForm.classList.add("show");

      // Store the download URL in the form's dataset
      const downloadUrl = button.getAttribute("data-download-url");
      popupFormElement.setAttribute("data-download-url", downloadUrl);
    });
  });

  // Close popup
  closePopup.addEventListener("click", () => {
    popupOverlay.classList.remove("show");
    popupForm.classList.remove("show");
  });

  popupOverlay.addEventListener("click", () => {
    popupOverlay.classList.remove("show");
    popupForm.classList.remove("show");
  });

  // Handle form submission
  popupFormElement.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("popup-form-name").value.trim();
    let telegram = document.getElementById("popup-form-tg").value.trim();
    const email = document.getElementById("popup-form-email").value.trim();
    const downloadUrl = popupFormElement.getAttribute("data-download-url");
    const updatedName = '(Инстр) ' + name;


    if (!name || !telegram || !email) {
      alert("Пожалуйста, заполните все необходимые поля.");
      return;
    }

    if (!telegram.startsWith("@")) {
      telegram = `@${telegram}`;
    }

    const message = createTelegramMessage(name, telegram, email, "-");

    try {
      // Send message to Telegram
      await sendTelegramMessage(TOKEN, CHAT_ID, message);

      // Append data to Google Sheets
      const utmData = getUtmParamsFromCookies();
      const { utm_source, utm_term, GeoLoc, AgId, utm_campaign } =
        utmData || {};
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}.${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}.${currentDate.getFullYear()}`;

      await appendToGoogleSheet({
        webAppUrl: GOOGLE_SHEET_URL,
        name: updatedName,
        telegram,
        source: utm_source || "",
        campaign: utm_campaign || "",
        keywords: utm_term || "",
        region: GeoLoc || "",
        date: formattedDate || "",
        hasPurchase: "нет",
        relevance: "нет",
      });

      // Trigger the file download
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.warn("Download URL is not set.");
      }

      // Close the popup
      popupOverlay.classList.remove("show");
      popupForm.classList.remove("show");
      popupFormElement.reset();
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("Возникла ошибка при отправке формы. Попробуйте снова.");
    }
  });
});
