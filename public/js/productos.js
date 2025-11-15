const API = "https://TU-API.onrender.com/api";

// ===========================
// Cargar productos
// ===========================
async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos`);
    const data = await res.json();

    const tbody = document.querySelector("#tablaProductos tbody");
    tbody.innerHTML = "";

    data.data.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.precio}</td>
        <td>${p.categoria_id}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarProducto(${p.id}, '${p.nombre}', ${p.precio}, ${p.categoria_id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Error cargando productos:", e);
  }
}

// ===========================
// Cargar categorías al select
// ===========================
async function cargarCategoriasSelect() {
  const res = await fetch(`${API}/categorias`);
  const data = await res.json();

  const select = document.querySelector("#productoCategoria");
  const selectEditar = document.querySelector("#editarProductoCategoria");

  select.innerHTML = "";
  selectEditar.innerHTML = "";

  data.data.forEach(cat => {
    select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
    selectEditar.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
  });
}

// ===========================
// Crear producto
// ===========================
document.querySelector("#formCrearProducto")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.querySelector("#productoNombre").value;
  const precio = document.querySelector("#productoPrecio").value;
  const categoria_id = document.querySelector("#productoCategoria").value;

  try {
    await fetch(`${API}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio, categoria_id })
    });

    cargarProductos();
    bootstrap.Modal.getInstance("#modalCrearProducto")?.hide();
    e.target.reset();
  } catch (e) {
    console.error("Error creando producto:", e);
  }
});

// ===========================
// Editar producto
// ===========================
function editarProducto(id, nombre, precio, categoria) {
  document.querySelector("#editarProductoId").value = id;
  document.querySelector("#editarProductoNombre").value = nombre;
  document.querySelector("#editarProductoPrecio").value = precio;
  document.querySelector("#editarProductoCategoria").value = categoria;

  new bootstrap.Modal(document.querySelector("#modalEditarProducto")).show();
}

document.querySelector("#formEditarProducto")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.querySelector("#editarProductoId").value;
  const nombre = document.querySelector("#editarProductoNombre").value;
  const precio = document.querySelector("#editarProductoPrecio").value;
  const categoria_id = document.querySelector("#editarProductoCategoria").value;

  try {
    await fetch(`${API}/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio, categoria_id })
    });

    cargarProductos();
    bootstrap.Modal.getInstance("#modalEditarProducto")?.hide();
  } catch (e) {
    console.error("Error editando producto:", e);
  }
});

// ===========================
// Eliminar producto
// ===========================
async function eliminarProducto(id) {
  if (!confirm("¿Eliminar producto?")) return;

  try {
    await fetch(`${API}/productos/${id}`, { method: "DELETE" });
    cargarProductos();
  } catch (e) {
    console.error("Error eliminando producto:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCategoriasSelect();
  cargarProductos();
});
