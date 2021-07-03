// variables
let idTarea = 0;
let arrayTarea = [];
let arrayVacio = [];
const tarjetasTareas = document.getElementById("main-cards-wrap");
const dataInicial = JSON.parse(localStorage.getItem("lista de tareas"));
const formAgregarTarea = document.getElementById("formularioAgregarTarea");

//objeto principal
class Tarea {
  constructor(id, estado, color, titular, contenido, destacado, borde) {
    this.id = id;
    this.estado = estado;
    this.color = color;
    this.titular = titular;
    this.contenido = contenido;
    this.destacado = destacado;
    this.borde = borde;
  }
  eliminarTarea() {
    this.estado = false;
  }
  editarContenido(a, b) {
    this.titular = a;
    this.contenido = b;
  }
  destacar() {
    this.destacado = true;
  }
  quitarDestacado() {
    this.destacado = false;
  }
  cambiarColor(a) {
    this.color = a;
  }
  cambiarBorde(a) {
    this.borde = a;
  }
}

// funciones principales
function renderTareas(tareas) {
  tarjetasTareas.innerHTML = "";
  for (const objeto of tareas) {
    let contenedor = document.createElement("div");
    contenedor.classList.add("tarea-wrap");
    contenedor.style.borderColor = `${objeto.borde}`;
    contenedor.style.backgroundColor = `${objeto.color}`; //se setean colores por defecto y se anclan al objeto tarea
    contenedor.id = objeto.id;
    contenedor.destacado = false;
    contenedor.innerHTML = `
                            <div class="title-cards">
                            <h2>${objeto.titular}</h2>
                            </div>
                            <div class="tarea-content"><p class="contentTasks" id="edi${objeto.id}">${objeto.contenido}</p></div>
                        <div class="tools">
                        <ul>

                            <li class="cestoBasura"><span><img src="https://image.flaticon.com/icons/png/512/105/105090.png"></span></li>
                            <li  class="estrella"><span><img id='estrella${objeto.id}' src="https://image.flaticon.com/icons/png/512/616/616821.png"></span></li>
                            <li  class="color-selection"><span><img id="cs${objeto.id}" src="https://image.flaticon.com/icons/png/512/274/274355.png"></span></li> 
                            <div class="color-menu" id="cmenu${objeto.id}">
                                                             <img  src="firstColor.png" <input class="tarea-color" id="colorF${objeto.id}" type="button" value="red">
                                                             <img  src="secondColor.png" <input class="tarea-color" id="colorS${objeto.id}" type="button" value="blue">                                                                                                   
                                                             <img  src="thirdColor.png" <input class="tarea-color" id="colorT${objeto.id}" type="button" value="green">                                                                                                   

                                                                                                                                                            </div>
                                                                                                                                                               
                        </ul>
                        </div>
                            `;
    //en color selection, en el evento click tomaba como target la etiqueta Img.
    tarjetasTareas.appendChild(contenedor);
  }
  escucharEliminarTarea();
  escucharDestacadoTareas();
  escucharEditarTareas();
  escucharCambiarColores();
  //aqui se llama a las funciones asociados al render de las tareas, dependientes del render en el dom.
}

formAgregarTarea.addEventListener("submit", manejadorAgregarTarea);
function manejadorAgregarTarea(e) {
  e.preventDefault();
  const titular = formAgregarTarea.children[0].value;
  const contenido = formAgregarTarea.children[1].value;
  crearTarea(titular, contenido);
  formAgregarTarea.children[0].value = "";
  formAgregarTarea.children[1].value = "";
}

const crearTarea = (titular, contenido) => {
  //modificamos la funcion para que reciba parametros, la vamos a invocar despues con los datos obtenidos del formulario
  idTarea = arrayTarea.length ? arrayTarea[arrayTarea.length - 1].id + 1 : 1; //arreglamos id, para que sea diferente siempre incluso cuando se recargue la página
  const tarea = new Tarea(
    idTarea,
    true,
    "blanco",
    titular,
    contenido,
    false,
    "blanco"
  ); //usamos los parametros aquí titular y contenido
  arrayTarea.push(tarea);
  guardarLocalStorage();
  renderTareas(arrayTarea);
};

