document.addEventListener('DOMContentLoaded', function () {
    const logTableBody = document.querySelector('#logTable tbody');
    const exportButton = document.getElementById('exportButton');

    // Lädt die Logs und zeigt sie in der Tabelle an
    function loadLogs() {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        logTableBody.innerHTML = logs.map((log, index) => `
            <tr>
                <td data-label="Auftragsnummer">${log.auftragsnummer}</td>
                <td data-label="Kunde">${log.kunde}</td>
                <td data-label="Artikelnummer">${log.artikelnummer}</td>
                <td data-label="Arbeitsgang">${log.arbeitsgang}</td>
                <td data-label="Mitarbeiternummer">${log.mitarbeiternummer}</td>
                <td data-label="Startzeit">${new Date(log.startTime).toLocaleString()}</td>
                <td data-label="Endzeit">${new Date(log.endTime).toLocaleString()}</td>
                <td data-label="Dauer">${log.duration}</td>
                <td data-label="Aktionen"><button class="delete-log" aria-label="Log-Eintrag löschen" data-index="${index}">Löschen</button></td>
            </tr>
        `).join('');
    }

    // Löscht einen Log-Eintrag
    function deleteLog(index) {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        logs.splice(index, 1);
        localStorage.setItem('logs', JSON.stringify(logs));
        loadLogs();
    }

    // Exportiert die Logs als CSV-Datei
    function exportToExcel() {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        let csvContent = "data:text/csv;charset=utf-8,";
        // CSV Header
        csvContent += "Auftragsnummer;Kunde;Artikelnummer;Arbeitsgang;Mitarbeiternummer;Startzeit;Endzeit;Dauer\n";

        logs.forEach(log => {
            const row = [
                log.auftragsnummer,
                log.kunde,
                log.artikelnummer,
                log.arbeitsgang,
                log.mitarbeiternummer,
                new Date(log.startTime).toLocaleString(),
                new Date(log.endTime).toLocaleString(),
                log.duration
            ].join(";");
            csvContent += row + "\r\n";
        });

        // Erzeugt den Download-Link und startet den Download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "zeiterfassungsprotokoll.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event-Listener für den Export-Button
    exportButton.addEventListener('click', exportToExcel);

    // Event-Delegation für das Löschen von Logs
    logTableBody.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-log')) {
            const index = e.target.getAttribute('data-index');
            deleteLog(index);
        }
    });

    // Initiale Log-Daten laden
    loadLogs();
});
