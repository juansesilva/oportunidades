// /**

//  */

//Map dimensions (in pixels)
var width = 898,
    height = 598;

//Map projection
var projection1 = d3.geo.mercator()
    .scale(383485.24637227994)
    //.scale(199158.32546657664)
    //.center([-75.76724145398217,4.84727367624363]) //projection center
    .center([-75.70837870481988,4.823202459537845]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view


var projection2 = d3.geo.mercator()
    .scale(383485.24637227994)
    //.scale(199158.32546657664)
    .center([-75.70837870481988,4.823202459537845]) //projection center
    //.center([-75.76724145398217,4.84727367624363]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

var pointsoffset=[-75.76724145398217,4.84727367624363];

var projection3 = d3.geo.mercator()
    .scale(383485.24637227994)
    //.scale(357444.0916573273)
    .center([-75.70837870481988,4.823202459537845]) //projection center
    //.center([-75.70909250000001,4.803888801376081]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path1 = d3.geo.path()
    .projection(projection1);

var path2 = d3.geo.path()
    .projection(projection2);

var path = d3.geo.path()
    .projection(projection3);


//Create an SVG
var svg = d3.select("#main").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create choropleth scale
var color = d3.scale.quantize()
    .domain([0,33])
    .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

var colorzat = d3.scale.quantize()
    .domain([0,33])
    .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([0, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);

var info = d3.select("#main").append("div").attr("class","info");

var datamanzana;
var datazats;
var barposition;
var checkvar=3;//variable para conocer el estado de los checkboxes


d3.selectAll("button").on('click', zoomClick);
d3.selectAll("#buttonmanzanas").attr('class', "btn btn-warning disabled");
document.getElementById('buttonmanzanas').disabled = true; 

d3.selectAll("#buttonzats").on('click', loadzats);
d3.selectAll("#buttonmanzanas").on('click', loadmanzanas);
d3.selectAll("#buttonmanzanas").style("cursor", "wait");

var slider = document.getElementById('slider'),
  input = document.getElementById('input-with-keypress');

var sumused;
var sumusedmanz;
var colorused;
var maxusedmanz;
var sumtotal=[]; 
var maxop=[];
var sumprivada=[]; 
var maxprivada=[];
var sumpublica=[]; 
var maxpublica=[];
var sumtotalmanz=[]; 
var maxopmanz=[];
var sumprivadamanz=[]; 
var maxprivadamanz=[];
var sumpublicamanz=[]; 
var maxpublicamanz=[];
var iszat=1;


var stepbar=100;
var colormanz=[];
var colormanzpublica=[];
var colormanzprivada=[];
var mask=[];
var staticmask=[];


var triggerzats=0;
var triggermanz=0;
var clickdata;

//JQuery para analizar los cambios en los checkbox



//inicializo la matrix de viajes total
  for(var x=0; x< 98; x++)
    {
      sumtotal[x]=[];
        for(var y=0; y<374; y++){
            sumtotal[x][y]=0;
            maxop[x]=0;
        }
    }
//inicializo la matrix de viajes entidades privadas para zats
  for(var x=0; x< 98; x++)
    {
      sumprivada[x]=[];
        for(var y=0; y<351; y++){
            sumprivada[x][y]=0;
            maxprivada[x]=0;
        }
    }

//inicializo la matrix de viajes entidades publicas para zats
  for(var x=0; x< 98; x++)
    {
      sumpublica[x]=[];
        for(var y=0; y<22; y++){
            sumpublica[x][y]=0;
            maxpublica[x]=0;
        }
    }

loadFilesAndCalculateSum2("data/fixdistance_zat.csv", function(sumaout){
        for(var x=0; x< 98; x++)
        {
          for(var y=0; y<374; y++){
            sumtotal[x][y]+=sumaout[x][y];
            if(y<352)
              sumprivada[x][y]=sumaout[x][y];
            if(y>351)
              sumpublica[x][y-352]=sumaout[x][y];
          }
        }

      });

//inicializo la matrix de viajes total para manzanas
  for(var x=0; x< 4983; x++)
    {
      sumtotalmanz[x]=[];
        for(var y=0; y<374; y++){
            sumtotalmanz[x][y]=0;
            maxopmanz[x]=0;
        }
    }

//inicializo la matrix de viajes entidades privadas para manzanas
  for(var x=0; x< 4983; x++)
    {
      sumprivadamanz[x]=[];
        for(var y=0; y<351; y++){
            sumprivadamanz[x][y]=0;
            maxprivadamanz[x]=0;
        }
    }

//inicializo la matrix de viajes entidades publicas para manzanas
  for(var x=0; x< 4983; x++)
    {
      sumpublicamanz[x]=[];
        for(var y=0; y<22; y++){
            sumpublicamanz[x][y]=0;
            maxpublicamanz[x]=0;
        }
    }

loadFilesAndCalculateSum3("data/fixdistance_manz_sin_virginia.csv", function(sumaoutmanz){
        for(var x=0; x< 4983; x++)
        {
          for(var y=0; y<374; y++){
            sumtotalmanz[x][y]+=sumaoutmanz[x][y];
            if(y<352)
              sumprivadamanz[x][y]=sumaoutmanz[x][y];
            if(y>351)
              sumpublicamanz[x][y-352]=sumaoutmanz[x][y];
          }
        }

        d3.selectAll("#buttonmanzanas").attr('class', "btn btn-warning");
        d3.selectAll("#buttonmanzanas").style("cursor", "default");
        document.getElementById('buttonmanzanas').disabled = false; 



//######################## experimental ###############################
  for(var x=0; x<100; x++)
    {
      colormanz[x]=[];
      colormanzpublica[x]=[];
      colormanzprivada[x]=[];
        for(var y=0; y<4983; y++){
            colormanz[x][y]=0;
            colormanzpublica[x][y]=0;
            colormanzprivada[x][y]=0;
        }
    }

for(var resol=0; resol<100; resol++){
  for(var x=0; x<sumtotalmanz.length; x++){
    for(var y=0; y<sumtotalmanz[0].length; y++){
      if(((resol+1)*100)>=sumtotalmanz[x][y]){
        colormanz[resol][x]+=1;
      }
      if(((resol+1)*100)>=sumprivadamanz[x][y]){
        colormanzprivada[resol][x]+=1;
      }
      if(((resol+1)*100)>=sumpublicamanz[x][y]){
        colormanzpublica[resol][x]+=1;
      }
    }
  }
}

  for(var x=0; x<colormanz.length; x++){
    maxopmanz[x]=colormanz[x].max();
    maxprivadamanz[x]=colormanzprivada[x].max();
    maxpublicamanz[x]=colormanzpublica[x].max();
  }





//######################## experimental ###############################



      });

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

//Cargo el topojson con las oportunidades.
d3.json("oportunidades_datavis.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console
  
dataoport=topojson.feature(geodata,geodata.objects.oportunidades_datavis).features;

});


d3.json("zats.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console

  datazats=topojson.feature(geodata,geodata.objects.collection).features;
  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(topojson.feature(geodata,geodata.objects.collection).features) //generate features from TopoJSON
    .enter()
    .append("path")
    .attr("d",path2)
    //.attr("class", function(d) { return (typeof colorzat(d.properties.ID) == "string" ? colorzat(d.properties.ID) : ""); })
    .on("mouseover",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",clicked);



noUiSlider.create(slider, {
  start: 0,
  step:stepbar,
  range: {
    min: 0,
    max: 7000
  },
  pips: {
    mode: 'values',
    values: [100, 1000, 2000,3000,4000, 5000, 6000, 7000],
    density: 4
  }
});



slider.noUiSlider.on('update', function( values, handle ) {

if(checkvar==3){
  sumused=sumtotal;
  slider.removeAttribute('disabled');
}
else if(checkvar==1){
  sumused=sumpublica;
  slider.removeAttribute('disabled');
}
else if(checkvar==2){
  sumused=sumprivada;
  slider.removeAttribute('disabled');
}
else{
  slider.setAttribute('disabled', true);
}





for(var x=0; x<maxop.length;x++){
  maxop[x]=0;
}


  input.value = values[handle];

  limit=slider.noUiSlider.get();



  for (var i = 0; i < sumused.length; i++) {
    for (var j = 0; j < sumused[0].length; j++) {
      if(limit>=sumused[i][j]){
        maxop[i]+=1;
      }
    };
  };


  colorzat = d3.scale.quantize()
    .domain([1,maxop.max()])
    .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

    features.selectAll("path").attr("class", function(d) { return (typeof colorzat(maxop[d.properties.gid-1]) == "string" ? colorzat(maxop[d.properties.gid-1]) : ""); })



});

input.addEventListener('change', function(){
  slider.noUiSlider.set([null, this.value]);

});

slider.noUiSlider.on('change', function ( values, handle ) {
  
  if ( values[handle] < 0 ) {
    slider.noUiSlider.set(0);
  } else if ( values[handle] > 7000) {
    slider.noUiSlider.set(7000);
  }
});

input.addEventListener('keydown', function( e ) {

  // Convert the string to a number.
  var value = Number( slider.noUiSlider.get() ),
    sliderStep = slider.noUiSlider.steps()

  // Select the stepping for the first handle.
  sliderStep = sliderStep[0];

  // 13 is enter,
  // 38 is key up,
  // 40 is key down.
  switch ( e.which ) {
    case 13:
      slider.noUiSlider.set(this.value);
      break;
    case 38: slider.noUiSlider.set( value + sliderStep[1] );
      break;
    case 40: slider.noUiSlider.set( value - sliderStep[0] );
      break;
  }
});



d3.json("manzanas.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console
  




});


});//cierra la llamada al json de zats


