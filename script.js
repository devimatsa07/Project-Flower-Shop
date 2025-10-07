document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartCountElement = document.getElementById('cart-count');

    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            cartCount++;
            cartCountElement.innerText = cartCount;
            cartCountElement.style.display = 'inline';
            // Add a simple animation to the cart icon
            const cartIcon = document.querySelector('.fas.fa-shopping-cart');
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
        });
    });

    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
            header.classList.add('nav-hide');
        } else {
            header.classList.remove('nav-hide');
        }
        lastScrollY = window.scrollY;
    });
});
