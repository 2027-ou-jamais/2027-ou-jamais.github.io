const navBurgerElem = document.querySelector('.navbar-burger')

navBurgerElem.addEventListener("click", (e) => {
    document.getElementById(e.target.dataset.target).classList.toggle('is-active')
})