import {
  CSSProperties,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { uniqueId } from "lodash";
import { useSize } from "ahooks";
import classnames from "classnames";
import * as THREE from "three";
import { WebGLRenderer, Scene, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { update as tweenUpdate } from "three/examples/jsm/libs/tween.module.js";
import styles from "./index.less";

export type Props = {
  style?: CSSProperties;
  className?: string;
  onTick?: () => void 
  onCreate?: () => void;
};

export type ThreeInitialRef = {
  instance: () => {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    targetScene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
  }
};

const ThreeInitial = forwardRef<ThreeInitialRef, Props>((props, ref) => {
  const { onCreate, onTick, ...nextProps } = props;

  const canvasId = useRef(uniqueId("three-canvas"));

  const renderer = useRef<THREE.WebGLRenderer>();
  const scene = useRef<THREE.Scene>();
  const targetScene = useRef<THREE.Scene>();
  const camera = useRef<THREE.PerspectiveCamera>();
  const controls = useRef<OrbitControls>();

  const containerRef = useRef(null);

  const { width = 0, height = 0 } = useSize(() => containerRef.current!) || {};

  // 初始化
  function initThree() {
    let done = false;

    // 初始化
    if (!renderer.current) {
      // 初始化渲染器
      const canvas = document.querySelector(`canvas#${canvasId.current}`);
      renderer.current = new WebGLRenderer({ canvas: canvas! });
      renderer.current.setSize(width, height);
      renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 初始化场景
      scene.current = new Scene();
      targetScene.current = new Scene();

      // 显示坐标系
      // (x轴: 红色; y轴: 绿色; z轴: 蓝色 rgb)
      const axesHelper = new THREE.AxesHelper(10)
      scene.current.add(axesHelper)

      // 初始化相机
      camera.current = new PerspectiveCamera(55, width / height, 0.1, 1000);
      camera.current.position.set(0, 0, 2);
      scene.current.add(camera.current);

      // 镜头控制器
      controls.current = new OrbitControls(
        camera.current,
        renderer.current.domElement
      );
      controls.current.target.set(0, 0, 0);
      // 转动惯性
      controls.current.enableDamping = true;
      // 禁止平移
      controls.current.enablePan = false;
      // 缩放限制
      controls.current.maxDistance = 12;
      // 垂直旋转限制
      // controls.current.minPolarAngle = Math.PI / 2;
      // controls.current.maxPolarAngle = Math.PI / 2;

      onCreate?.();
    }
    // 页面尺寸发生变化
    else {
      // 更新渲染
      renderer.current.setSize(width, height);
      renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // 更新相机
      if (camera.current) {
        camera.current.aspect = width / height;
        camera.current.updateProjectionMatrix();
      }
    }

    // 动画
    const tick = () => {
      controls.current?.update();
      tweenUpdate();
      renderer.current?.render(scene.current!, camera.current!);
      onTick?.()
      if (!done) window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      done = true;
    };
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        instance: () => {
          return {
            renderer: renderer.current!,
            scene: scene.current!,
            targetScene: targetScene.current!,
            camera: camera.current!,
            controls: controls.current!,
          };
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!width && !height) return;
    const dispose = initThree();
    return dispose;
  }, [width, height]);

  return (
    <div
      {...nextProps}
      className={classnames(styles["three-canvas"], nextProps.className)}
      ref={containerRef}
    >
      <canvas id={canvasId.current} />
    </div>
  );
});

export default ThreeInitial;
