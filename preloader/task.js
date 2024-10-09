const loader = document.getElementById('loader');
const itemsContainer = document.getElementById('items');

// объявляем ключи для дальнейшего использования при кешировании
const CACHE_KEY = 'currencyData';
const CACHE_TIME_KEY = 'cacheTimestamp';
const CACHE_TTL = 10 * 60 * 1000; // Время актуальности кэша: 10 минут


// получение данных о курсах валют с сервера
function loadCurrData() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Настраиваем запрос
        console.log('делаем запрос')
        xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/slow-get-courses');
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log('ответ  ', xhr.response.response)
                resolve(xhr.response.response);
            } else {
                reject(new Error(`Ошибка загрузки: ${xhr.status}`));
            }
        };
        xhr.onerror = () => reject(new Error('Ошибка связи'));

        // Отправляем запрос
        xhr.send();
    });
}

// отображение данных о валюте на странице
function displayCurrData(data) {
    loader.classList.remove('loader_active');
    itemsContainer.innerHTML = '';

    for (const currency in data) {
        const { CharCode, Value } = data[currency];

        itemsContainer.insertAdjacentHTML('beforeend', `
            <div class="item">
                <div class="item__code">${CharCode}</div>
                <div class="item__value">${Value.toFixed(2)}</div>
                <div class="item__currency">руб.</div>
            </div>
        `);
    }
}

// Получение данных из localStorage
function getCachedData() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIME_KEY);
    if (cachedData && cachedTimestamp) {
        if ((Date.now() - parseInt(cachedTimestamp, 10)) < CACHE_TTL) {
            return JSON.parse(cachedData);
        }
    }
    return null; // если данных нет или они устарели, возвращаем null
}

// по каждой валюте сохраняем только CharCode и Value
function cacheData(data) {
    const minimalData = {};

    for (const currency in data.Valute) {
        minimalData[currency] = {
            CharCode: data.Valute[currency].CharCode,
            Value: data.Valute[currency].Value
        };
    }

    console.log('объект для передачи в хранилище  ', JSON.stringify(minimalData))

    localStorage.setItem(CACHE_KEY, JSON.stringify(minimalData));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString()); // Текущее время
}

// Основная логика
function mainFunction() {
    const cachedData = getCachedData();

    if (cachedData) {
        displayCurrData(cachedData); // данные в хранилище есть и актуальны - выводим их
    } else {
        loadCurrData() // делаем запрос данных
        .then(data => {
            displayCurrData(data.Valute); // обновляем данные на странице
            cacheData(data); // сохраняем данные
        })
        .catch(error => {
            console.error(error); // Логируем ошибку
            loader.classList.remove('loader_active'); // Скрываем загрузчик при ошибке
        });
    }
}

document.addEventListener('DOMContentLoaded', mainFunction);