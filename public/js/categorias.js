const API = "https://practicafinalweb.onrender.com/api/categorias"; // ← CAMBIAR ESTO

const tablaBody = document.getElementById("tablaCategorias");
const formCategoria = document.getElementById("formCategoria");
const modal = new bootstrap.Modal(document.getElementById("modalCategoria"));

let editId = null;

// ============================
// CARGAR CATEGORÍAS
// ============================
async function cargarCategorias() {
  tablaBody.innerHTML = `
    <tr><td colspan="4" class="text-center">Cargando...</td></tr>
  `;

  try {
    const res = await fetch(API);
    const data = await res.json();

    tablaBody.innerHTML = "";

    data.data.forEach(cat => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${cat.id}</td>
        <td>${cat.nombre}</td>
        <td>${cat.created_at}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarCategoria(${cat.id}, '${cat.nombre}')">
            Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="eliminarCategoria(${cat.id})">
            Eliminar
          </button>
        </td>
      `;

      tablaBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error cargando categorías:", error);
    tablaBody.innerHTML = `
      <tr><td colspan="4" class="text-center text-danger">Error cargando datos</td></tr>
    `;
  }
}

// ============================
// ABRIR MODAL PARA EDITAR
// ============================
window.editarCategoria = function (id, nombre) {
  editId = id;

  formCategoria.nombre.value = nombre;
  modal.show();
};

// ============================
// GUARDAR (CREAR O EDITAR)
// ============================
formCategoria.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = formCategoria.nombre.value;

  const data = { nombre };

  try {
    let res;

    if (editId) {
      // EDITAR
      res = await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // CREAR
      res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const result = await res.json();

    if (!res.ok) {
      alert("Error: " + result.message);
      return;
    }

    modal.hide();
    formCategoria.reset();
    editId = null;

    cargarCategorias();

  } catch (error) {
    console.error("Error guardando:", error);
  }
});

// ============================
// ELIMINAR CATEGORÍA
// ============================
window.eliminarCategoria = async function (id) {
  if (!confirm("¿Seguro de eliminar esta categoría?")) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Error: " + data.message);
      return;
    }

    cargarCategorias();

  } catch (error) {
    console.error("Error eliminando:", error);
  }
};

// ============================
// INICIALIZAR
// ============================
document.addEventListener("DOMContentLoaded", cargarCategorias);
