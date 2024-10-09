document.addEventListener('DOMContentLoaded', mainFunction);

function loadPollData() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/poll');
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(new Error(`Ошибка загрузки данных: ${xhr.status}`));
            }
        };
        xhr.onerror = () => reject(new Error('Ошибка связи'));
        xhr.send();
    });
}

function displayPollData(data) {
    const pollTitle = document.getElementById('poll__title');
    const pollAnswers = document.getElementById('poll__answers');
    pollTitle.textContent = data.data.title;

    data.data.answers.forEach((answer, index) => {
        const buttonHTML = `
            <button class="poll__answer">${answer}</button>
        `;
        pollAnswers.insertAdjacentHTML('beforeend', buttonHTML);

        pollAnswers.lastElementChild.addEventListener('click', () => {
            alert('Спасибо, ваш голос засчитан!');
            sendVote(data.id, index);
        });
    });
}

function sendVote(pollId, answerIndex) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/poll');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {

            // Обработка результатов голосования
            const response = JSON.parse(xhr.responseText);
            console.log('получен ответ по результатам голосования: ', response)
            if (response.stat) {
                displayVoteResults(response.stat);

            } else {
                console.error('Нет данных для отображения результатов');
            }
        } else {
            console.error(`Ошибка отправки голоса: ${xhr.status}`);
        }
    };

    xhr.onerror = () => console.error('Ошибка отправки данных');

    console.log('отправка голоса,   vote=', pollId, 'answer=', answerIndex)
    xhr.send(`vote=${pollId}&answer=${answerIndex}`); // xhr.send( 'vote=1&answer=2' );
}

function displayVoteResults(results) {
    let pollResults = document.getElementById('poll__results');

    if (!pollResults) {
        pollResults = document.createElement('div');
        pollResults.id = 'poll__results';
        document.querySelector('.poll').appendChild(pollResults);
    }

    pollResults.innerHTML = '';

    const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);

    results.forEach(result => {
        const percentage = ((result.votes / totalVotes) * 100).toFixed(2);
        const resultHTML = `<div>${result.answer}: ${result.votes} голосов (${percentage}%)</div>`;
        pollResults.insertAdjacentHTML('beforeend', resultHTML);
    });
}

function mainFunction() {
    loadPollData()
        .then(displayPollData)
        .catch(error => console.error('Ошибка загрузки данных:', error));
}