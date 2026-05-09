// ===============================
// BUSINESS WEBSITE MAIN SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const orderButtons = document.querySelectorAll(".order-btn");

  orderButtons.forEach((button) => {

    button.addEventListener("click", () => {

      alert(
        "Thank you for your interest!\n\n" +
        "WhatsApp ordering system will be connected here later."
      );

    });

  });

});
