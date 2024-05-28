document.addEventListener('DOMContentLoaded', function () {
    loadMultas();
});

function loadMultas() {
    fetch('http://localhost:3000/api/multas')
        .then(response => response.json())
        .then(multas => {
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';

            const months = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];

            const groupedByMonth = {};

            multas.forEach(multa => {
                const [day, month, year] = multa.fecha.split('/');
                const monthYear = `${months[parseInt(month) - 1]} ${year}`;

                if (!groupedByMonth[monthYear]) {
                    groupedByMonth[monthYear] = {};
                }

                if (!groupedByMonth[monthYear][day]) {
                    groupedByMonth[monthYear][day] = [];
                }

                groupedByMonth[monthYear][day].push(multa);
            });

            Object.keys(groupedByMonth).forEach(monthYear => {
                const monthRow = document.createElement('tr');
                const monthCell = document.createElement('td');
                monthCell.colSpan = 8;
                monthCell.style.fontWeight = 'bold';
                monthCell.innerText = monthYear;
                monthRow.appendChild(monthCell);
                tbody.appendChild(monthRow);

                const days = ['07', '15', '30'];

                days.forEach(day => {
                    const dayRow = document.createElement('tr');

                    if (groupedByMonth[monthYear][day]) {
                        groupedByMonth[monthYear][day].forEach(multa => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${multa.placas}</td>
                                <td>${multa.serie}</td>
                                <td>${multa.marca}</td>
                                <td>${multa.modelo}</td>
                                <td>${multa.conductor}</td>
                                <td style="background-color: ${multa.multa ? 'red' : 'green'}">${multa.multa ? multa.costo : 'Sin Multa'}</td>
                            `;
                            tbody.appendChild(row);
                        });
                    } else {
                        dayRow.innerHTML = `
                            <td colspan="5">No hay registros para el día ${day}</td>
                        `;
                        tbody.appendChild(dayRow);
                    }
                });
            });
        })
        .catch(error => console.error('Error al cargar las multas:', error));
}
