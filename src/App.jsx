import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- MEMORIA DEL COMPONENTE (ESTADOS) ---
  // useState nos permite guardar datos que pueden cambiar en la pantalla
  const [recetas, setRecetas] = useState([]); // Lista de recetas que traeremos de internet
  const [cargando, setCargando] = useState(true); // Para saber si estamos esperando la respuesta
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null); // Receta que el usuario quiere ver en detalle

  // --- PEDIR DATOS A INTERNET (API) ---
  // useEffect corre este código automáticamente cuando se abre la página
  useEffect(() => {
    // Usamos fetch para conectarnos a la API gratuita de TheMealDB
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken')
      .then((respuesta) => respuesta.json()) // Convertimos la respuesta a un formato legible por JS
      .then((datos) => {
        setRecetas(datos.meals || []); // Guardamos las recetas en nuestra memoria
        setCargando(false); // Avisamos que ya terminó de cargar
      })
      .catch((error) => {
        console.error("Hubo un problema con la API:", error);
        setCargando(false);
      });
  }, []); // El corchete vacío [] hace que esto solo pase una vez al inicio

  // --- FUNCIONES PARA EL MODAL ---
  const abrirModal = (receta) => setRecetaSeleccionada(receta);
  const cerrarModal = () => setRecetaSeleccionada(null);

  // Esta función sirve para limpiar la lista de ingredientes que nos da la API
  const obtenerIngredientes = (receta) => {
    let lista = [];
    for (let i = 1; i <= 20; i++) {
      const nombre = receta[`strIngredient${i}`];
      const medida = receta[`strMeasure${i}`];
      // Si el ingrediente existe, lo guardamos en nuestra lista propia
      if (nombre && nombre.trim() !== "") {
        lista.push(`${nombre} (${medida})`);
      }
    }
    return lista;
  };

  // --- DATOS LOCALES (PRODUCTOS) ---
  const productos = [
    { id: 1, nombre: "Arroz Súper", precio: "$12.000", img: "img/arroz.jpg" },
    { id: 2, nombre: "Frijoles Rojos", precio: "$8.500", img: "img/frijoles.jpg" },
    { id: 3, nombre: "Aceite de Oliva", precio: "$15.000", img: "img/aceite.jpg" }
  ];

  return (
    <div className="App">
      {/* 1. ENCABEZADO */}
      <header className="header-principal">
        <div className="container">
          <h1>🏠 Mi Casita</h1>
          <p>Tu tienda de confianza, ¡siempre a tu lado!</p>
        </div>
      </header>

      {/* 2. MENU DE NAVEGACION */}
      <nav className="navbar">
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#productos">Productos</a></li>
          <li><a href="#recetas">Recetas</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>

      <div className="container">
        <main>
          {/* SECCION: BIENVENIDA */}
          <section id="inicio" className="section-card">
            <h2>Sobre Nosotros</h2>
            <p>En <strong>Mi Casita</strong> llevamos más de 15 años ofreciendo productos de calidad a precios justos. Somos una tienda familiar que cree en el trato cercano y en la frescura de los alimentos. Nuestro objetivo es que encuentres todo lo que necesitas para tu hogar en un solo lugar.</p>
            <div className="featured-image">
              <img src="/img/tienda-interior.jpg" alt="Local Tienda" />
            </div>
            <p>Visítanos y descubre la calidez de un negocio local. ¡Te esperamos con los brazos abiertos!</p>
          </section>

          {/* SECCION: PRODUCTOS */}
          <section id="productos" className="section-card">
            <h2>Productos del Mes</h2>
            <div className="grid-items">
              {productos.map((prod) => (
                <div key={prod.id} className="item-card">
                  <img src={"/" + prod.img} alt={prod.nombre} />
                  <h3>{prod.nombre}</h3>
                  <p className="precio">{prod.precio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECCION: RECETAS (API) */}
          <section id="recetas" className="section-card">
            <h2>Ideas para Cocinar (API)</h2>
            {cargando ? (
              <p>Buscando recetas deliciosas...</p>
            ) : (
              <div className="grid-items">
                {recetas.slice(0, 4).map((receta) => (
                  <div key={receta.idMeal} className="item-card">
                    <img src={receta.strMealThumb} alt="Platillo" />
                    <h3>{receta.strMeal}</h3>
                    <button className="btn-primary" onClick={() => abrirModal(receta)}>
                      Ver Receta
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECCION: CONTACTO */}
          <section id="contacto" className="section-card">
            <h2>Contacto</h2>
            <p>📍 Dirección: Calle 5 # 22-20, Centro, Pereira</p>
            <p>📞 Teléfono: +57 312 345 6789</p>
            <p>✉️ Email: contacto@micasita.com</p>
            <p>🕒 Horario: Lunes a sábado de 7:00 a.m. a 9:00 p.m.</p>
          </section>
        </main>
      </div>

      {/* 4. MODAL DE DETALLES */}
      {recetaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={cerrarModal}>&times;</button>
            <div className="modal-body">
              <img src={recetaSeleccionada.strMealThumb} alt="Comida" className="modal-img-large" />
              <h2>{recetaSeleccionada.strMeal}</h2>
              <p><strong>Clasificación:</strong> {recetaSeleccionada.strCategory}</p>
              
              <h4>Ingredientes Necesarios:</h4>
              <ul>
                {obtenerIngredientes(recetaSeleccionada).map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <h4>Cómo preparar:</h4>
              <p className="instrucciones-texto">{recetaSeleccionada.strInstructions}</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. PIE DE PAGINA */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Tienda de Abarrotes "Mi Casita". Todos los derechos reservados.</p>
          <p>Síguenos en <a href="#!">Facebook</a> | <a href="#!">Instagram</a> | <a href="#!">Twitter</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;