const mostrarTareas = () => {
  if (dataInicial) {
    // esta funcion muestra las tareas cuando el usuario recarga la pagina o vuelve despues de cerrarla.
    for (const tarea of dataInicial) {
      const InstanciaTarea = new Tarea(
        tarea.id,
        tarea.estado,
        tarea.color,
        tarea.titular,
        tarea.contenido,
        tarea.destacado,
        tarea.borde
      );
      arrayTarea.push(InstanciaTarea);
    }
    renderTareas(arrayTarea);
  }
}

function escucharEliminarTarea() {
  const botonesEliminarTarea = document.getElementsByClassName("cestoBasura");
  for (const boton of botonesEliminarTarea) {
    boton.addEventListener("click", eliminarCard);
  }
}

const eliminarCard = (e) => {
  const cardSeleccionada =
    e.target.parentElement.parentElement.parentElement.parentElement
      .parentElement; //Como hay varios elementos padres , con esto buscamos al contenedor principal, tarea wrap
  cardSeleccionada.remove();
  idTareaDOM = cardSeleccionada.id;
  arrayTarea = arrayTarea.filter((tarea) => tarea.id != idTareaDOM); //guardamos en el array la nueva info de tareas que quedan
  guardarLocalStorage();
};

const guardarLocalStorage = () => {
  localStorage.setItem("lista de tareas", JSON.stringify(arrayTarea));
};

const escucharDestacadoTareas = () => {
  const botonesDestacarTarea = document.getElementsByClassName("estrella");

  for (const boton of botonesDestacarTarea) {
    boton.addEventListener("click", manejadorDestacadoTareas);
  }
};

const manejadorDestacadoTareas = (e) => {
  const colorDestacado = "var(--highlight-color)";

  const tareaAEditar = arrayTarea.find(
    (tarea) => `estrella${tarea.id}` == e.target.id
  );

  if (tareaAEditar.destacado == false) {
    tareaAEditar.destacar();
    tareaAEditar.cambiarBorde(colorDestacado);
    guardarLocalStorage();
  } else if (tareaAEditar.destacado == true) {
    tareaAEditar.quitarDestacado();
    tareaAEditar.cambiarBorde("blanco");
    guardarLocalStorage();
  }
  //esta funcion sirve para destacar o sacar el destacado de las tareas usando el mismo boton.
  renderTareas(JSON.parse(localStorage.getItem("lista de tareas"))); // pinta las tareas de nuevo, sobreescribriendo lo que antes habia.
};

const escucharEditarTareas = () => {
  $(".contentTasks").click(function CrearModal(e) {
    const tareaAEditar = arrayTarea.find(
      (tarea) => `edi${tarea.id}` == e.target.id
    );
    $("body").append(`<form class="modal-wrap" id='form${e.target.id}'>
        <input type="text"  placeholder = "titular..." value = "${tareaAEditar.titular}"> 
        <input type="text"  placeholder="contenido..." value = "${tareaAEditar.contenido}">
        <input type ="submit" value = "guardar cambios">
    </form>`); //en los value preestablecemos los valores que antes habia en la tarea.

    $(".modal-wrap").submit(manejadorEditarTarea);
  });
};

const manejadorEditarTarea = (e) => {
  e.preventDefault();
  const titular = e.target.children[0].value;
  const contenido = e.target.children[1].value;
  const tareaAEditar = arrayTarea.find(
    (tarea) => `formedi${tarea.id}` == e.target.id
  );
  tareaAEditar.editarContenido(titular, contenido);
  guardarLocalStorage();
  renderTareas(arrayTarea); //renderizamos de nuevo para que se vea la info actualizada
  $(e.target).remove(); 
  }

const escucharCambiarColores = (e) => {
  mostrarBotonesColores(e);
  cambiarColorTarea(e);
};

const mostrarBotonesColores = (e) => {
  $(".color-selection").click(function (e) {
    const numberId = e.target.id.slice(2); //cortamos las letras para que poder manejar el id.
    $(`#cmenu${numberId}`).fadeIn(200);
  });
};

