// Importa las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAmQ9iS2AmXQvSbbC6zzVzF0GFfNFfSQ9k",
  authDomain: "promocionales-aspelab.firebaseapp.com",
  projectId: "promocionales-aspelab",
  storageBucket: "promocionales-aspelab.appspot.com",
  messagingSenderId: "290478011011",
  appId: "1:290478011011:web:85d907925a5d663d4fa1b6",
  measurementId: "G-RQ30ZGG9KK"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variables globales
const addButton = document.getElementById('addButton');
const promotionalCards = document.getElementById('promotionalCards');

// Evento para agregar promocional
addButton.addEventListener('click', async function() {
    const promotionalName = document.getElementById('promotionalName').value;
    const quantityBought = parseInt(document.getElementById('quantityBought').value);
    const unitCost = parseFloat(document.getElementById('unitCost').value);
    const totalCost = quantityBought * unitCost;

    // Validación básica
    if (promotionalName && quantityBought && unitCost) {
        try {
            // Guardar en Firebase
            const docRef = await addDoc(collection(db, "promocionales"), {
                name: promotionalName,
                quantity: quantityBought,
                originalQuantity: quantityBought,
                unitCost: unitCost,
                totalCost: totalCost
            });
            console.log("Promocional agregado con ID: ", docRef.id);
            agregarTarjeta(docRef.id, promotionalName, quantityBought, unitCost, totalCost);
        } catch (error) {
            console.error("Error al agregar el documento: ", error);
        }
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Función para agregar la tarjeta a la interfaz
function agregarTarjeta(id, name, quantity, unitCost, totalCost) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = id;

    card.innerHTML = `
        <h2>${name}</h2>
        <p>Cantidad disponible: <span id="quantity-${id}">${quantity}</span></p>
        <input type="number" id="restar-${id}" placeholder="Cantidad a restar">
        <button onclick="restarCantidad('${id}', ${quantity})">Restar</button>
        <div class="progress-bar" id="progress-${id}"></div>
        <p>Costo unitario: $${unitCost}</p>
        <button onclick="eliminarTarjeta('${id}')">Eliminar</button>
    `;

    promotionalCards.appendChild(card);
    actualizarBarraProgreso(id, quantity, quantity);
}

// Función para restar cantidad
async function restarCantidad(id, originalQuantity) {
    const cantidadRestar = parseInt(document.getElementById(`restar-${id}`).value);
    let currentQuantity = parseInt(document.getElementById(`quantity-${id}`).innerText);

    if (cantidadRestar && cantidadRestar <= currentQuantity) {
        currentQuantity -= cantidadRestar;

        // Actualizar la cantidad en Firebase
        try {
            await updateDoc(doc(db, "promocionales", id), {
                quantity: currentQuantity
            });
            document.getElementById(`quantity-${id}`).innerText = currentQuantity;
            actualizarBarraProgreso(id, currentQuantity, originalQuantity);
        } catch (error) {
            console.error("Error al actualizar la cantidad: ", error);
        }
    } else {
        alert("Cantidad inválida o mayor a la disponible.");
    }
}

// Función para actualizar la barra de progreso
function actualizarBarraProgreso(id, currentQuantity, originalQuantity) {
    const progressBar = document.getElementById(`progress-${id}`);
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
async function eliminarTarjeta(id) {
    // Eliminar de Firebase
    try {
        await deleteDoc(doc(db, "promocionales", id));
        console.log("Promocional eliminado con éxito.");
        document.getElementById(id).remove();
    } catch (error) {
        console.error("Error al eliminar el documento: ", error);
    }
}

// Obtener los datos de Firebase al cargar la página
window.onload = async function() {
    const querySnapshot = await getDocs(collection(db, "promocionales"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        agregarTarjeta(doc.id, data.name, data.quantity, data.unitCost, data.totalCost);
    });
}
