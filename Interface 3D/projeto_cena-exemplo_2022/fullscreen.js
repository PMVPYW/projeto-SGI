var width = window.innerWidth*0.75
var height = window.innerHeight;
var textures = ["assets/models/textures/Wood028_2K_Color.png", "assets/textures/Wood_024_basecolor.jpg", "assets/textures/Wood_022_basecolor.jpg"];
var normals = ["assets/textures/Wood_024_normal.jpg", "assets/textures/Wood_024_normal.jpg", "assets/textures/Wood_022_normal.jpg"];
var roughnesses = ["assets/textures/Wood_024_roughness.jpg", "assets/textures/Wood_024_roughness.jpg", "assets/textures/Wood_022_roughness.jpg"];
var lightAmb;

texture = sessionStorage.getItem("texture");
if (texture == null) {
    texture = 0;
    sessionStorage.setItem("texture", texture);
}
console.log("init: ", texture);

luminosidade = sessionStorage.getItem("luminosidade");
if (luminosidade == null) {
    luminosidade = 1.5;
    sessionStorage.setItem("luminosidade", luminosidade);
}

var darkMode = sessionStorage.getItem("darkMode");
if (darkMode == null) {
    darkMode = false;
    sessionStorage.setItem("darkMode", darkMode);
} else {
    darkMode = darkMode == "true";
}

window.addEventListener( 'resize', onWindowResize, false );

var scene = new THREE.Scene();
if (!darkMode) {
    document.getElementById("mode_selector").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16"><path id="mode_icon" d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>';

} else {
    document.getElementById("mode_selector").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16"><path id="mode_icon" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>';
}
checkDarkMode();
var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );
var renderer = new THREE.WebGLRenderer({canvas : document.getElementById("canvas"), antialias: true, precision : "highp", powerPreference: "high-performance"});
var controls = new THREE.OrbitControls(camera, renderer.domElement);
document.getElementById("loading-screen").style.display = "block";
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 29;
controls.enablePan = false; //bloqueia movimento do btn direito do mouse

/*plane*/
/*var dimensions = new THREE.PlaneGeometry(2000, 2000);
dimensions.rotateX( - Math.PI / 2);
var m2 = new THREE.ShadowMaterial();
m2.opacity = 0.5
m2.receiveShadow = true;
var plane = new THREE.Mesh(dimensions, m2)
plane.receiveShadow = true;
scene.add(plane);*/


/*luzes*/
/*var light = new THREE.DirectionalLight(0xffffff);
light.position.set(5.000 , 10.000, 8.000);
light.target.position.set(0, 0, 0);
light.castShadow = true;
const d = 10;
light.shadow.mapSize.width = 4096; // default
light.shadow.mapSize.height = 4096; // default
light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;
light.shadow.bias = - 0.0002;*/


/*var axes = new THREE.AxesHelper(10);
scene.add(axes);
var grid = new THREE.GridHelper();
scene.add(grid);*/

var candidatos = [];


renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 4;
renderer.setSize( width, height );
renderer.shadowMap.enabled = true;


camera.position.x = -5;
camera.position.y = 8;
camera.position.z = 13;
camera.lookAt(0,2,0);

var relogio = new THREE.Clock();
var misturador = new THREE.AnimationMixer(scene);
var initmap;

var GavetaBaixo, GavetaCima, portaDir, portaEsq, bandeira;

var pmremGenerator = new THREE.PMREMGenerator(renderer=renderer);

new THREE.RGBELoader()
	.setDataType( THREE.UnsignedByteType )
	.load( 'assets/HDR/hdr.hdr', function ( texture ) {

		const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

		scene.environment = envMap;

		texture.dispose();
		pmremGenerator.dispose();
    

	} );


