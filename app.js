// Variables globales
const addButton = document.getElementById('addButton');
const promotionalCards = document.getElementById('promotionalCards');

// Evento para agregar promocional
addButton.addEventListener('click', function() {
    const promotionalName = document.getElementById('promotionalName').value;
    const quantityBought = parseInt(document.getElementById('quantityBought').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);

    // Validación básica
    if (promotionalName && quantityBought && unitCost) {
        agregarTarjeta(promotionalName, quantityBought, unitCost);
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
        <div class="movement-history" id="history-${name}"></div>
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
        agregarMovimiento(name, concepto, cantidadRestar);
    } else {
        alert("Cantidad inválida o mayor a la disponible.");
    }
}

// Función para agregar movimiento al historial
function agregarMovimiento(name, concepto, cantidadRestar) {
    const movimientoCard = document.createElement('div');
    movimientoCard.className = 'card';
    movimientoCard.innerHTML = `
        <p>Concepto: ${concepto}</p>
        <p>Cantidad Restada: ${cantidadRestar}</p>
    `;
    document.getElementById(`history-${name}`).appendChild(movimientoCard);
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

// Función para eliminar la tarjeta
function eliminarTarjeta(name) {
    const card = document.querySelector(`.card:has(h2:contains('${name}'))`);
    if (card) {
        card.remove();
    }
}

