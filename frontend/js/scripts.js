document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('menuInicio').addEventListener('click', loadInicio);
    document.getElementById('menuAgregarConductor').addEventListener('click', loadAgregarConductor);
    document.getElementById('menuConsultarMultas').addEventListener('click', loadConsultarMultas);
    document.getElementById('menuVehiculosAgregados').addEventListener('click', loadVehiculosAgregados);
    document.getElementById('menuFechasDeServicio').addEventListener('click', loadFechasDeServicio);

    // Cargar la vista de inicio por defecto
    loadInicio();
});

function loadInicio() {
    document.getElementById('mainContent').innerHTML = `
        <div class="chart-container">
            <canvas id="conductorMultasChart" width="300" height="300"></canvas>
            <canvas id="conductorNoMultasChart" width="300" height="300"></canvas>
        </div>
    `;
    loadCharts();
}

function loadAgregarConductor() {
    document.getElementById('mainContent').innerHTML = `
        <h1>Administración Vehicular</h1>
        <h2>Agregar Conductor</h2>
        <form id="agregarConductorForm" enctype="multipart/form-data" class="ios-form">
            <label for="placas">Placas:</label>
            <input type="text" id="placas" name="placas" required>
            <label for="serie">Serie:</label>
            <input type="text" id="serie" name="serie" required>
            <label for="marca">Marca:</label>
            <input type="text" id="marca" name="marca" required>
            <label for="modelo">Modelo:</label>
            <input type="text" id="modelo" name="modelo" required>
            <label for="nombreConductor">Nombre del Conductor:</label>
            <input type="text" id="nombreConductor" name="nombreConductor" required>
            <label for="fotoUnidad">Foto de la Unidad (opcional):</label>
            <input type="file" id="fotoUnidad" name="fotoUnidad" accept="image/*">
            <button type="submit" class="ios-button">Guardar</button>
        </form>
    `;
    document.getElementById('agregarConductorForm').addEventListener('submit', agregarConductor);
}

function agregarConductor(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetch('http://localhost:3000/api/conductores', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar conductor');
        }
        return response.json();
    })
    .then(data => {
        alert('Conductor agregado exitosamente');
        e.target.reset();
        loadVehiculosAgregados();  // Recargar la lista de vehículos agregados
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al agregar conductor');
    });
}

function loadVehiculosAgregados() {
    document.getElementById('mainContent').innerHTML = `
        <h1>Vehículos Agregados</h1>
        <table>
            <thead>
                <tr>
                    <th>Placas</th>
                    <th>Serie</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Nombre del Conductor</th>
                    <th>Foto de la Unidad</th>
                    <th>Editar</th>
                </tr>
            </thead>
            <tbody id="vehiculosTable">
                <!-- Filas dinámicas aquí -->
            </tbody>
        </table>
    `;
    loadVehiculos();
}

