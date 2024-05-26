// function openModal(src) {
//     var modal = document.getElementById('imageModal');
//     var modalImg = document.getElementById("modalImage");

//     modal.style.display = "flex";
//     setTimeout(() => {
//         modal.style.opacity = "1";
//         modalImg.classList.add("show");
//     }, 10);
//     modalImg.src = src;
// }

// function closeModal() {
//     var modal = document.getElementById('imageModal');
//     var modalImg = document.getElementById("modalImage");

//     modal.style.opacity = "0";
//     modalImg.classList.remove("show");
//     setTimeout(() => {
//         modal.style.display = "none";
//     }, 300);
// }



function openModal(src) {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById("modalImage");

    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.opacity = "1";
        modalImg.classList.add("show");
    }, 10);
    modalImg.src = src;
}

function closeModal() {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById("modalImage");

    modal.style.opacity = "0";
    modalImg.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}