$('#modos :checkbox').change(function () {//si la casilla fue checkeada:
  if ($(this).is(':checked')) {
    console.log($(this).attr("id") + ' is now checked mode');
    checkvar+=Number($(this).attr("id"));
    console.log(checkvar);
    slider.removeAttribute('disabled');
    if(triggerzats==1 || triggermanz==1)paint(checkvar);
    slider.noUiSlider.set(slider.noUiSlider.get());


  }

  else {//si la casilla fué descheckeada
    console.log($(this).attr("id") + ' is now unchecked mode');
    checkvar-=Number($(this).attr("id"));
    console.log(checkvar);
    if(triggerzats==1 || triggermanz==1)paint(checkvar);
    slider.noUiSlider.set(slider.noUiSlider.get());

  }
});



//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );

      svg.selectAll("circle").each(function(d,i){
        if(d3.select(this).attr("r")!=0){
          d3.select(this).attr("r",4/zoom.scale());
        }
      });

  escala.style("display","block").html("<p>Escala: 1:" + (60000/(zoom.scale())).toFixed(0));
  regla.style("display","block").text((2000/(zoom.scale())).toFixed(0) + " metros");

}
// /**ancho del mapa(en pixeles)*/
// var width = 898;
// /**alto del mapa(en pixeles)*/
// var height = 598;

// var color_line = "#225ea8"; //color de las lineas al pasar el mouse sobre ellas
// var color_line2 = "black"; //color de las lineas al desplegarse

// //Proyección del mapa
// var projection = d3.geo.mercator()
//     .scale(384339.3337806814)
//     //.scale(500000)
//     .center([-75.70837869815024,4.823202472240141]) //centro de la proyección
//     .translate([width/2,height/2]) //transladar al centro del mapa para la vista inicial

// //genera paths basados en la proyección: dada una geometría, genera una ruta de acceso a los datos.
// var path = d3.geo.path()
//     .projection(projection);

// //Para crear un SVG: es un formato de imagen basada en texto. el SVG es como el lienzo donde se dibujan los shapes.
// var svg = d3.select("#main").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// //variable para la escala del ancho de las lineas
// var linescale = 20;

// //Grupos para las características de mapa: cada zat es una característica.
// var features = svg.append("g")
//     .attr("class","features");

// //El listener para el zoom
// //Cambiar [1,Infinity] para cuadrar la escala min/max
// var zoom = d3.behavior.zoom()
//     .scaleExtent([1, 100])
//     .on("zoom",zoomed);

// //llamo el evento de drag para arrastrar el mapa
// var drag = d3.behavior.drag();
// svg.call(drag);

// //Llamada a la función del zoom
// svg.call(zoom);

// //cancelar el evento del zoom al dar doble click
// d3.select("svg").on("dblclick.zoom", null);

// //asignando la funcion a la acción de dar click a un botón de zoom
// d3.selectAll(".btn btn-default").on('click', zoomClick);
// d3.selectAll('#zoom_in')
//   .on("mouseover",showTooltipZin)
//   .on("mousemove",moveTooltip)
//   .on("mouseout",hideTooltipZoom);

// d3.selectAll('#zoom_out')
//   .on("mouseover",showTooltipZout)
//   .on("mousemove",moveTooltip)
//   .on("mouseout",hideTooltipZoom);

