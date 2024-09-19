let listaNombresGastos = [];
let listaValoresGastos = [];
let listaDetalleGastos = [];

function clickBoton() {
  const nombreGasto = document.getElementById("nombreGasto").value.trim();
  const valorGasto = parseFloat(document.getElementById("valorGasto").value.trim());
  const detalleGasto = document.getElementById("detalleGasto").value;
  const advertencia = document.getElementById("advertencia");

  if (validarEntradas(nombreGasto, valorGasto, detalleGasto)) {
    if (valorGasto > 150) {
      manejarGastoAlto(nombreGasto, valorGasto, detalleGasto, advertencia);
    } else {
      manejarGastoNormal(nombreGasto, valorGasto, detalleGasto);
    }
  } else {
    mostrarAdvertencia("Debes completar todos los campos", advertencia);
  }
}

function validarEntradas(nombreGasto, valorGasto, detalleGasto) {
  return nombreGasto !== "" && valorGasto > 0 && !isNaN(valorGasto) && detalleGasto !== "";
}

function mostrarAdvertencia(mensaje, advertencia) {
  const mensajeAdvertencia = `
    <label>${mensaje}</label>
    <button id="botonOk">Ok</button>`;
  advertencia.innerHTML = mensajeAdvertencia;

  document.getElementById("botonOk").addEventListener("click", () => {
    advertencia.innerHTML = "";
    limpiar();
  });
}

function manejarGastoAlto(nombreGasto, valorGasto, detalleGasto, advertencia) {
  const mensajeAdvertencia = `
    <label>Está ingresando un gasto alto, ¿está seguro?</label>
    <div>
      <button id="botonSi">Sí</button>
      <button id="botonNo">No</button>
    </div>`;
  advertencia.innerHTML = mensajeAdvertencia;

  document.getElementById("botonSi").addEventListener("click", () => {
    agregarGasto(nombreGasto, valorGasto, detalleGasto);
    advertencia.innerHTML = "";
  });

  document.getElementById("botonNo").addEventListener("click", () => {
    advertencia.innerHTML = "";
    limpiar();
  });
}

function manejarGastoNormal(nombreGasto, valorGasto, detalleGasto) {
  agregarGasto(nombreGasto, valorGasto, detalleGasto);
}

function agregarGasto(nombreGasto, valorGasto, detalleGasto) {
  listaNombresGastos.push(nombreGasto);
  listaValoresGastos.push(valorGasto);
  listaDetalleGastos.push(detalleGasto);
  actualizarListaGastos();
}

function actualizarListaGastos() {
  const listaElementos = document.getElementById("listaDeGastos");
  const totalElementos = document.getElementById("totalGastos");
  const containerBtnAcciones = document.getElementById("containerBtnAcciones");
  const containerLista = document.getElementById("containerLista");

  let totalGasto = 0;
  let htmlLista = "";
  listaNombresGastos.forEach((elemento, posicion) => {
    const valorGasto = Number(listaValoresGastos[posicion]);
    const detalleGasto = listaDetalleGastos[posicion];
    htmlLista += `<li>
      <div class="contenido-gasto">
        <span class="nombre-gasto">${elemento}</span><br>
        <span class="detalle-gasto">Detalle: ${detalleGasto}</span><br>
        <span class="valor-gasto">USD ${valorGasto.toFixed(2)}</span>
      </div>
      <input type="checkbox" class="checkbox-gasto" data-posicion="${posicion}" id="checkbox-${posicion}">
      <label for="checkbox-${posicion}"></label>
    </li>`;
    totalGasto += Number(valorGasto);
  });

  listaElementos.innerHTML = htmlLista;
  totalElementos.innerHTML = totalGasto.toFixed(2);

  // Mostrar u ocultar los botones de acción basado en si hay elementos en la lista
  if (listaNombresGastos.length > 0) {
    containerBtnAcciones.style.display = "flex";
    containerLista.style.display = "flex";
  } else {
    containerBtnAcciones.style.display = "none";
    containerLista.style.display = "none";
  }

  limpiar();
}

function limpiar() {
  document.getElementById("nombreGasto").value = "";
  document.getElementById("valorGasto").value = "";
  document.getElementById("detalleGasto").value = "";
}

function eliminarSeleccionados() {
  const checkboxes = document.querySelectorAll(".checkbox-gasto:checked");
  const posiciones = Array.from(checkboxes).map(checkbox => checkbox.getAttribute("data-posicion"));

  posiciones.forEach(posicion => {
    // Elimina el gasto de las listas
    listaNombresGastos.splice(posicion, 1);
    listaValoresGastos.splice(posicion, 1);
    listaDetalleGastos.splice(posicion, 1);
  });

  // Reordenar las listas
  listaNombresGastos = listaNombresGastos.filter((_, index) => !posiciones.includes(index.toString()));
  listaValoresGastos = listaValoresGastos.filter((_, index) => !posiciones.includes(index.toString()));
  listaDetalleGastos = listaDetalleGastos.filter((_, index) => !posiciones.includes(index.toString()));

  actualizarListaGastos();
}

function modificarSeleccionados() {
  const checkboxes = document.querySelectorAll(".checkbox-gasto:checked");
  const posiciones = Array.from(checkboxes).map(checkbox => checkbox.getAttribute("data-posicion"));

  if (posiciones.length === 1) {
    const posicion = posiciones[0]; 
    
    // Muestra un formulario con los datos del gasto en la posición seleccionada
    document.getElementById("nombreGasto").value = listaNombresGastos[posicion];
    document.getElementById("detalleGasto").value = listaDetalleGastos[posicion];
    document.getElementById("valorGasto").value = listaValoresGastos[posicion];
    
    // Cambiar el texto del botón a "Modificar Gasto"
    const botonFormulario = document.getElementById("botonFormulario");
    botonFormulario.textContent = "Modificar Gasto";
    botonFormulario.onclick = function() {
      // Actualiza el gasto con los nuevos valores ingresados
      listaNombresGastos[posicion] = document.getElementById("nombreGasto").value.trim();
      listaDetalleGastos[posicion] = document.getElementById("detalleGasto").value;
      listaValoresGastos[posicion] = parseFloat(document.getElementById("valorGasto").value.trim());
      actualizarListaGastos();

      // Restablecer el texto y el evento original del botón
      restablecerBotonFormulario();
    };
  } else if (posiciones.length > 1) {
    // Si hay más de un checkbox seleccionado, muestra una advertencia
    const advertencia = document.getElementById("advertencia");
    mostrarAdvertencia("Solo se puede modificar un ítem a la vez", advertencia);
  } else {
    // Si no hay ningún checkbox seleccionado, muestra otra advertencia
    const advertencia = document.getElementById("advertencia");
    mostrarAdvertencia("Seleccione un ítem para modificar", advertencia);
  }
}


function restablecerBotonFormulario() {
  const botonFormulario = document.getElementById("botonFormulario");
  botonFormulario.textContent = "Agregar Gasto";
  botonFormulario.onclick = clickBoton;
}

// Agregar event listener al botón "Eliminar Seleccionados"
document.getElementById("botonEliminarSeleccionados").addEventListener("click", eliminarSeleccionados);

// Agregar event listener al botón "Modificar Seleccionados"
document.getElementById("botonModificarSeleccionados").addEventListener("click", modificarSeleccionados);
