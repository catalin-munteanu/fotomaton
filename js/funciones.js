
const video = document.querySelector("video");
const countdown = document.querySelector("#countdown");
const boton = document.querySelector("#tomarFoto");
const botonEmoji = document.querySelector("#agregarEmoji");
const canvas = document.querySelector("canvas");
const foto = document.querySelector("#foto");

const slider = document.querySelector("#tamanoEmoji");

const context = canvas.getContext("2d");

let cuenta = 0;
let fotosRestantes = 2;
let auxiliar = null;
let hayCara = false;
let datos = {};
// posenet
let poseNet;
let poses = [];

function randomEmoji() {
	const emojis = [
		"😀", "😁", "🤣", "😂", "😅", "😇", "😍", "🥰", "😜", "🤔", "🤢", "🥶", "🤗", "🤫", "😑", "😴", "🥵", "🤯"
	];
	return emojis[Math.floor(Math.random() * emojis.length)];
}

// cargó ml5
console.log('ml5 version:', ml5.version);




function tomarFoto() {
	canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
	foto.width = video.videoWidth;
  foto.height = video.videoHeight;
  context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
	const data = canvas.toDataURL("image/png");
	foto.setAttribute("src", data);
	// console.log("tomando foto", data);
  // simular un click de emoji
  const buscarCaraInterval = setInterval(() => {
    if (hayCara) {
      clearInterval(buscarCaraInterval);
      return;
    }
    if (poseNet) {
      poseNet.singlePose(foto);
      // debugger;
      // poseNet.multiPose(foto); 
    }
  }, 250)
  
}

function dibujarEmoji(params) {
	// redibujamos foto
	context.drawImage(foto, 0, 0);
	if (poses.length > 0 && poses[0].skeleton.length > 0) {
		console.log("detecto pose");	

		poses.forEach(function (pose) {
			// console.log(pose)
			const noseX = pose.pose.nose.x ;
			const noseY = pose.pose.nose.y;
			context.font = `${slider.value}px Arial`;
			context.textAlign = "center";
			context.textBaseline = "middle"; 
			context.fillText(randomEmoji(), noseX, noseY);
		});
    // hayCara = true;
	}
}

function textCountdown() {
  countdown.innerHTML = cuenta > 0 ? cuenta : "";
}

function cargoModelo(m) {
	console.log("cargo modelo");
}

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: {ideal: 640},
      height: {ideal: 480}
    }
  })
	.then(function (stream) {
    let settings = stream.getVideoTracks()[0].getSettings(); 

    let width = settings.width; 
    let height = settings.height; 

    console.log('video width: ' 
        + width + 'px'); 
    console.log('video height: ' 
        + height + 'px');

		video.srcObject = stream;
		console.log(video);
		video.play();
	})
	.catch(function (err) {
		console.error(err)
});

 const timerFoto = () => {
  cuenta = 3;
  const cuentainterval = setInterval(function() {
    textCountdown()
    --cuenta;
    if (cuenta == -1) {
      console.log("chau!");
      clearInterval(cuentainterval);
      tomarFoto();
    }
  }, 1000)
  
  //setTimeout()
  //foto = setTimeout(tomarFoto, 2000);
}; 
// una vez que arranco el stream
// video.addEventListener("canplay", tomarFoto);

// cargamos poseNet
poseNet = ml5.poseNet(cargoModelo);

// "escuchamos" poses del PoseNet
poseNet.on("pose", function(results) {
	poses = results;
	dibujarEmoji();
	console.log("poses", poses);	
});

boton.addEventListener("click", timerFoto);

botonEmoji.addEventListener("click", function (e) {
	if (poseNet) {
		// poseNet.singlePose(foto);
		poseNet.multiPose(foto); 
  }
});

function guardarImagen() {

}

function agregar_imagen_al_canvas(imagen, posicion, tamano) {
  
}