//acción para el boton de refrescar
// d3.selectAll("#refresh")
//   .on("click",clear);

// //creación de tooltip: información desplegada para cada zat/línea
// var tooltip = d3.select("#main").append("div").attr("class","tooltip");

// //Se carga el archivo topojson (shapefile previamente convertido a topojson)
// d3.json("zats_junio_2.topojson",function(error,geodata) {
//   if (error) return console.log(error); //error desconocido, mirar la consola

//   //Crea un path para cada caracteristica en el data  (data es el archivo cargado)
//   features.selectAll("path")
//     .data(topojson.feature(geodata,geodata.objects.collection).features) //extrae los features del TopoJSON
//     .enter() //si no encuentra ningun path...
//     .append("path") //los agrega con .append
//     .attr("id", function(d) {return d.properties.ZAT_2008; }) //a cada path se le da un ID y una clase.
//     .attr("class", function(d) {return "path " + d.properties.NOMB_MUNIC; }) //para los colores de pereira/dosquebradas, se distinguen 2 clases
//     .attr("d",path) //si vincula el data con cada path
//     .on("click",clicked) // se asigna una función para el evento de click
//     .on(".drag", null) //se cancela la función de drag para evitar disparar el evento de click.
//     .on("mouseover",showTooltip) //cuando el mouse pasa por encima, se muestra una información.
//     .on("mousemove",moveTooltip)
//     .on("mouseout",hideTooltip)

// //variable para tener acceso al data desde cualquier función sin llamar a "d"
// zats=topojson.feature(geodata,geodata.objects.collection).features;
// flujotot=0; //Variable para almacenar los viajes totales desde/hacia un zat.

// initial(); //función para mostrar unas líneas iniciales.

// }); //cierra función de carga del archivo TopoJSON

//tooltip para mostrar la escala del mapa
var escala = d3.select("#main").append("div")
  .attr("class","escala");

escala.style("display","block").html("<p>Escala: 1:" + (60000/(zoom.scale())).toFixed(0));
//tooltip para mostrar la escala de la regla
var regla = d3.select("#main").append("div")
  .attr("class","regla2");

regla.style("display","block").text((2000/(zoom.scale())).toFixed(0) + " metros");

// var selectedmode = new Array(); //arreglo para guardar los modos seleccionados
// var selectedprop = new Array(); //arreglo para guardar los propositos seleccionados
// var matrix = []; //matriz para guardar los valores de viajes cargados
// var names = [];  
// var names2 = [];
// var sumtotal=[]; 

// //se inicializa el modo 1 y proposito 1
// selectedmode.push("1");
// selectedprop.push("1");

// //inicializo la matrix de viajes total
//   for(var x=0; x< 98; x++)
//     {
//       sumtotal[x]=[];
//         for(var y=0; y<98; y++){
//             sumtotal[x][y]=0;
//         }
//     }


// //JQuery para analizar los cambios en los checkbox
// $('#modos :checkbox').change(function () {//si la casilla fue checkeada:
//   if ($(this).is(':checked')) {
//     console.log($(this).attr("id") + ' is now checked mode');
//     selectedmode.push($(this).attr('id'));//agrego la casilla checkeada a una lista
//     names=[];
//     console.log(selectedmode);

//     if(selectedmode.length > 0 && selectedprop.length > 0){//si hay mas de un modo y proposito:
//       console.log("cargar matrices!!!!");

//       for(var i=0; i<selectedprop.length; i++){
//         filename ="datasets/Matriz" + selectedprop[i] + $(this).attr('id') + ".csv";
//         names.push(filename);//agrego el nombre de las matrices a cargar
//       }

//       console.log(names);
//       //y se llama la función que carga las matrices solicitadas en sumtotal.
//       loadFilesAndCalculateSum2(names, function(sumaout){
//         for(var x=0; x< 98; x++)
//         {
//           for(var y=0; y<98; y++){
//             sumtotal[x][y]+=sumaout[x][y];
//           }
//         }

//       });

//       console.log("suma total afuera");
//       console.log(sumtotal);
//     }
//   }

//   else {//si la casilla fué descheckeada
//     console.log($(this).attr("id") + ' is now unchecked mode');
//     selectedmode.pop($(this).attr('id')); //saco la opción de la lista de modos seleccionados
//     names=[];
//     console.log(selectedmode);

//     if(selectedmode.length > 0 && selectedprop.length > 0){//si hay mas de un modo y proposito:
//       console.log("cargar matrices!!!!");

//       for(var i=0; i<selectedprop.length; i++){
//         filename ="datasets/Matriz" + selectedprop[i] + $(this).attr('id') + ".csv";
//         names.push(filename);//agrego el nombre de las matrices a cargar
//       }

//       console.log(names);
//       //y se llama la función que carga las matrices solicitadas en sumtotal.
//       loadFilesAndCalculateSum2(names, function(sumout2){
        
//         for(var x=0; x< 98; x++)
//         {
//           for(var y=0; y<98; y++){
//             sumtotal[x][y]-=sumout2[x][y];
//           }
//         }
//       });

//       console.log("suma total afuera modo");
//       console.log(sumtotal);

//     }
//     //si no hay nada checkeado, borrar lo que hay en la matriz del total de viajes
//     else{
//       console.log("borrar sumtotal");
//       for(var x=0; x< 98; x++){
//         sumtotal[x]=[];
//         for(var y=0; y<98; y++){
//           sumtotal[x][y]=0;
          
//         }
//       }
//     }

//   }
// });


// //JQuery para analizar los cambios en los checkbox (lo mismo que el codigo de arriba pero para propositos.)
// $('#propositos :checkbox').change(function () {
//   if ($(this).is(':checked')) {
//     console.log($(this).attr("id") + ' is now checked purpose');
//     selectedprop.push($(this).attr('id'));
//     names=[];
//     console.log(selectedprop);

//     if(selectedmode.length > 0 && selectedprop.length > 0){
//       console.log("cargar matrices!!!!");

//       for(var i=0; i<selectedmode.length; i++){
//         filename ="datasets/Matriz" + $(this).attr('id') + selectedmode[i] + ".csv";
//         names.push(filename);
//       }

//       console.log(names);

//       loadFilesAndCalculateSum2(names, function(sumaout3){
//         for(var x=0; x< 98; x++)
//         {
//           for(var y=0; y<98; y++){
//             sumtotal[x][y]+=sumaout3[x][y];
//           }
//         }

        
//       });

