import THREE from 'three';
import Stats from 'stats';
import ServiceLocator from './service-locator';

  constructor(renderer) {
export default class Game {

    this._renderer = renderer;

    this._camera = new THREE.OrthographicCamera(0, this._width, this._height, 0, 1, 10);
    this._camera.position.z = 10;
    this._stats                           = new Stats();
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left     = '0px';
    this._stats.domElement.style.top      = '0px';

    this._stats.setMode(0);

    document.body.appendChild( this._stats.domElement );
    this._animate();

  }
  set scene(value) {
    this._scene = value;
  }
  get scene() {
    return this._scene;
  }
  resize(width, height) {
    this._camera.left   = 0;
    this._camera.right  = width;
    this._camera.top    = height;
    this._camera.bottom = 0;
    this._camera.updateProjectionMatrix();
  }
  _animate() {
    this._update();
    window.requestAnimationFrame(this._animate.bind(this));
  }
  _update() {
    if (this._scene) {
      this._scene.update();
      this._render();
    }
  }
  _render() {
    this._renderer.clear();
    this._renderer.clearDepth();
    this._renderer.render(this._scene, this._camera);
  }
}
