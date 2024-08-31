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
    if (!selectedSize) {
        alert("Пожалуйста, выберите размер.");
        return;
    }

    document.getElementById('cart-item-size').textContent = `Размер: ${selectedSize} RU`;
    
    const price = 4210; // Предположим, что цена фиксированная
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

// Функция для показа модального окна и автоматического его закрытия через 3 секунды
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';

    // Закрываем модальное окно через 3 секунды
    setTimeout(closeModal, 3000);
}

// Функция для закрытия модального окна
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

// Функция для показа чека
function showInvoice(event) {
    event.preventDefault();

    if (!validateDeliveryForm()) {
        return;
    }
    
    // Получаем данные из формы
    const address = document.getElementById('address').value;
    const apartment = document.getElementById('apartment').value;
    const index = document.getElementById('index').value;
    const pod = document.getElementById('pod').value;
    const etaj = document.getElementById('etaj').value;
    const domofon = document.getElementById('domofon').value;
    const comment = document.getElementById('comment').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const size = document.getElementById('cart-item-size').textContent;
    const price = document.getElementById('total-price').textContent;

    // Формируем HTML для чека
    const invoiceHtml = `
        <p><strong>Адрес:</strong> ${address}, Кв. ${apartment}, Индекс: ${index}</p>
        <p><strong>Подъезд:</strong> ${pod}, <strong>Этаж:</strong> ${etaj}, <strong>Домофон:</strong> ${domofon}</p>
        <p><strong>Комментарий:</strong> ${comment}</p>
        <p><strong>Получатель:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Детали заказа:</strong> ${size}, ${price}</p>
    `;

    // Отображаем чек в модальном окне
    document.getElementById('invoice-details').innerHTML = invoiceHtml;
    document.getElementById('invoice-modal').style.display = 'block';
}

// Функция для проверки заполненности обязательных полей формы доставки
function validateDeliveryForm() {
    const address = document.getElementById('address').value.trim();
    const index = document.getElementById('index').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const deliveryDate = document.getElementById('delivery-date').value.trim();

    const errors = [];

    if (!address) errors.push("Почтовая улица обязательна.");
    if (!index) errors.push("Индекс обязателен.");
    if (!comment) errors.push("Комментарий к курьеру обязателен.");
    if (!name) errors.push("Имя и фамилия обязательны.");
    if (!phone) errors.push("Номер телефона обязателен.");
    if (!deliveryDate) errors.push("Выбор даты доставки обязателен.");

    if (errors.length > 0) {
        const errorsContainer = document.getElementById('form-errors');
        errorsContainer.innerHTML = errors.join("<br>");
        errorsContainer.style.display = 'block';
        return false;
    }

    document.getElementById('form-errors').style.display = 'none';
    return true;
}

// Функция для перехода к оплате
function proceedToPayment() {
    closeModal();
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
        showModal('error-modal');
    } else {
        processPayment(cardNumber, expiryDate, cvv);
    }
}

// Функция для валидации данных карты
function validateCardDetails(cardNumber, expiryDate, cvv) {
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^\d{2}\/\d{2}$/;
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
    const terminalKey = '1725015643739DEMO';  // Вставьте ваш ключ терминала здесь
    const password = 'Tkm&Fw6R6Rt_bRmE';  // Вставьте ваш пароль здесь

    const data = {
        terminalKey: terminalKey,
        password: password,  // Необходимо добавить пароль к данным
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
            showModal('payment-success-modal');  // Отображение модального окна успеха
        } else {
            showModal('error-modal');  // Отображение модального окна ошибки
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showModal('error-modal');
    });
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

// Загрузка данных и инициализация элементов при загрузке страницы
window.onload = function() {
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

// Ограничение выбора даты доставки на 15 дней вперед
document.getElementById('delivery-date').addEventListener('focus', function() {
    const today = new Date();
    today.setDate(today.getDate() + 15);
    const minDate = today.toISOString().split('T')[0];
    this.setAttribute('min', minDate);
});