//       console.log("suma total afuera propo");
//       console.log(sumtotal);

//     }
//   } 

//   else {//si la casilla fué descheckeada
//     console.log($(this).attr("id") + ' is now unchecked purpose');
//     selectedprop.pop($(this).attr('id'));
//     names=[];
//     console.log(selectedprop);

//     if(selectedmode.length > 0 && selectedprop.length > 0){
//       console.log("cargar matrices!!!!");

//       for(var i=0; i<selectedmode.length; i++){
//         filename ="datasets/Matriz" + $(this).attr('id') + selectedmode[i] + ".csv";
//         names.push(filename);
//       }

//       console.log(names);

//       loadFilesAndCalculateSum2(names, function(sumout4){
        
//         for(var x=0; x< 98; x++)
//         {
//           for(var y=0; y<98; y++){
//             sumtotal[x][y]-=sumout4[x][y];
//           }
//         }
//       });

//       console.log("suma total afuera propo");
//       console.log(sumtotal);

//     }

//     else{
//       console.log("borrar sumtotal");
//       for(var x=0; x< 98; x++){
//         sumtotal[x]=[];
//         for(var y=0; y<98; y++){
//           sumtotal[x][y]=0;
          
//         }
//       }
//     }
 
//   }
// });

// ///////////// DEFINICION DE FUNCIONES //////////////////


// //funcion que carga las matrices segun los parametros del usuario.
// function loadFilesAndCalculateSum2(filenames, cb, sum, i) {
//   var cero=[];
//   //inicializa matriz de ceros.
//   for(var x=0; x< 98; x++)
//     {
//       cero[x]=[];
//         for(var y=0; y<98; y++){
//             cero[x][y]=0;
//         }
//     }
 
//   //al ser una función recursiva, si recibe el parametro sum, lo utiliza, de otro modo es igual a cero.
//   sum = sum || cero;
//   i = i || 0;
//   var temp=[];

//   //función de D3 que carga archivos csv
//   d3.text(filenames[i], function(error, text) {
//     //Parsear las filas y mapearlas.
//     temp = d3.csv.parseRows(text).map(function (row){
//       return row.map(function(value){return +value;});
//     });
//     //se suma lo parseado a la matriz de viajes
//     for(var x=0; x< temp.length; x++)
//     {
//         for(var y=0; y<temp.length; y++){
//             sum[x][y]+=temp[x][y];
//         }
//     }

//     //llamado recursivo: si hay mas archivos para cargar, vuelve y llama la función, retorna la suma en el callback
//     if(i < filenames.length - 1){
//       //Cargar siguiente archivo
//       loadFilesAndCalculateSum2(filenames, cb, sum, i+1);
//     } else {
//       //llama el callback con la suma final
//       cb(sum);
//     }
//   });
// }

// //función para mostrar las líneas cada que se da click en un zat.
// function clicked(d) {

//   if (d3.event.defaultPrevented) return; //previene que se haga click al arrastrar el mapa

//   // si no hay modo o propósito checkeado, se despliega aviso.
//   if(selectedprop.length==0 || selectedmode==0){window.alert("Por favor, selecciona al menos un modo y un propósito");}

//   //borro las lineas que están dibujadas
//   svg.selectAll("line").remove();
//   //reasigno la clase de cada path para sus colores correctos
//   d3.selectAll("path").attr("class",function(d) {return "path " + d.properties.NOMB_MUNIC; });

//   var fila = [];
//   flujotot=0;
//   matrix=sumtotal;

//   if(document.getElementById("r1").checked){//se analiza si es "desde" o "hacia"
//     fila = matrix[d.properties.ZAT_2008-1]; //si es desde, se escoge la fila de la matriz origen destino

//     for(var i=0, len=zats.length; i<len; i++){
//       var z=zats[i];
//       var centroide=path.centroid(z);
//       var flujo = fila[i];

//       //para cada zat, agrego una linea desde el centroide con el flujo como ancho de la linea.
//       svg.append("line")
//         .attr("x1", path.centroid(d)[0])//punto de origen en x
//         .attr("y1", path.centroid(d)[1])//punto de origen en y
//         .attr("x2", centroide[0])//punto de destino en x
//         .attr("y2", centroide[1])//punto de destino en y
//         .attr("stroke-width", fila[z.properties.ZAT_2008-1]/linescale)//ancho de la linea segun la cantidad de viajes
//         .attr("stroke", color_line2) //color de la linea al desplegar
//         .attr("stroke-opacity",0.5)  //se le coloca transparencia para ver las líneas que pasan por debajo.
//         .attr("zatorigin", d.properties.ZAT_2008)//se le define un origen y destino para mostrar dicha información en tooltip
//         .attr("zatdestin", z.properties.ZAT_2008)
//         .attr("class", "animate") //clase para animar el despliegue.
//         .on("mouseover",showflow) //eventos al colocar/quitar el mouse sobre las líneas.
//         .on("mousemove",moveTooltip)
//         .on("mouseout",hideTooltipLine);

//       flujotot=flujotot+fila[z.properties.ZAT_2008-1]; //variable que acumula el valor de los viajes totales.
//     }
//   }

//   //si es hacia, se escoje la columna del zat al cual se le dio click
//   else{
//     for (var x=0, len=zats.length; x<len; x++){
//       fila[x]=matrix[x][d.properties.ZAT_2008-1]; 
//     }

//     for(var i=0, len=zats.length; i<len; i++){
//       var z=zats[i];
//       var centroide=path.centroid(z);
//       var flujo = fila[i];

//       //para cada zat, agrego una linea desde el centroide con el flujo como ancho de la linea.
//       svg.append("line")
//         .attr("x2", path.centroid(d)[0])//punto de destino en x
//         .attr("y2", path.centroid(d)[1])//punto de destino en y
//         .attr("x1", centroide[0])//punto de origen en x
//         .attr("y1", centroide[1])//punto de origen en y
//         .attr("stroke-width", fila[z.properties.ZAT_2008-1]/linescale)//ancho de la linea segun el flujo
//         .attr("stroke", color_line2)//color de la linea al desplegar
//         .attr("stroke-opacity",0.5)//se le coloca transparencia para ver las líneas que pasan por debajo.
//         .attr("zatorigin", d.properties.ZAT_2008)//se le define un origen y destino para mostrar dicha información en tooltip
//         .attr("zatdestin", z.properties.ZAT_2008)
//         .attr("class", "animate")//clase para animar el despliegue.
//         .on("mouseover",showflow)//eventos al colocar/quitar el mouse sobre las líneas.
//         .on("mousemove",moveTooltip)
//         .on("mouseout",hideTooltipLine);

