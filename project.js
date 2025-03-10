document.addEventListener("DOMContentLoaded", function () {
    let previewContainer = document.querySelector('.projectPopUpSection');
    let previewBoxes = document.querySelectorAll('.projectPopUpContainer');

    document.querySelectorAll('.projectSection .projectContainer').forEach(project => {
        project.onclick = () => {
            previewContainer.style.display = 'flex';
            let name = project.getAttribute('data-name');

            previewBoxes.forEach(preview => {
                let target = preview.getAttribute('data-target');
                if (name === target) {
                    preview.classList.add('active');
                    preview.style.display = 'flex';
                } else {
                    preview.classList.remove('active');
                    preview.style.display = 'none';
                }
            });
        };
    });

    previewBoxes.forEach(preview => {
        let closeButton = preview.querySelector('.close');
        closeButton.onclick = () => closePopup();
    });

    previewContainer.onclick = (event) => {
        if (!event.target.closest('.projectPopUpContainer')) {
            closePopup();
        }
    };

    function closePopup() {
        previewBoxes.forEach(preview => {
            preview.classList.remove('active');
            preview.style.display = 'none';
        });
        previewContainer.style.display = 'none';
    }
});
