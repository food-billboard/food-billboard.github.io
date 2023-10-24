import { useCallback, useRef } from "react";
import * as Three from 'three'
import ThreeInitial, { ThreeInitialRef } from "@/components/ThreeInitial";
import vertexShader from './constants/glsl/vetex.glsl'
import fragmentShader from './constants/glsl/fragment.glsl'

function Home() {
  const threeRef = useRef<ThreeInitialRef>(null);
  const materialRef = useRef<Three.RawShaderMaterial>()
  const clock = useRef(new Three.Clock())

  const getInstance = () => {
    return threeRef.current?.instance()
  }

  const onTick = () => {
    const elapsedTime = clock.current.getElapsedTime();
    if(materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsedTime
    }
  }

  const onCreate = useCallback(() => {

    // 纹理
    const textureLoader = new Three.TextureLoader()

    Three.PlaneGeometry

    // // 原始着色器材质
    // materialRef.current = new Three.RawShaderMaterial({
    //   vertexShader,
    //   fragmentShader,
    //   // 使透明生效
    //   transparent: true,
    //   // wireframe: true，
    //   // 传递到着色器中的变量
    //   uniforms: {
    //     uFrequency: { value: new Three.Vector2(10, 5) },
    //     uTime: { value: 0 },
    //     uColor: { value: new Three.Color('orange') },
    //     uTexture: { value: textureLoader.load('./images/头像.jpg') }
    //   }
    // })

    // 原始着色器材质
    materialRef.current = new Three.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      // 使透明生效
      transparent: true,
      // wireframe: true，
      // 传递到着色器中的变量
      uniforms: {
        uFrequency: { value: new Three.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new Three.Color('orange') },
        uTexture: { value: textureLoader.load('./头像.jpg') }
      }
    })
    
    const geometry = new Three.PlaneGeometry(1, 1, 32, 32)
    const count = geometry.attributes.position.count 
    const randoms = new Float32Array(count) 
    for(let i = 0; i < count; i ++) {
      randoms[i] = Math.random()
    }
    geometry.setAttribute('aRandom', new Three.BufferAttribute(randoms, 1))

    const mesh = new Three.Mesh(geometry, materialRef.current)
    mesh.scale.y = 2 / 3
    getInstance()?.scene.add(mesh)
  }, []);

  return (
    <ThreeInitial 
      ref={threeRef} 
      onCreate={onCreate}
      onTick={onTick}
    />
  );
}

export default Home;
