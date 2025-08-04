const heroRadioButtons = document.querySelectorAll('.radio-button');

function radioButtonClick(btn) {
    const buttons = document.querySelectorAll('.radio-button');
    buttons.forEach((e) => {
        e.classList.remove('radio-clicked');
    });
    btn.classList.add('radio-clicked');
}

heroRadioButtons.forEach((e) => {
    e.addEventListener('click', () => {
        radioButtonClick(e);
    });
});