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
        processPayment(cardNumber, expiryDate, cvv);
    }
}

// Функция для валидации данных карты
function validateCardDetails(cardNumber, expiryDate, cvv) {
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^\d{2}\/\d{2}$/; // Ожидаемый формат MM/YY
    const cvvRegex = /^\d{3}$/;

    return cardNumberRegex.test(cardNumber) && expiryDateRegex.test(expiryDate) && cvvRegex.test(cvv);
}

// Функция для автоматического добавления слэша в поле ММ/ГГ
document.getElementById('expiry-date').addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, '').substring(0, 4); // Получаем только цифры
    const month = input.substring(0, 2);
    const year = input.substring(2, 4);

    if (input.length > 2) {
        e.target.value = `${month}/${year}`;
    } else {
        e.target.value = month;
    }
});

// Функция для обработки платежа
function processPayment(cardNumber, expiryDate, cvv) {
    const data = {
        terminalKey: '1725015643739DEMO',  // замените на ваш ключ терминала
        password: 'Tkm&Fw6R6Rt_bRmE',  // Добавлен пароль API
        amount: document.getElementById('total-price').textContent.replace(/[^\d]/g, ''),  // Получаем сумму из total-price
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        description: 'Оплата заказа',
        orderId: '12345', // Идентификатор заказа
    };

    fetch('https://securepay.tinkoff.ru/v2/Init', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.Success) {
            showModal('Платеж успешно проведен!', 'green');
        } else {
            showModal('Ошибка при оплате: ' + data.Message, 'red');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showModal('Ошибка при оплате. Попробуйте позже.', 'red');
    });
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

// Функция для отображения модального окна
function showModal(message, color) {
    const modal = document.getElementById('payment-modal');
    const modalContent = document.getElementById('modal-content');
    const modalMessage = document.getElementById('modal-message');

    modalMessage.textContent = message;
    modalContent.className = 'modal-content ' + color;
    modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('payment-modal');
    modal.style.display = 'none';
}

// Загрузка отзывов при загрузке страницы
window.onload = function() {
    loadReviews();
    startCountdown();
};

// Таймер для скидки
function startCountdown() {
    const targetDate = new Date('October 1, 2024 00:00:00').getTime();

    const countdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerHTML = days;
        document.getElementById('hours').innerHTML = hours;
        document.getElementById('minutes').innerHTML = minutes;
        document.getElementById('seconds').innerHTML = seconds;

        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById('countdown').innerHTML = 'Скидка закончилась';
        }
    }, 1000);
}
