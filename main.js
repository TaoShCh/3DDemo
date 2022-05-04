import "./style.css";
import * as THREE from 'three';

var width = window.innerWidth / 2; //窗口宽度
var height = window.innerHeight / 2; //窗口高度

//创建场景对象Scene
var scene = new THREE.Scene();
var geometry, material, mesh;
initMesh();
initLight();//光源设置
var camera = initCamera();//相机设置
var render = initRender();//渲染器设置
document.querySelector("#demo-canvas").appendChild(render.domElement); //body元素中插入canvas对象

function initMesh(){
    geometry = new THREE.BoxGeometry(400, 20, 200); //创建一个立方体几何对象Geometry
    material = new THREE.MeshLambertMaterial({color: 0x37b713});
    //创建网格模型
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh); //网格模型添加到场景中
}

function initLight() {
    //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(0, 0, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
    //环境光
    var ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);
}

function initCamera() {
    var k = width / height; //窗口宽高比
    var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 800);
    camera.position.set(0, 0, 300); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    return camera
}

function initRender() {
    //创建渲染器对象
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);//设置渲染区域尺寸
    renderer.setClearColor(0x13181a, 1); //设置背景颜色
    //执行渲染操作 指定场景、相机作为参数
    mesh.rotateX(0.15);
    mesh.rotateY(0.15);
    mesh.rotateZ(0.15);
    renderer.render(scene,camera);//执行渲染操作
    return renderer;
}

let socket = null;
document.querySelector('#address').value = localStorage.getItem('demo3dServerDddress') || '';

document.querySelector('#address').addEventListener('change', (event) => {
    localStorage.setItem('demo3dServerDddress', event.target.value);
});

document.querySelector('#start').addEventListener('click', () => {
    console.log("start");
    socket = new WebSocket('ws://210.45.76.228:5000');  
    socket.addEventListener('message', ({ data }) => {
        var newData = JSON.parse(data);
        const x = newData[0];
        const y = newData[1];
        const z = newData[2];
        if (filter(x, y, z)){
            setPosition(x, y, z);  
        }          
    });
});

function setPosition(x, y, z) {
    console.log('position change: x: %d, y: %d, z: %d', x, y, z);
    var xAngle = Math.atan(x / Math.sqrt(y ** 2 + z ** 2 ));
    var zAngle = Math.atan(y / Math.sqrt(x ** 2 + z ** 2));
    var yAngle = Math.atan(Math.sqrt(x ** 2 + y ** 2) / z);
    mesh.rotation.x = xAngle;
    mesh.rotation.y = yAngle;
    mesh.rotation.z = zAngle;
    render.render(scene,camera);
}

function filter(x, y, z){
    if(Math.abs(x) < 1500 && Math.abs(y) < 1500 && Math.abs(z) < 1500)
        return true;
    else return false;
}
