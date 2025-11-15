const API = "https://practicafinalweb.onrender.com/api/ingredientes"; // ← CAMBIAR ESTO

async function cargarIngredientes() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    const tbody = document.querySelector("#tablaIngredientes tbody");
    tbody.innerHTML = "";

    data.data.forEach(ing => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ing.id}</td>
        <td>${ing.nombre}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarIngrediente(${ing.id}, '${ing.nombre}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarIngrediente(${ing.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (e) {
    console.error("Error cargando ingredientes:", e);
  }
}

// Crear
document.querySelector("#formCrearIngrediente")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.querySelector("#ingredienteNombre").value;

  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre })
    });

    cargarIngredientes();
    bootstrap.Modal.getInstance("#modalCrearIngrediente")?.hide();
    e.target.reset();
  } catch (e) {
    console.error("Error creando ingrediente:", e);
  }
});

// Editar
function editarIngrediente(id, nombre) {
  document.querySelector("#editarIngredienteId").value = id;
  document.querySelector("#editarIngredienteNombre").value = nombre;

  new bootstrap.Modal(document.querySelector("#modalEditarIngrediente")).show();
}

document.querySelector("#formEditarIngrediente")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.querySelector("#editarIngredienteId").value;
  const nombre = document.querySelector("#editarIngredienteNombre").value;

  try {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre })
    });

    cargarIngredientes();
    bootstrap.Modal.getInstance("#modalEditarIngrediente")?.hide();
  } catch (e) {
    console.error("Error editando ingrediente:", e);
  }
});

// Eliminar
async function eliminarIngrediente(id) {
  if (!confirm("¿Eliminar ingrediente?")) return;

  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    cargarIngredientes();
  } catch (e) {
    console.error("Error eliminando ingrediente:", e);
  }
}

document.addEventListener("DOMContentLoaded", cargarIngredientes);