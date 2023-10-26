import { useCallback, useRef } from "react";
import * as Three from 'three'
import ThreeInitial, { ThreeInitialRef } from "@/components/ThreeInitial";
import vertexShader from './constants/glsl/vetex.glsl'
import fragmentShader from './constants/glsl/fragment.glsl'

function Advanced() {
  const threeRef = useRef<ThreeInitialRef>(null);
  const materialRef = useRef<Three.RawShaderMaterial>()
  const clock = useRef(new Three.Clock())

  const getInstance = () => {
    return threeRef.current?.instance()
  }

  const onTick = () => {
    
  }

  const onCreate = useCallback(() => {

    // 原始着色器材质
    materialRef.current = new Three.RawShaderMaterial({
      side: Three.DoubleSide,
      vertexShader,
      fragmentShader,
      // 传递到着色器中的变量
      uniforms: {
        uv: {
          value: new Three.Vector2(0, 0)
        }
      }
    })
    
    const geometry = new Three.PlaneGeometry(1, 1, 32, 32)

    const mesh = new Three.Mesh(geometry, materialRef.current)
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

export default Advanced;
