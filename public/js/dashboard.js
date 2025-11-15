// URL base de tu API local o Render
const API = "http://localhost:3000/api";

// Función para hacer peticiones
async function fetchCount(endpoint) {
  try {
    const res = await fetch(`${API}/${endpoint}`);
    const data = await res.json();
    return data.data.length; // contar resultados
  } catch (e) {
    console.error("Error en dashboard:", e);
    return 0;
  }
}

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("countCategorias").innerText = await fetchCount("categorias");
  document.getElementById("countProductos").innerText = await fetchCount("productos");
  document.getElementById("countIngredientes").innerText = await fetchCount("ingredientes");
  document.getElementById("countPI").innerText = await fetchCount("producto-ingrediente");
});