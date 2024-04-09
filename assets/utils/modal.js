const modal = document.querySelector(".modal");
const modalText= document.querySelector(".caption");
const modalButton = document.querySelector(".modal__button");


const showModal = (text) =>{
    modalText.innerText = text;
    modal.style.display = "flex"
}

const removeModal = () =>{
    modal.style.display = "none"
}



modalButton.addEventListener("click",removeModal)

export { showModal, removeModal }