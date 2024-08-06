document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const timerDisplay = document.getElementById('timerDisplay');
    const feedbackDisplay = document.getElementById('feedbackDisplay');
    const auftragsnummer = document.getElementById('auftragsnummer');
    const kunde = document.getElementById('kunde');
    const artikelnummer = document.getElementById('artikelnummer');
    const arbeitsgang = document.getElementById('arbeitsgang');
    const mitarbeiternummer = document.getElementById('mitarbeiternummer');
    let startTime;
    let interval;

    function setFeedback(elementId, message) {
        const feedbackElement = document.getElementById(elementId);
        feedbackElement.textContent = message;
        feedbackElement.setAttribute('role', 'alert');
    }

    function clearFeedback(elementId) {
        const feedbackElement = document.getElementById(elementId);
        feedbackElement.textContent = '';
        feedbackElement.removeAttribute('role');
    }

    function validateForm() {
        let isValid = true;

        if (auftragsnummer.value.trim() === '') {
            setFeedback('auftragsnummer-feedback', 'Bitte Auftragsnummer eingeben.');
            isValid = false;
        } else {
            clearFeedback('auftragsnummer-feedback');
        }

        if (kunde.value.trim() === '') {
            setFeedback('kunde-feedback', 'Bitte Kunde eingeben.');
            isValid = false;
        } else {
            clearFeedback('kunde-feedback');
        }

        if (artikelnummer.value.trim() === '') {
            setFeedback('artikelnummer-feedback', 'Bitte Artikelnummer eingeben.');
            isValid = false;
        } else {
            clearFeedback('artikelnummer-feedback');
        }

        if (arbeitsgang.value.trim() === '') {
            setFeedback('arbeitsgang-feedback', 'Bitte Arbeitsgang auswählen.');
            isValid = false;
        } else {
            clearFeedback('arbeitsgang-feedback');
        }

        if (mitarbeiternummer.value.trim() === '') {
            setFeedback('mitarbeiternummer-feedback', 'Bitte Mitarbeiterrnummer eingeben.');
            isValid = false;
        } else {
            clearFeedback('mitarbeiternummer-feedback');
        }

        return isValid;
    }

    function toggleFormElements(disable) {
        auftragsnummer.disabled = disable;
        kunde.disabled = disable;
        artikelnummer.disabled = disable;
        arbeitsgang.disabled = disable;
        mitarbeiternummer.disabled = disable;
    }

    function startTimer() {
        startTime = new Date();
        interval = setInterval(updateTimer, 1000);
        timerDisplay.textContent = 'Zeiterfassung läuft...';
        startButton.disabled = true;
        endButton.disabled = false;
        feedbackDisplay.textContent = '';
        toggleFormElements(true);
    }

    function updateTimer() {
        const currentTime = new Date();
        const elapsedTime = new Date(currentTime - startTime);
        const minutes = elapsedTime.getUTCMinutes();
        const seconds = elapsedTime.getUTCSeconds();
        timerDisplay.textContent = `Laufzeit: ${minutes}m ${seconds}s`;
    }

    function endTimer() {
        clearInterval(interval);
        const endTime = new Date();
        const elapsedTime = new Date(endTime - startTime);
        const minutes = elapsedTime.getUTCMinutes();
        const seconds = elapsedTime.getUTCSeconds();
        timerDisplay.textContent = `Erfasste Zeit: ${minutes}m ${seconds}s`;
        startButton.disabled = false;
        endButton.disabled = true;
        saveLog(startTime, endTime, minutes, seconds);
        toggleFormElements(false);
    }

    function saveLog(start, end, minutes, seconds) {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        const log = {
            auftragsnummer: auftragsnummer.value,
            kunde: kunde.value,
            artikelnummer: artikelnummer.value,
            arbeitsgang: arbeitsgang.value,
            mitarbeiternummer: mitarbeiternummer.value,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            duration: `${minutes}m ${seconds}s`
        };
        logs.push(log);
        localStorage.setItem('logs', JSON.stringify(logs));
    }

    startButton.addEventListener('click', function () {
        if (validateForm()) {
            startTimer();
        }
    });

    endButton.addEventListener('click', function () {
        endTimer();
    });
});