//       flujotot=flujotot+fila[z.properties.ZAT_2008-1];//variable que acumula el valor de los viajes totales.
//     }
//   }

//   //transformación y escalado de las líneas para desplegarlas correctamente cuando el mapa tiene zoom.
//   svg.selectAll("line")
//     .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");

// }

// //función para mostrar inicialmente unas líneas al cargar la pagina.
// function initial() {

//   //borro las lineas que están dibujadas
//   svg.selectAll("line").remove();

// var fila = [];
// //se carga por defecto la matriz 1-1
// var name="datasets/Matriz11.csv";

// d3.text(name, function(text){
//   matrix = d3.csv.parseRows(text).map(function (row){
//     return row.map(function(value){ 
//       return +value;
//     });
//   });
//   //se carga en la matriz de viajes totales los valores cargados.
//   for(var x=0; x< matrix.length; x++)
//     {
//         for(var y=0; y<matrix.length; y++){
//             sumtotal[x][y]+=matrix[x][y];
//         }
//     }
// //para definir el sentido de las lineas
// if(document.getElementById("r1").checked){

//   fila = matrix[67];
// }

// else{
//   for (var x=0, len=98; x<len; x++){
//     fila[x]=matrix[x][67]; 
//   }
// }

// console.log(fila);

// //dibujo las líneas
// for(var i=0, len=98; i<len; i++){
//   var z=zats[i];
//   var centroide=path.centroid(z);
//   var flujo = fila[i];

//     svg.append("line")
//       .attr("x1", path.centroid(zats[5])[0])//punto de origen en x
//         .attr("y1", path.centroid(zats[5])[1])//punto de origen en x
//         .attr("x2", centroide[0])//punto de destino en x
//         .attr("y2", centroide[1])//punto de destino en y
//         .attr("stroke-width", fila[z.properties.ZAT_2008-1]/linescale)//ancho de la linea segun el flujo
//         .attr("stroke", color_line2)//color de la linea al desplegar
//         .attr("stroke-opacity",0.5)//se le coloca transparencia para ver las líneas que pasan por debajo.
//         .attr("zatorigin", zats[5].properties.ZAT_2008)//se le define un origen y destino para mostrar dicha información en tooltip
//         .attr("zatdestin", z.properties.ZAT_2008)
//         .attr("class", "animate")//clase para animar el despliegue.
//         .on("mouseover",showflow)//eventos al colocar/quitar el mouse sobre las líneas.
//         .on("mousemove",moveTooltip)
//         .on("mouseout",hideTooltipLine);

//     flujotot=flujotot+fila[i];

// }

// });

// }
// //offset desde la posicioon del mouse para un tooltip que se mueva
// //var tooltipOffset = {x: 5, y: -25};


// //función para mostrar información en el tooltip cada que el mouse pasa sobre un zat. se accede al data por medio de la variable "d"
// function showTooltip(d) {
//   moveTooltip();//para permitir el movimiento del tooltip
//   tooltip.style("display","block")
//       .html("<p>ZAT: " + d.properties.ZAT_2008); //muestra el ID del zat correspondiente
//   var zat=d.properties.ZAT_2008

//   //al colocar el mouse en un zat, tambien resalta la linea (si existe) de flujo que llega de ella o hacia ella
//   svg.selectAll("line").filter(function(d,i){
//     return d3.select(this).attr("zatorigin")==zat || d3.select(this).attr("zatdestin")==zat
//   }).style("stroke",color_line);

//   //retorna el zat de origen de la línea que llega al zat donde está el mouse
//   var lineor = svg.selectAll("line").filter(function(d,i){
//     return d3.select(this).attr("zatorigin")==zat || d3.select(this).attr("zatdestin")==zat
//   }).attr("zatorigin");

//   //si existe una linea, pinta el origen y el destino de dicha linea.
//   if(svg.selectAll("line").filter(function(d,i){
//     return d3.select(this).attr("zatdestin")==zat}).attr("stroke-width")>0){
//     d3.selectAll("path").filter(function(d, i){
//       return d3.select(this).attr("id") == lineor}).attr("class","path paint");

//     var myline=svg.selectAll("line").filter(function(d,i){
//     return d3.select(this).attr("zatdestin")==zat}).attr("stroke-width");

//     var mylineori=svg.selectAll("line").filter(function(d,i){
//     return d3.select(this).attr("zatdestin")==zat}).attr("zatorigin");

//     var mylinedest=svg.selectAll("line").filter(function(d,i){
//     return d3.select(this).attr("zatdestin")==zat}).attr("zatdestin");

//     //texto que muestra la misma información que muestra al colocar el mouse sobre una línea.
//     if(document.getElementById("r1").checked){
//       tooltip.html("<p>ZAT: " + zat + "<p>Viajes: " + (myline*linescale).toFixed(0) + " (" +  ((myline*linescale*100)/flujotot).toFixed(2) + "%) </p><br>" + "<p>Zat de origen: " + mylineori + "<p>Zat de destino: " + mylinedest);
//     }

//     else{
//       tooltip.html("<p>ZAT: " + zat + "<p>Viajes: " + (myline*linescale).toFixed(0) + " (" +  ((myline*linescale*100)/flujotot).toFixed(2) + "%) </p><br>" + "<p>Zat de origen: " + mylinedest + "<p>Zat de destino: " + mylineori);
//     }
//   }

//   //para el zat de origen/destino principal, pinta todos los zats a los que existe un flujo (linea).
//   //tomado de http://stackoverflow.com/questions/11336251/accessing-d3-js-element-attributes-from-the-datum/23788876#23788876
//   svg.selectAll("line").each(function(d,i){
//     if(d3.select(this).attr("zatorigin") == zat && d3.select(this).attr("stroke-width") > 0){
//       var dest=d3.select(this).attr("zatdestin");

//       d3.selectAll("path").filter(function(d, i){
//         return d3.select(this).attr("id") == dest}).attr("class","path paint");//a dichos zats, se les cambia la clase para cambiar el color.
//       tooltip.html("<p>ZAT: " + zat + "</p><br>" + "<p>Viajes intrazat: " + (sumtotal[zat-1][zat-1]).toFixed(0) + "<p>Total viajes: " + flujotot.toFixed(0));


//     }
//   });

// }