const cambiarColorTarea = () => {
  $(".tarea-color").click(function (e) {
    const colorFirst = "var(--first-card-color)";
    const colorSecond = "var(--second-card-color)";
    const colorThird = "var(--third-card-color)";
    const numberId = e.target.id.slice(6); //cortamos los prefijos para quedarnos con los numeros de id.
    const prefijoId = e.target.id.slice(0, 6); // tipo de color del boton , ej: si es first, second, etc.
    const tareaSeleccionada = arrayTarea.find((tarea) => tarea.id == numberId);
    //1:Seleccionamos la tarea a modificar segun el id del boton clikear.

    if (prefijoId == "colorF") {
      tareaSeleccionada.cambiarColor(colorFirst);
    } else if (prefijoId == "colorS") { 
      tareaSeleccionada.cambiarColor(colorSecond);
    } else if (prefijoId == "colorT") {
      tareaSeleccionada.cambiarColor(colorThird);
    }
    guardarLocalStorage();
    renderTareas(JSON.parse(localStorage.getItem("lista de tareas"))); // pinta las tareas de nuevo, sobreescribriendo lo que antes habia.
  });
};

//funciones secundarias

const apiClima = () => {
  const apiKey = "0b0c817b578b447b97a0c1bbe0ab3575"; //obtenemos la key dada por la documentacion
  $.getJSON(
    `https://api.weatherbit.io/v2.0/current?city=BuenosAires&key=${apiKey}&include=minutely`,
    function (respuesta, estado) {
      const data = respuesta.data;
      for (const objeto of data) {
        $(".date").prepend(`${objeto.app_temp}° temperatura actual`);
        $(".city").prepend(`${objeto.city_name}`);
      }
    }
  );
};

const mostrarTareaEjemplo = () => {
  $.getJSON("data.json", function (respuesta) {
    for (const objeto of respuesta) {
      crearTarea(objeto.titular, objeto.contenido);
      guardarLocalStorage();
      renderTareas(arrayTarea);
    }
  });
};

const manejadorInstanciaEjemploTarea = () => {
  if (!dataInicial) {
    mostrarTareaEjemplo();
  }
  //La primera vez que el usuario acceda a la web, se vera el ejemplo. Luego nunca más a menos que borre la caché.
};

const filtarDestacados = () => {
  const tareasDestacadas = arrayTarea.filter(
    (tarea) => tarea.destacado == true);

  tareasDestacadas.length != 0
    ? renderTareas(tareasDestacadas)
    : mensajeSinDestacados();
};

const mensajeSinDestacados = () => {
  renderTareas(arrayVacio); // usamos este render para que no se vean todas las tareas ya creadas.
  const mensaje = `<p class='mensaje-sin-destacados'>Ups, parece que no tienes tareas destacadas</p>`;
  $(".main-content").append(mensaje);
};
const mostrarMensajeSinTareas = () => {
    renderTareas(arrayVacio); // usamos este render para que no se vean todas las tareas ya creadas.
    const mensaje = `<p class='mensaje-sin-destacados'>Ups, parece que no tienes tareas </p>`;
    $(".main-content").append(mensaje);
  };

manejadorFiltrarDestacadas = () => {
  $("#tareasDestacadas").click(function (e) {
    e.preventDefault;
    filtarDestacados();
  });
};

const mostrarTodasTareas = () => {
  $("#dashBoard").click(function (e) {
    e.preventDefault;
    renderTareas(arrayTarea);
    mensajeSinTareas();

  });
};

const mensajeSinTareas = () => {
  arrayTarea.length !=0 ? console.log('hay tareas') : mostrarMensajeSinTareas();
};

const filtrarBusqueda = () => {
  $("#searcher").change(function (e) {
    e.preventDefault();
    const textoUsuario = e.target.value;
    for (const busqueda of arrayTarea) {
      const nombre = busqueda.titular;

      if (nombre.indexOf(textoUsuario) !== -1) {
        const tareasEncontradas = arrayTarea.filter(
          (tarea) => tarea.titular == nombre
        );
        renderTareas(tareasEncontradas); //filtramos por los titulos de las tareas.
      }
    }
  });
};
const efectoSidebar = () => {
  $("sidebar").mouseover(function () {
    $(".sidebar-list li h3").stop().show(200);

    $("header").stop().css({ width: "calc(100% - 200px)", left: "200px" });
  });
  $("sidebar").mouseleave(function () {
    $(".sidebar-list li h3").stop().hide(200);

    $("header").stop().css({ width: "calc(100% - 100px)", left: "100px" });
  });
};


efectoSidebar();
manejadorInstanciaEjemploTarea();
apiClima();
mostrarTareas();
filtrarBusqueda();
manejadorFiltrarDestacadas();
mensajeSinTareas();
mostrarTodasTareas();