function loadVehiculos() {
    fetch('http://localhost:3000/api/conductores')
    .then(response => response.json())
    .then(conductores => {
        const tableBody = document.getElementById('vehiculosTable');
        tableBody.innerHTML = '';
        
        conductores.forEach(conductor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${conductor.placas}</td>
                <td>${conductor.serie}</td>
                <td>${conductor.marca}</td>
                <td>${conductor.modelo}</td>
                <td>${conductor.nombreConductor}</td>
                <td>${conductor.fotoUnidad ? `<img src="${conductor.fotoUnidad}" alt="Foto de la Unidad" width="100">` : 'No disponible'}</td>
                <td><button class="ios-button blue" onclick="editarVehiculo('${conductor.placas}')">Editar</button></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error al cargar los vehículos:', error));
}

function loadConsultarMultas() {
    document.getElementById('mainContent').innerHTML = `
        <h1>Consultar Multas</h1>
        <form id="consultarMultasForm" class="ios-form">
            <label for="conductor">Conductor:</label>
            <select id="conductor" name="conductor"></select>
            <label for="fechaMulta">Fecha de la Multa:</label>
            <input type="text" id="fechaMulta" name="fechaMulta" placeholder="dd/mm/aaaa">
            <div class="button-group">
                <button type="button" class="ios-button green" id="sinMultaButton">Sin Multa</button>
                <button type="button" class="ios-button red" id="conMultaButton">Con Multa</button>
                <button type="button" class="ios-button yellow" id="verMultasButton">Ver Multas</button>
            </div>
        </form>
    `;

    loadConductores();

    document.getElementById('sinMultaButton').addEventListener('click', function() {
        alert('Sin Multa');
    });

    document.getElementById('conMultaButton').addEventListener('click', function() {
        showModal('Con Multa', ['Costo Multa:', 'Observaciones:'], guardarMulta);
    });

    document.getElementById('verMultasButton').addEventListener('click', function() {
        window.open('multas.html', '_blank');
    });

    flatpickr('#fechaMulta', {
        dateFormat: 'd/m/Y',
    });
}

function loadConductores() {
    fetch('http://localhost:3000/api/conductores')
        .then(response => response.json())
        .then(conductores => {
            const select = document.getElementById('conductor');
            conductores.forEach(conductor => {
                const option = document.createElement('option');
                option.value = conductor.nombreConductor;
                option.textContent = `${conductor.nombreConductor} (${conductor.placas})`;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los conductores:', error));
}

function showModal(title, fields, onSave) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        modal.remove();
    });

    modalContent.innerHTML = `<h2>${title}</h2>`;
    fields.forEach(field => {
        const fieldElement = document.createElement('div');
        fieldElement.innerHTML = `<label>${field}</label> <input type="text" class="modal-input">`;
        modalContent.appendChild(fieldElement);
    });

    const modalActions = document.createElement('div');
    modalActions.classList.add('modal-actions');
    
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Agregar';
    saveButton.classList.add('ios-button', 'green');
    saveButton.addEventListener('click', function() {
        const inputs = modalContent.querySelectorAll('.modal-input');
        const data = {};
        fields.forEach((field, index) => {
            data[field.replace(':', '').trim().toLowerCase()] = inputs[index].value;
        });
        onSave(data);
        modal.remove();
    });

    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancelar';
    cancelButton.classList.add('ios-button', 'red');
    cancelButton.addEventListener('click', function() {
        modal.remove();
    });

    modalActions.appendChild(saveButton);
    modalActions.appendChild(cancelButton);

    modalContent.appendChild(modalActions);

    modal.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modal.remove();
        }
    });
}

function guardarMulta(data) {
    const conductor = document.getElementById('conductor').value;
    const fechaMulta = document.getElementById('fechaMulta').value;

    data.conductor = conductor;
    data.fecha = fechaMulta;

    fetch('http://localhost:3000/api/multas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la multa');
        }
        alert('Multa guardada exitosamente');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar la multa');
    });
}

function loadCharts() {
    const conductorMultasData = {
        labels: ['Con Multas', 'Sin Multas'],
        datasets: [{
            label: 'Conductores con Multas',
            data: [12, 8],
            backgroundColor: ['red', 'green']
        }]
    };

    const conductorNoMultasData = {
        labels: ['Sin Multas', 'Con Multas'],
        datasets: [{
            label: 'Conductores sin Multas',
            data: [8, 12],
            backgroundColor: ['green', 'red']
        }]
    };

    const ctxMultas = document.getElementById('conductorMultasChart').getContext('2d');
    new Chart(ctxMultas, {
        type: 'pie',
        data: conductorMultasData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Conductores con Multas'
                }
            }
        }
    });

    const ctxNoMultas = document.getElementById('conductorNoMultasChart').getContext('2d');
    new Chart(ctxNoMultas, {
        type: 'pie',
        data: conductorNoMultasData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Conductores sin Multas'
                }
            }
        }
    });
}

function editarVehiculo(placas) {
    // Lógica para editar el vehículo
}