// //Funcion para mostrar información en el tooltip al pasar el mouse sobre una línea.
// function showflow(d){
//   moveTooltip();//para permitir el movimiento del tooltip

//   if(document.getElementById("r1").checked){//dependiendo si es desde/hacia, cambia el origen o destino en la información mostrada en el tooltip

//     tooltip.style("display","block")
//       .html("<p>viajes: " + (Number(d3.select(this).attr("stroke-width"))*linescale).toFixed(0)  + " (" +  ((Number(d3.select(this).attr("stroke-width"))*linescale*100)/flujotot).toFixed(2) + "%) </p><br>" + "<p>Zat de origen: " + d3.select(this).attr("zatorigin") + "<p>Zat de destino: " + d3.select(this).attr("zatdestin"));
//       d3.select(this).style("stroke",color_line)
//       .style("stroke-opacity",1);
//   } 

//   else{
//     tooltip.style("display","block")
//       .html("<p>viajes: " + (Number(d3.select(this).attr("stroke-width"))*linescale).toFixed(0)  + " (" +  ((Number(d3.select(this).attr("stroke-width"))*linescale*100)/flujotot).toFixed(2) + "%) </p><br>" + "<p>Zat de origen: " + d3.select(this).attr("zatdestin") + "<p>Zat de destino: " + d3.select(this).attr("zatorigin"));
//       d3.select(this).style("stroke",color_line)
//       .style("stroke-opacity",1);

//   }
//     var ori = d3.select(this).attr("zatorigin");
//     var des = d3.select(this).attr("zatdestin");

//     //cambio la clase del estilo de los zats de origen-destino de la línea seleccionada para que resalten del resto
//     d3.selectAll("path").filter(function(d, i){
//       return d3.select(this).attr("id") == ori}).attr("class","path paint");
//     d3.selectAll("path").filter(function(d, i){
//       return d3.select(this).attr("id") == des}).attr("class","path paint");
// }

// //funcion para ocultar los tooltips de las lineas
// function hideTooltipLine(d) {
//   tooltip.style("display","none")
//   d3.select(this).style("stroke",color_line2)
//     .style("stroke-opacity",0.5);

//   var ori = d3.select(this).attr("zatorigin");
//   var des = d3.select(this).attr("zatdestin");

//   //cambio la clase del estilo de los zats de origen-destino de la línea seleccionada para que ya no estén resaltados
//   d3.selectAll("path").filter(function(d, i){
//     return d3.select(this).attr("id") == ori}).attr("class",function(d) {return "path " + d.properties.NOMB_MUNIC; });
//   d3.selectAll("path").filter(function(d, i){
//     return d3.select(this).attr("id") == des}).attr("class",function(d) {return "path " + d.properties.NOMB_MUNIC; });
// }

// //funcion para ocultar los tooltips de los zats
// function hideTooltip(d) {
//   tooltip.style("display","none");
//   var zat=d.properties.ZAT_2008;

// //cambia el color de las lineas a su estilo original.
// svg.selectAll("line").filter(function(d,i){
//   return d3.select(this).attr("zatorigin")==zat || d3.select(this).attr("zatdestin")==zat
// })
//   .style("stroke",color_line2)
//   .style("stroke-opacity",0.5);

// var lineor = svg.selectAll("line").filter(function(d,i){
//   return d3.select(this).attr("zatorigin")==zat || d3.select(this).attr("zatdestin")==zat
// }).attr("zatorigin");

// var linedest = svg.selectAll("line").filter(function(d,i){
//   return d3.select(this).attr("zatorigin")==zat || d3.select(this).attr("zatdestin")==zat
// }).attr("zatdestin");

// //cambiar el color de los zats a su estilo original
// d3.selectAll("path").filter(function(d, i){
//       return d3.select(this).attr("id") == lineor || d3.select(this).attr("id") == linedest}).attr("class",function(d) {return "path " + d.properties.NOMB_MUNIC; });

//   svg.selectAll("line").each(function(d,i){
//     if(d3.select(this).attr("zatorigin") == zat && d3.select(this).attr("stroke-width") > 0){
//       var dest=d3.select(this).attr("zatdestin");

//       d3.selectAll("path").filter(function(d, i){
//         return d3.select(this).attr("id") == dest}).attr("class",function(d) {return "path " + d.properties.NOMB_MUNIC; });
//     }
//   });

// }
// //tooltip de los botones de zoom
// function showTooltipZin() {
//   moveTooltip();
//   tooltip.style("display","block")
//       .text("Zoom in");    
// }
// //tooltip de los botones de zoom
// function showTooltipZout() {
//   moveTooltip();
//   tooltip.style("display","block")
//       .text("Zoom out");   
// }
// //oculta el tooltip del zoom
// function hideTooltipZoom() {
//   tooltip.style("display","none")
// }

// //Movimiento del tooltip para seguir al mouse (deshabilitado)
// function moveTooltip() {
//    //tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
//   //     .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
// }


//funcion que carga las matrices segun los parametros del usuario.
function loadFilesAndCalculateSum2(filenames, cb) {
  var cero=[];
  //inicializa matriz de ceros.
  for(var x=0; x< 98; x++)
    {
      cero[x]=[];
        for(var y=0; y<374; y++){
            cero[x][y]=0;
        }
    }
 
  //al ser una función recursiva, si recibe el parametro sum, lo utiliza, de otro modo es igual a cero.

  var temp=[];

  //función de D3 que carga archivos csv
  d3.text(filenames, function(error, text) {
    //Parsear las filas y mapearlas.
    temp = d3.csv.parseRows(text).map(function (row){
      return row.map(function(value){return +value;});
    });
    console.log(temp.length);
    //se suma lo parseado a la matriz de viajes
    for(var x=0; x< temp.length; x++)
    {
        for(var y=0; y<temp[0].length; y++){
            cero[x][y]=temp[x][y];
        }
    }

      cb(cero);
    
  });
}

function loadFilesAndCalculateSum3(filenames, cb) {
  var cero=[];
  //inicializa matriz de ceros.
  for(var x=0; x< 4983; x++)
    {
      cero[x]=[];
        for(var y=0; y<374; y++){
            cero[x][y]=0;
        }
    }
 
  //al ser una función recursiva, si recibe el parametro sum, lo utiliza, de otro modo es igual a cero.

  var temp=[];

  //función de D3 que carga archivos csv
  d3.text(filenames, function(error, text) {
    //Parsear las filas y mapearlas.
    tempmanz = d3.csv.parseRows(text).map(function (row){
      return row.map(function(value){return +value;});
    });
    //se suma lo parseado a la matriz de viajes
    for(var x=0; x< tempmanz.length; x++)
    {
        for(var y=0; y<tempmanz[0].length; y++){
            cero[x][y]=tempmanz[x][y];
        }
    }

      cb(cero);
    
  });
}



