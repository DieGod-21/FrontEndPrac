const API = "https://practicafinalweb.onrender.com/api/producto_ingrediente"; // ← CAMBIAR ESTO

// ===========================
// Cargar relaciones
// ===========================
async function cargarRelaciones() {
  try {
    const res = await fetch(`${API}/producto-ingrediente`);
    const data = await res.json();

    const tbody = document.querySelector("#tablaPI tbody");
    tbody.innerHTML = "";

    data.data.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.producto_id}</td>
        <td>${r.ingrediente_id}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminarRelacion(${r.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Error cargando relaciones:", e);
  }
}

// ===========================
// Cargar selects
// ===========================
async function cargarSelects() {
  const productos = await fetch(`${API}/productos`).then(r => r.json());
  const ingredientes = await fetch(`${API}/ingredientes`).then(r => r.json());

  const selProd = document.querySelector("#relProducto");
  const selIng = document.querySelector("#relIngrediente");

  productos.data.forEach(p => {
    selProd.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
  });

  ingredientes.data.forEach(i => {
    selIng.innerHTML += `<option value="${i.id}">${i.nombre}</option>`;
  });
}

// ===========================
// Crear relación
// ===========================
document.querySelector("#formCrearRelacion")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto_id = document.querySelector("#relProducto").value;
  const ingrediente_id = document.querySelector("#relIngrediente").value;

  try {
    await fetch(`${API}/producto-ingrediente`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto_id, ingrediente_id })
    });

    cargarRelaciones();
    bootstrap.Modal.getInstance("#modalCrearRelacion")?.hide();
    e.target.reset();
  } catch (e) {
    console.error("Error creando relación:", e);
  }
});

// ===========================
// Eliminar relación
// ===========================
async function eliminarRelacion(id) {
  if (!confirm("¿Eliminar relación?")) return;

  try {
    await fetch(`${API}/producto-ingrediente/${id}`, { method: "DELETE" });
    cargarRelaciones();
  } catch (e) {
    console.error("Error eliminando relación:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarSelects();
  cargarRelaciones();
});