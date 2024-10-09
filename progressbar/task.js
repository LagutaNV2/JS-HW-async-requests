const form = document.getElementById('form');
const progress = document.getElementById('progress');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // страница не будет перезагружаться

    const formData = new FormData(form);     // Создаем объект FormData для сбора данных
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/upload');

    xhr.upload.onprogress = function (event) {
        // Проверка: можно ли вычислить общую длину загрузки (lengthComputable)
        // lengthComputable — это булевое свойство, которое содержится в объектах
        // событий типа ProgressEvent (например, XMLHttpRequest)
        if (event.lengthComputable) {
            // Вычисляем процент завершения загрузки
            // event.loaded: Количество байтов, которые уже загружены.
            // event.total: Общее количество байтов, которые необходимо загрузить (если известно).
            const percentComplete = event.loaded / event.total;

            // Устанавливаем значение прогресс-бара (от 0 до 1)
            progress.value = percentComplete;
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Файл успешно загружен');
        } else {
            console.error('Ошибка загрузки:', xhr.statusText);
        };
    };

    xhr.onerror = function () {
        console.error('Ошибка сети');
    };

    xhr.send(formData); // Отправляем объект FormData с данными формы на сервер
});