new THREE.GLTFLoader().load(
    'assets/models/TV_animado_sala.gltf',
    function ( gltf ) {
    scene.add( gltf.scene );
    new THREE.GLTFLoader().load(
        'assets/models/flag.gltf',
        function ( gltf ) {
            gltf.scene.position.x = -9.375;
            gltf.scene.position.y = 0.05;
            gltf.scene.position.z = -1;
            //gltf.scene.position.z = -1;
            gltf.scene.rotation.y = -90;
            document.getElementById("loading-screen").style.display = "none";
        scene.add( gltf.scene );
        setInterval(check_visibility,1);
        
        scene.traverse( function(x) {
            if (x.isMesh) {
                x.castShadow = true;
                x.receiveShadow = true;			
            }
            console.log()
            if(x.name.includes("")) {
                candidatos.push(x); // adiciona o elemento x ao vetor botoes    
                console.log(x.name);  
            }
        })
        var clip = THREE.AnimationClip.findByName( gltf.animations, 'flag_movement' );
        bandeira = misturador.clipAction( clip );
        bandeira.play();
    })
    scene.traverse( function(x) {
        if (x.isMesh) {
            x.castShadow = true;
            x.receiveShadow = true;			
        }
        if(x.name.includes("drawer") || x.name.includes("door")) {
            candidatos.push(x); // adiciona o elemento x ao vetor botoes    
            console.log(x.name);  
        }
    })
    initmap = scene.getObjectByName("rack").material.map;
    var clip = THREE.AnimationClip.findByName( gltf.animations, 'AbreGavetaBaixo' );
    GavetaBaixo = misturador.clipAction( clip );
    GavetaBaixo.setLoop(THREE.LoopOnce);
    GavetaBaixo.clampWhenFinished = true;

    var clip = THREE.AnimationClip.findByName( gltf.animations, 'AbreGavetaCima' );
    GavetaCima = misturador.clipAction( clip );
    GavetaCima.setLoop(THREE.LoopOnce);
    GavetaCima.clampWhenFinished = true;

    var clip = THREE.AnimationClip.findByName( gltf.animations, 'portaDireirtaAbrir' );
    portaDir = misturador.clipAction( clip );
    portaDir.setLoop(THREE.LoopOnce);
    portaDir.clampWhenFinished = true;

    var clip = THREE.AnimationClip.findByName( gltf.animations, 'portaEsquerdaAbrir' );
    portaEsq = misturador.clipAction( clip );
    portaEsq.setLoop(THREE.LoopOnce);
    portaEsq.clampWhenFinished = true;
    apply();
}
)

var gavetaBaixoAbrir = true;
var gavetaCimaAbrir = true;
var portaDirAbrir = true;
var portaEsqAbrir = true;
var helping = true;


document.onkeydown = function(e) {
    var key_press = e.key;
    console.log(key_press);
    if (key_press == "Escape") {
        //history.pushState(-1, null);
        window.location.replace("productPage.html");
    } else if (key_press == "d") {
        reverseDarkMode();
    } else if (key_press == "h") {
        help();
    }

}
let raycaster = new THREE.Raycaster();
let rato = new THREE.Vector2();

window.onclick = function(evento) {
    rato.x = (evento.clientX / (width)) * 2 - 1;
    rato.y = -(evento.clientY / height) * 2 + 1;
    // invocar raycaster
    pegarPrimeiro();
}



function pegarPrimeiro() {
    raycaster.setFromCamera(rato, camera);
    console.log(rato);
    var intersetados = raycaster.intersectObjects(candidatos, true);
    console.log("intersected: ", intersetados);
    if (intersetados.length > 0) {
        // fazer o que houver a fazer com o primeiro interesetado
        var parent;
        /*for (var i = 0; i < intersetados.length; i++) {

            parent = intersetados[i].object.parent.name;
        }*/
        if (intersetados[0].object.name == "Plane") {
            help();
            return;
        }
        parent = intersetados[0].object.parent.name;
        switch (parent) {
            case "drawerDown":
                gavetaBaixo();
                break;
            case "drawerUp":
                gavetaCima();
                break;
            case "doorRight":
                portaDireita();
                break;
            case "doorLeft":
                portaEsquerda();
                break;
            default:
                console.log(parent, "error");
        }
    }
    console.log("raicaster")
}

//botoes do menu
document.getElementById("btnportadireita").onclick = portaDireita;
document.getElementById("btnportaesquerda").onclick = portaEsquerda;
document.getElementById("btngavetacima").onclick = gavetaCima;
document.getElementById("btngavetabaixo").onclick = gavetaBaixo;
document.getElementById("mode_selector").onclick = reverseDarkMode;
document.getElementById("btn-ajuda").onclick = help;
document.getElementById("btn-voltar").onclick = function() {window.location.replace("productPage.html");};
document.getElementById("btn_lum_baixo").onclick = function() {luminosidade = 0.5; sessionStorage.setItem("luminosidade", luminosidade);updateLuminosidade();}
document.getElementById("btn_lum_medio").onclick = function() {luminosidade = 1.5; sessionStorage.setItem("luminosidade", luminosidade);updateLuminosidade();}
document.getElementById("btn_lum_alto").onclick = function() {luminosidade = 2.5; sessionStorage.setItem("luminosidade", luminosidade);updateLuminosidade();}


function updateLuminosidade() {
    lightAmb.intensity = luminosidade;
}

