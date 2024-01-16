
const menu_icons = document.querySelectorAll(".menu_icon");
const menu_options = document.querySelectorAll(".menu_option");

menu_icons.forEach((menu_icon, index) => {
    menu_icon.addEventListener('click', () => {
        menu_options.forEach((option, optionIndex) => {
            if (index === optionIndex) {
                option.classList.toggle('active');
            } else {
                option.classList.remove('active');
            }
        });
    });
});