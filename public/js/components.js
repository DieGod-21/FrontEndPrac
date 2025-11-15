export async function loadComponent(id, file) {
  const container = document.getElementById(id);
  if (!container) return;

  try {
    const resp = await fetch(file);
    const html = await resp.text();
    container.innerHTML = html;
  } catch (err) {
    console.error("Error cargando componente", file, err);
  }
}