//? resize window

window.addEventListener("resize", onWindowResize);



//popup control
var popUp = document.getElementById("popup");

setTimeout(function() {
    popUp.style.visibility = "hidden";
    helping = false;
}, 2000);


addLights();
animate();



function animate() {
    requestAnimationFrame( animate );
    controls.update();
    misturador.update( relogio.getDelta() );
    renderer.render( scene, camera );
}

function check_visibility() {
    max_distance = 49
    if (/*(camera.rotation.z > 2) || (camera.rotation.z < -0.25)*/ camera.position.x < -8  || camera.position.z < -2 ) {
        for (i = 1; i < 5; i++) {
            scene.getObjectByName("parede" + i).visible = false;
        }
        //scene.getObjectByName("ch??o").visible = false;  
    } else {
        for (i = 1; i < 5; i++) {
            scene.getObjectByName("parede" + i).visible = true;
        }
    }

    if (camera.rotation.x > 0 ) {
        scene.getObjectByName("ch??o").visible = false;  
        return;  
    } else {
        scene.getObjectByName("ch??o").visible = true; 
    }
}

function addLights(){
    lightAmb = new THREE.AmbientLight( 0xffffff, luminosidade); 
    scene.add( lightAmb );

    const lightDir = new THREE.DirectionalLight( 0xE5E5DA, 1 );
    lightDir.position.set(8,15,10)
    lightDir.castShadow = true;
    const d = 20;
    lightDir.shadow.camera.left = -d; // Define o Cone de Proje????o das Sombras
    lightDir.shadow.camera.right = d; // Define o Cone de Proje????o das Sombras
    lightDir.shadow.camera.top = d; // Define o Cone de Proje????o das Sombras
    lightDir.shadow.camera.bottom = -d; // Define o Cone de Proje????o das Sombras
    lightDir.shadow.camera.far = 50; // Define o Cone de Proje????o das Sombras
    lightDir.shadow.bias = -0.02; //Para Corrigir Glitches Visuais
    /*const dlHelper = new THREE.DirectionalLightHelper(lightDir, 1, 0xFF0000);
    scene.add(dlHelper);*/
    scene.add( lightDir );
}


function help() {
    if (helping) {
        return;
    }
    helping = true;
    popUp.innerHTML = "<h2>Para voltar pressione a tecla 'ESC'</h2>";
    popUp.style.visibility = "visible";

    setTimeout(function() {
        popUp.style.visibility = "hidden"; 
    }, 2000);

    setTimeout(function() {
        popUp.innerHTML = "<h2>Clique nas gavetas e portas para as abrir ou fechar</h2>";
        popUp.style.visibility = "visible"; 
    }, 2500);

    setTimeout(function() {
        popUp.style.visibility = "hidden"; 
    }, 4500);

    setTimeout(function() {
        popUp.innerHTML = "<h2>Para mudar o tema pressione a tecla 'D'</h2>";
        popUp.style.visibility = "visible"; 
    }, 5000);


    setTimeout(function() {
        popUp.style.visibility = "hidden"; 
    }, 7500);


    setTimeout(function() {
        helping = false;
    }, 7750);
}

function portaDireita(){
    if (portaDirAbrir) {
        portaDirAbrir = false;
        portaDir.paused = false;
        portaDir.timeScale = 1;
        portaDir.play();
        document.getElementById("btnportadireita").innerHTML = 'Fechar porta da direita.'
    } else {
        portaDirAbrir = true;
        portaDir.timeScale = -1;
        portaDir.paused = false;
        portaDir.play();
        document.getElementById("btnportadireita").innerHTML = 'Abrir porta da direita.'
    }
}

function portaEsquerda(){
    if (portaEsqAbrir) {
        portaEsqAbrir = false;
        portaEsq.paused = false;
        portaEsq.timeScale = 1;
        portaEsq.play();
        document.getElementById("btnportaesquerda").innerHTML = 'Fechar porta da esquerda.'
    } else {
        portaEsqAbrir = true;
        portaEsq.timeScale = -1;
        portaEsq.paused = false;
        portaEsq.play();
        document.getElementById("btnportaesquerda").innerHTML = 'Abrir porta da esquerda.'
    }
}

function gavetaCima(){
    if (gavetaCimaAbrir) {
        gavetaCimaAbrir = false;
        GavetaCima.paused = false;
        GavetaCima.timeScale = 1;
        GavetaCima.play();
        document.getElementById("btngavetacima").innerHTML = 'Fechar gaveta de cima.'
    } else {
        gavetaCimaAbrir = true;
        GavetaCima.timeScale = -1;
        GavetaCima.paused = false;
        GavetaCima.play();
        document.getElementById("btngavetacima").innerHTML = 'Abrir gaveta de cima.'
    }
}