//suavizar el zoom.
function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(100).tween("zoom", function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
            iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
            zoom
                .scale(iScale(t))
                .translate(iTranslate(t));
            zoomed();
        };
    });
}
//función para el zoom por click en los botones
function zoomClick() {
    var clicked = d3.event.target,
        direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    d3.event.preventDefault();
    direction = (this.id === 'zoom_in') ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);
    console.log("click " + direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
}

// //función del zoom. Actualizar la posicion de todo lo dibujado.
// function zoomed() {
//   features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
//       .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );

//   //cambio las coordenas de las líneas de deseo
//   svg.selectAll("line")
//         .attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
//       .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );

// escala.style("display","block").html("<p>Escala: 1:" + (60000/(zoom.scale())).toFixed(0));
// regla.style("display","block").text((2000/(zoom.scale())).toFixed(0) + " metros");

// }

//función para limpiar las lineas del svg.
function borrar(){
  features.selectAll("circle").remove();
  console.log("borrando");
}



var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
function showTooltip(d) {
  //moveTooltip();

  if(iszat==1){
    info.style("display","block")
      .text("Oportunidades Alcanzadas: " + maxop[d.properties.gid-1]);
    }

  else{
    info.style("display","block")
      .text("Oportunidades Alcanzadas: " + colorused[Math.round(slider.noUiSlider.get()/100)][d.properties.gid-1]);
  }
}

//Move the tooltip to track the mouse
function moveTooltip() {
  info.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  info.style("display","none");
}

function radius(d){

var url;
var email;
var gerente;
var telefono;

  if (!d3.select(this).attr("url"))
    {
      url= "";
    }
    else{
      url='http://'+d3.select(this).attr("url");
    }

    if (!d3.select(this).attr("email"))
    {
      email= "";
    }
    else{
      email="Email: "+d3.select(this).attr("email");
    }

    if (!d3.select(this).attr("gerente"))
    {
      gerente= "";
    }
    else{
      gerente="Gerente: "+d3.select(this).attr("gerente");
    }

    if (!d3.select(this).attr("telefono"))
    {
      telefono= "";
    }
    else{
      telefono="Teléfono: "+d3.select(this).attr("telefono");
    }


  d3.select(this).transition().attr("r",10/zoom.scale()).attr("fill","black");

info.transition()
            .duration(500)    
            .style("opacity", 0);
        info.transition()
            .duration(200)    
            .style("opacity", .9);



  info.style("display","block")
       .html(d3.select(this).attr("nombre")+"</br>"+d3.select(this).attr("tipo")+"</br>"+d3.select(this).attr("direccion")+"</br>"+telefono+"</br>"+gerente+"</br>"+email+"</br>"+url);  
     


console.log(d3.select(this).attr("url"));


}
function noradius(d){
  d3.select(this).transition().duration(500).attr("r",4/zoom.scale()).attr("fill","red");
  //hideTooltip();
}


function clicked(d,i) {

  triggerzats=1;
  clickdata=d;
  var auxmask=[];
  var matrix=[];

  if (d3.event.defaultPrevented) return; //previene que se haga click al arrastrar el mapa



 slider.noUiSlider.destroy();

   noUiSlider.create(slider, {
  start: limit,
  step:stepbar,
  range: {
    min:0,
    max: 7000
  },
  pips: {
    mode: 'values',
    values: [100, 1000, 2000,3000,4000, 5000, 6000, 7000],
    density: 4
  }
});

   if(iszat){
    matrix=sumtotal;
   }
   else{
    matrix=sumtotalmanz;
  }


  //////////////experimental////////////////

var circle= features.selectAll("circle")
  .data(dataoport)
  .enter()
  .append("circle")
    .attr("cx",function(d,i){return (path2.centroid(dataoport[i])[0])})
    .attr("cy",function(d,i){return (path2.centroid(dataoport[i])[1])})
    .attr("nombre", function(d,i){return d.properties.name})
    .attr("tipo", function(d,i){return d.properties.tipoentida})
    .attr("gerente", function(d,i){return d.properties.gerente})
    .attr("url", function(d,i){return d.properties.url})
    .attr("direccion", function(d,i){return d.properties.direccion})
    .attr("telefono", function(d,i){return d.properties.telefono})
    .attr("email", function(d,i){return d.properties.email})
    .attr("mpio", function(d,i){return d.properties.nombremuni})
    .on("mouseover",radius)
    .on("mousemove",moveTooltip)
    .on("mouseout",noradius);

console.log(d.properties.gid-1);

features.selectAll("path").on("mouseover",hideTooltip)
    .on("mousemove",hideTooltip)
    .on("mouseout",hideTooltip);

//////////////////////////////////////////

  slider.noUiSlider.on('update', function( values, handle ) {
    input.value = values[handle];



  for(var x=0; x<dataoport.length;x++){
    mask[x]=0;
  };


  limit=slider.noUiSlider.get();

  for (var j = 0; j < mask.length; j++) {
    
      if(limit>=matrix[d.properties.gid-1][j]){
        mask[j]=1;
        staticmask[j]=1;
      };
  };


if(checkvar==3){
  auxmask=mask;
}
else if(checkvar==1){
  auxmask=mask;
  for (var j = 0; j < 352; j++) {
    auxmask[j]=0;
  };

}
else if(checkvar==2){
  auxmask=mask;
  for (var j = 352; j < 374; j++) {
    auxmask[j]=0;
  };
}

else{
  auxmask=[];
}


//////////////experimental////////////////


  features.selectAll("circle")
  .data(auxmask)
  .transition()
  .duration(100)
  .attr("r", function(d,i){return (auxmask[i]*4)/zoom.scale()})
  .attr("fill","red");


    

//////////////////////////////////////////


//features.selectAll("circle").remove();
// for(var x=0;x<auxmask.length;x++){


//   if(auxmask[x]==1){
//     var feat=dataoport[x];

//     features.append("circle")
//       .attr("cx",(path2.centroid(feat)[0]))
//       .attr("cy",(path2.centroid(feat)[1]))
//       .attr("r",4/zoom.scale())
//       .attr("fill","red")
//       .on("mouseover",radius)
//       .on("mouseout",noradius);
//   }
// }

});




features.selectAll("path").attr("class",function(d) {return "q" + d.properties.mpio; });
d3.select(this).attr("class","path paint");



}//cierra la funcion clicked


