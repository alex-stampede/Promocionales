// Variables globales
const addButton = document.getElementById('addButton');
const promotionalCards = document.getElementById('promotionalCards');

// Cargar datos del localStorage al iniciar
window.onload = function() {
    const promociones = JSON.parse(localStorage.getItem('promocionales')) || [];
    promociones.forEach(promocion => {
        agregarTarjeta(promocion.name, promocion.quantity, promocion.unitCost);
    });
};

// Evento para agregar promocional
addButton.addEventListener('click', function() {
    const promotionalName = document.getElementById('promotionalName').value;
    const quantityBought = parseInt(document.getElementById('quantityBought').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);

    // Validación básica
    if (promotionalName && quantityBought && unitCost) {
        agregarTarjeta(promotionalName, quantityBought, unitCost);
        guardarPromocional(promotionalName, quantityBought, unitCost);
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
    let currentQuantity = parseInt(document.getElementById(`quantity-${name}`).innerText);

    if (cantidadRestar && cantidadRestar <= currentQuantity) {
        currentQuantity -= cantidadRestar;
        document.getElementById(`quantity-${name}`).innerText = currentQuantity;
        actualizarBarraProgreso(name, currentQuantity, originalQuantity);
        actualizarPromocionales(name, currentQuantity); // Actualizar localStorage
    } else {
        alert("Cantidad inválida o mayor a la disponible.");
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

// Función para eliminar la tarjeta
function eliminarTarjeta(name) {
    const card = document.querySelector(`.card:has(h2:contains('${name}'))`);
    if (card) {
        card.remove();
        eliminarPromocional(name); // Eliminar de localStorage
    }
}

// Función para guardar el promocional en localStorage
function guardarPromocional(name, quantity, unitCost) {
    const promociones = JSON.parse(localStorage.getItem('promocionales')) || [];
    promociones.push({ name, quantity, unitCost });
    localStorage.setItem('promocionales', JSON.stringify(promociones));
}

// Función para actualizar la cantidad en localStorage
function actualizarPromocionales(name, quantity) {
    const promociones = JSON.parse(localStorage.getItem('promocionales')) || [];
    const index = promociones.findIndex(prom => prom.name === name);
    if (index !== -1) {
        promociones[index].quantity = quantity;
        localStorage.setItem('promocionales', JSON.stringify(promociones));
    }
}

// Función para eliminar del localStorage
function eliminarPromocional(name) {
    let promociones = JSON.parse(localStorage.getItem('promocionales')) || [];
    promociones = promociones.filter(prom => prom.name !== name);
    localStorage.setItem('promocionales', JSON.stringify(promociones));
}