function gavetaBaixo(){
    if (gavetaBaixoAbrir) {
        gavetaBaixoAbrir = false;
        GavetaBaixo.paused = false;
        GavetaBaixo.timeScale = 1;
        //GavetaBaixo.reset();
        GavetaBaixo.play();
        document.getElementById("btngavetabaixo").innerHTML = 'Fechar gaveta de baixo.'
    } else {
        gavetaBaixoAbrir = true;
        GavetaBaixo.timeScale = -1;
        GavetaBaixo.paused = false;
        //GavetaBaixo.reset();
        GavetaBaixo.play();
        document.getElementById("btngavetabaixo").innerHTML = 'Abrir gaveta de baixo.'
    }
}

function reverseDarkMode() {
    console.log("reversing");
    if (darkMode) {
        darkMode = false;
        document.getElementById("mode_selector").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16"><path id="mode_icon" d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>';
    
    } else {
        darkMode = true;
        document.getElementById("mode_selector").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16"><path id="mode_icon" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/><defs><linearGradient id="myGradient" gradientTransform="rotate(312.75)"><stop offset="0%" stop-color="#D9C722" /><stop offset="85.94%" stop-color="#BD620D" /></linearGradient></defs></svg>';
    }   
    checkDarkMode();
    
}

function checkDarkMode() {
    sessionStorage.setItem("darkMode", darkMode);
    btns = document.getElementsByTagName('button');
    console.log(btns);
    if (popUp == undefined) {
        popUp = document.getElementById("popup");
    }
    if (darkMode) {
        scene.background = new THREE.Color(0x2a2e2f);
        document.getElementById("body").style.backgroundColor = "#586062";
        document.getElementById("col-menu").classList.remove("menu_light");
        document.getElementById("col-menu").classList.add("menu_dark");
        for (let i = 0; i < btns.length; i++) {
            btns[i].classList.remove("button_light");
            btns[i].classList.add("button_dark");
            btns[i].style.color = "#fff";
        }
        document.getElementById("menu").style.color = "#fff";
        document.getElementById("loading-screen").style.color = "#fff";
    } else {
        scene.background = new THREE.Color(0xE5E5DA);
        document.getElementById("body").style.backgroundColor = "#EAE7D6";
        document.getElementById("col-menu").classList.remove("menu_dark");
        document.getElementById("col-menu").classList.add("menu_light");
        for (let i = 0; i < btns.length; i++) {
            btns[i].classList.remove("button_dark");
            btns[i].classList.add("button_light");
            btns[i].style.color = "#f4f4f2";
        }
        document.getElementById("menu").style.color = "#000";
        document.getElementById("loading-screen").style.color = "#000";
    }
}

function setDay() {
    darkMode = false; //a fun????o checkDarkmode vai inverter
    checkDarkMode();
}

function setNight() {
    darkMode = true; //a fun????o checkDarkmode vai inverter
    checkDarkMode();
}

function apply() {
    var loader = new THREE.TextureLoader();
     txt = loader.load(textures[texture]);
     txt.encoding = THREE.sRGBEncoding
     txt.wrapS = THREE.RepeatWrapping;
     txt.wrapT = THREE.RepeatWrapping;
     map = loader.load(normals[texture]);
     roughness_map = loader.load(roughnesses[texture]);
        var m = new THREE.MeshStandardMaterial({map: txt, normalMap: map, roughnessMap: roughness_map}); //, color: {r: 1, g: 1, b: 1}
        m.roughness = 0.5;
        m.map.repeat = {x: 4, y: 4}
        //m.map.offset = {x: 0, y: -3};
        m.side = 2;
        console.log(m.map.matrix)
        m.map.flipY = initmap.flipY;
        var rack = scene.getObjectByName("rack");
        rack.material = m;
        /*for (var i = 0; i < rack.children.length; i++) {
            rack.children[i].material = m;
        }*/
        
        //m.map = initmap;
        scene.getObjectByName("Cube017_1").material = m;
        scene.getObjectByName("Cube012_1").material = m;
        scene.getObjectByName("Cube015_1").material = m;
        scene.getObjectByName("Cube009_1").material = m;
        scene.getObjectByName("Cube006").material = m;
        scene.getObjectByName("Cube006_1").material = m;
       
}

function onWindowResize(){
    console.log("resized");
    width = window.width;
    height = window.height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}