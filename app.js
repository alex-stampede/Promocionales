// Variables globales
const addButton = document.getElementById('addButton');
const promotionalCards = document.getElementById('promotionalCards');
const historyCards = document.getElementById('historyCards');

// Cargar datos del almacenamiento local al cargar la página
window.onload = function() {
    const promotionalData = JSON.parse(localStorage.getItem('promotionalData')) || [];
    const historyData = JSON.parse(localStorage.getItem('historyData')) || [];

    promotionalData.forEach(item => agregarTarjeta(item.name, item.quantity, item.unitCost));
    historyData.forEach(item => agregarHistorial(item.concept, item.quantity));
};

// Evento para agregar promocional
addButton.addEventListener('click', function() {
    const promotionalName = document.getElementById('promotionalName').value;
    const quantityBought = parseInt(document.getElementById('quantityBought').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);

    // Validación básica
    if (promotionalName && quantityBought && unitCost) {
        agregarTarjeta(promotionalName, quantityBought, unitCost);
        guardarDatosLocalmente();
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Función para agregar la tarjeta a la interfaz
function agregarTarjeta(name, quantity, unitCost) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <h2>${name}</h2>
        <p>Cantidad disponible: <span id="quantity-${name}">${quantity}</span></p>
        <input type="number" id="restar-${name}" placeholder="Cantidad a restar">
        <input type="text" id="concept-${name}" placeholder="Concepto">
        <button onclick="restarCantidad('${name}', ${quantity})">Restar</button>
        <div class="progress-bar" id="progress-${name}"></div>
        <p>Costo unitario: $${unitCost}</p>
        <div class="card-buttons">
            <button onclick="eliminarTarjeta('${name}')">Eliminar</button>
        </div>
    `;

    promotionalCards.appendChild(card);
    actualizarBarraProgreso(name, quantity, quantity);
}

// Función para restar cantidad
function restarCantidad(name, originalQuantity) {
    const cantidadRestar = parseInt(document.getElementById(`restar-${name}`).value);
    const concepto = document.getElementById(`concept-${name}`).value;
    let currentQuantity = parseInt(document.getElementById(`quantity-${name}`).innerText);

    if (cantidadRestar && cantidadRestar <= currentQuantity) {
        currentQuantity -= cantidadRestar;
        document.getElementById(`quantity-${name}`).innerText = currentQuantity;
        actualizarBarraProgreso(name, currentQuantity, originalQuantity);
        
        // Agregar al historial
        agregarHistorial(concepto, cantidadRestar);
        guardarDatosLocalmente();
    } else {
        alert("Cantidad inválida o mayor a la disponible.");
    }
}

// Función para agregar al historial
function agregarHistorial(concept, quantity) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <h3>${concept}</h3>
        <p>Cantidad restada: ${quantity}</p>
    `;

    historyCards.appendChild(card);
}

// Función para guardar datos en localStorage
function guardarDatosLocalmente() {
    const promotionalData = [];
    const historyData = [];

    document.querySelectorAll('.card').forEach(card => {
        const name = card.querySelector('h2') ? card.querySelector('h2').innerText : '';
        const quantity = parseInt(card.querySelector(`span[id^="quantity-"]`).innerText);
        const unitCost = parseFloat(card.querySelector('p:last-child').innerText.replace(/[^0-9.-]+/g, ""));
        promotionalData.push({ name, quantity, unitCost });
    });

    document.querySelectorAll('#historyCards .card').forEach(card => {
        const concept = card.querySelector('h3').innerText;
        const quantity = parseInt(card.querySelector('p').innerText.split(': ')[1]);
        historyData.push({ concept, quantity });
    });

    localStorage.setItem('promotionalData', JSON.stringify(promotionalData));
    localStorage.setItem('historyData', JSON.stringify(historyData));
}

// Función para eliminar la tarjeta
function eliminarTarjeta(name) {
    const card = document.querySelector(`.card:has(h2:contains('${name}'))`);
    if (card) {
        card.remove();
        guardarDatosLocalmente(); // Guardar cambios
    }
}

// Función para actualizar la barra de progreso
function actualizarBarraProgreso(name, currentQuantity, originalQuantity) {
    const progressBar = document.getElementById(`progress-${name}`);
    const percentage = (currentQuantity / originalQuantity) * 100;
    progressBar.style.width = `${percentage}%`;

    if (percentage > 50) {
        progressBar.style.background = 'green';
    } else if (percentage > 20) {
        progressBar.style.background = 'yellow';
    } else {
        progressBar.style.background = 'red';
    }
}