function paint(state){


  var submask=[]

if(state==0){
  slider.setAttribute('disabled', true);
  for(var x=0;x<staticmask.length;x++){submask[x]=0;}
}

 else if(state==1){
  slider.removeAttribute('disabled');
    for(var x=0;x<staticmask.length;x++){submask[x]=staticmask[x];}
    for (var j = 0; j < 352; j++) {
      submask[j]=0;
    };
  }

  else if(state==2){
    slider.removeAttribute('disabled');
    for(var x=0;x<staticmask.length;x++){submask[x]=staticmask[x];}
    for (var j = 352; j < 374; j++) {
      submask[j]=0;
    };
  }

  else {
    slider.removeAttribute('disabled');
    for(var x=0;x<staticmask.length;x++){submask[x]=staticmask[x];}
    console.log("pintar todo!!: " + submask==staticmask);
  }



////////////experimental

  features.selectAll("circle")
  .data(submask)
  .transition()
  .duration(200)
  .attr("r", function(d,i){return (submask[i]*4)/zoom.scale()})
  .attr("fill","red");

////////////////////////





  // for(var x=0;x<submask.length;x++){

  //   if(submask[x]==1){
  //     var feat=dataoport[x];


  //     features.append("circle")
  //       .attr("cx",(path2.centroid(feat)[0]))
  //       .attr("cy",(path2.centroid(feat)[1]))
  //       .attr("r",4/zoom.scale())
  //       .attr("fill","red");
  //   }
  // }


}//cierra funcion paint






//función para cargar el mapa de zats
function loadzats(){
  triggerzats=0;
  triggermanz=0;
  iszat=1;
  console.log("cargar zats");
  features.selectAll("path").remove();
  features.selectAll("circle").remove();
  
d3.json("zats.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console
  
  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(topojson.feature(geodata,geodata.objects.collection).features) //generate features from TopoJSON
    .enter()
    .append("path")
    .attr("d",path2)
    //.attr("class", function(d) { return (typeof colorzat(d.properties.HOGAR) == "string" ? colorzat(d.properties.HOGAR) : ""); })
    .on("mouseover",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",clicked);



  slider.noUiSlider.destroy();  

  noUiSlider.create(slider, {
  start: limit,
  step:stepbar,
  range: {
    min:0,
    max: 7000
  },
  pips: {
    mode: 'values',
    values: [100, 1000, 2000,3000,4000, 5000, 6000, 7000],
    density: 4
  }
});


  slider.noUiSlider.on('update', function( values, handle ) {
  input.value = values[handle];

if(checkvar==3){
  sumused=sumtotal;
  slider.removeAttribute('disabled');
}
else if(checkvar==1){
  sumused=sumpublica;
  slider.removeAttribute('disabled');
}
else if(checkvar==2){
  sumused=sumprivada;
  slider.removeAttribute('disabled');
}
else{
  slider.setAttribute('disabled', true);
}



  for(var x=0; x<maxop.length;x++){
  maxop[x]=0;
}


  limit=slider.noUiSlider.get();



  for (var i = 0; i < sumused.length; i++) {
    for (var j = 0; j < sumused[0].length; j++) {
      if(limit>=sumused[i][j]){
        maxop[i]+=1;
      }
    };
  };


  colorzat = d3.scale.quantize()
    .domain([1,maxop.max()])
    .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

    features.selectAll("path").attr("class", function(d) { return (typeof colorzat(maxop[d.properties.gid-1]) == "string" ? colorzat(maxop[d.properties.gid-1]) : ""); })



});

  input.addEventListener('change', function(){
  slider.noUiSlider.set([null, this.value]);

});

slider.noUiSlider.on('change', function ( values, handle ) {
  
  if ( values[handle] < 0 ) {
    slider.noUiSlider.set(0);
  } else if ( values[handle] > 7000) {
    slider.noUiSlider.set(7000);
  }
});


});

} //cierra la funcion loadzats


function loadmanzanas(d){
  triggerzats=0;
  triggermanz=0;
  iszat=0;
  console.log("cargar manzanas");
  features.selectAll("path").remove();
  features.selectAll("circle").remove();
  

d3.json("manzanas.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console
  
  datamanz=topojson.feature(geodata,geodata.objects.collection).features;

  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(topojson.feature(geodata,geodata.objects.collection).features) //generate features from TopoJSON
    .enter()
    .append("path")
    .attr("d",path1)
    //.attr("class", function(d) { return (typeof color(d.properties.hogar) == "string" ? color(d.properties.hogar) : ""); })
    .on("mouseover",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",clicked);

  slider.noUiSlider.destroy();  

  noUiSlider.create(slider, {
  start: limit,
  step:stepbar,
  range: {
    min: 0,
    max: 7000
  },
  pips: {
    mode: 'values',
    values: [100, 1000, 2000,3000,4000, 5000, 6000, 7000],
    density: 4
  }
});



  slider.noUiSlider.on('update', function( values, handle ) {
    input.value = values[handle];

if(checkvar==3){
  colorused=colormanz;
  maxusedmanz=maxopmanz;
  slider.removeAttribute('disabled');
}
else if(checkvar==1){
  colorused=colormanzpublica;
  maxusedmanz=maxpublicamanz;
  slider.removeAttribute('disabled');
}
else if(checkvar==2){
  colorused=colormanzprivada;
  maxusedmanz=maxprivadamanz;
  slider.removeAttribute('disabled');
}
else{
  slider.setAttribute('disabled', true);
}



  limit2=Math.round(slider.noUiSlider.get()/100);
  limit=slider.noUiSlider.get();

    color = d3.scale.quantize()
      .domain([0,maxusedmanz[limit2]])
      .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

    features.selectAll("path").attr("class", function(d) { return (typeof color(colorused[limit2][d.properties.gid-1]) == "string" ? color(colorused[limit2][d.properties.gid-1]) : ""); })

});

    input.addEventListener('change', function(){
  slider.noUiSlider.set([null, this.value]);

});


slider.noUiSlider.on('change', function ( values, handle ) {
  
  if ( values[handle] < 0 ) {
    slider.noUiSlider.set(0);
  } else if ( values[handle] > 7000) {
    slider.noUiSlider.set(7000);
  }
});


});

}


