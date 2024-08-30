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
    document.getElementById('cart-item-price').textContent = `Цена: ${price} UZS`;
    document.getElementById('total-price').textContent = `Общая стоимость: ${price} UZS`;

    document.querySelector('.cart-page').style.display = 'block';
    document.querySelector('.product-page').style.display = 'none';
}

// Функция для обновления итоговой суммы и скидки
function updateCartSummary() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = 580000;
    let discount = 0;

    if (quantity >= 100) {
        discount = basePrice * 0.08;
    } else if (quantity >= 10) {
        discount = basePrice * 0.05;
    }

    const totalPrice = (basePrice - discount) * quantity;

    document.getElementById('discount-info').textContent = `Скидка: ${discount * quantity} UZS`;
    document.getElementById('total-price').textContent = `Общая стоимость: ${totalPrice} UZS`;
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
    const basePrice = 580000;

    if (quantity >= 100) {
        return 500000;
    } else if (quantity >= 10) {
        return 550000;
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
