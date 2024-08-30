// Функция для изменения главной фотографии
function changeMainPhoto(newSrc) {
    const mainPhoto = document.getElementById('main-photo-img');
    const tempSrc = mainPhoto.src;
    mainPhoto.src = newSrc;
    
    document.querySelector(`img[src="${newSrc}"]`).src = tempSrc;
}

// Функция для добавления товара в корзину
function addToCart() {
    const selectedSize = document.getElementById('size').value;
    document.getElementById('cart-item-size').textContent = `Размер: ${selectedSize} RU`;
    
    const price = calculatePrice();
    document.getElementById('cart-item-price').textContent = `Цена: ${price} ₽`;
    document.getElementById('total-price').textContent = `Общая стоимость: ${price} ₽`;

    document.querySelector('.cart-page').style.display = 'block';
    document.querySelector('.product-page').style.display = 'none';
}

// Функция для обновления итоговой суммы и скидки
function updateCartSummary() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = 4210;
    let discount = 0;

    if (quantity >= 100) {
        discount = basePrice * 0.08;
    } else if (quantity >= 10) {
        discount = basePrice * 0.05;
    }

    const totalPrice = (basePrice - discount) * quantity;

    document.getElementById('discount-info').textContent = `Скидка: ${discount * quantity} ₽`;
    document.getElementById('total-price').textContent = `Общая стоимость: ${totalPrice} ₽`;
}

// Функция для перехода к странице доставки
function showDelivery() {
    document.querySelector('.cart-page').style.display = 'none';
    document.querySelector('.delivery-page').style.display = 'block';
}

// Функция для перехода к странице оплаты
function showPayment(event) {
    event.preventDefault();
    document.querySelector('.delivery-page').style.display = 'none';
    document.querySelector('.payment-page').style.display = 'block';
}

// Функция для проверки данных карты и завершения заказа
function completeOrder(event) {
    event.preventDefault();
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    if (!validateCardDetails(cardNumber, expiryDate, cvv)) {
        document.getElementById('error-message').style.display = 'block';
    } else {
        alert('Заказ успешно оформлен!');
    }
}

// Функция для валидации данных карты
function validateCardDetails(cardNumber, expiryDate, cvv) {
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^\d{2}\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    return cardNumberRegex.test(cardNumber) && expiryDateRegex.test(expiryDate) && cvvRegex.test(cvv);
}

// Функция для расчета цены с учетом скидок
function calculatePrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = 4210;

    if (quantity >= 100) {
        return 5000;
    } else if (quantity >= 10) {
        return 5500;
    } else {
        return basePrice;
    }
}

// Функции для работы с чатом
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;
    if (message.trim() === '') return;

    const chatMessages = document.getElementById('chat-messages');
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    chatMessages.appendChild(newMessage);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Функции для работы с отзывами
function submitReview() {
    const name = document.getElementById('reviewer-name').value;
    const text = document.getElementById('review-text').value;
    const rating = document.getElementById('review-rating').value;

    if (name.trim() === '' || text.trim() === '') {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const review = {
        name: name,
        text: text,
        rating: rating,
    };

    saveReview(review);
    addReviewToDOM(review);

    document.getElementById('reviewer-name').value = '';
    document.getElementById('review-text').value = '';
    document.getElementById('review-rating').value = '5';
}

function saveReview(review) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.forEach(review => addReviewToDOM(review));
}

function addReviewToDOM(review) {
    const reviewsList = document.getElementById('reviews-list');
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review';
    reviewElement.innerHTML = `
        <h4>${review.name} - ${'★'.repeat(review.rating)}</h4>
        <p>${review.text}</p>
    `;
    reviewsList.appendChild(reviewElement);
}

// Загрузка отзывов при загрузке страницы
window.onload = function() {
    loadReviews();
};
