import { useCallback, useRef } from "react";
import * as Three from 'three'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import ThreeInitial, { ThreeInitialRef } from "@/components/ThreeInitial";
import logo from '@/assets/screenshoot-3.jpg'
import px from '@/assets/box/px.png'
import py from '@/assets/box/py.png'
import pz from '@/assets/box/pz.png'
import nx from '@/assets/box/nx.png'
import ny from '@/assets/box/ny.png'
import nz from '@/assets/box/nz.png'
import jay from '@/assets/jay.mp3'
import iphone from '@/assets/iphone.glb'

const textureLoader = new Three.TextureLoader()
const cubeTextureLoader = new Three.CubeTextureLoader()
const audioLoader = new Three.AudioLoader()
// 加载压缩模型要用到的
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/public/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader);

function Home() {

  const threeRef = useRef<ThreeInitialRef>(null);
  const videoRef = useRef<HTMLVideoElement>(null)

  const getInstance = () => {
    return threeRef.current?.instance()
  }

  const onTick = () => {
    
  }

  const onCreate = useCallback(async () => {
    // 图片
    const textureGeometry = new Three.PlaneGeometry(1, 1)
    const textureMaterial = new Three.MeshBasicMaterial({
      map: textureLoader.load(logo),
      transparent: true,
      side: Three.DoubleSide
    })
    const textureMesh = new Three.Mesh(textureGeometry, textureMaterial)
    textureMesh.position.set(1, 1, 0)

    // 立方体全景
    const boxGeometry = new Three.BoxGeometry(1, 1, 1)
    boxGeometry.scale(1, 1, -1)
    // [pos-x, neg-x, pos-y, neg-y, pos-z, neg-z]
    const boxMaterials = [px, nx, py, ny, pz, nz].map(item => {
      return new Three.MeshBasicMaterial({
        map: textureLoader.load(item)
      })
    })
    const boxMesh = new Three.Mesh(boxGeometry, boxMaterials)

    // 音频
    // 在场景中所有的位置和非位置相关的音效
    const audioListener = new Three.AudioListener()
    // 关联listener
    const posSound = new Three.PositionalAudio(audioListener)
    await new Promise<void>(resolve => {
      audioLoader.load(jay, buffer => {
        posSound.setBuffer(buffer)
        // 指定声音从距离声源多远的位置开始衰减其音量
        posSound.setRefDistance(30)
        posSound.play()
        // 指定声源音量随着距离衰减的速度
        posSound.setRolloffFactor(10)
        posSound.setLoop(true)
        resolve()
      })
    })

    const firstControls = new FirstPersonControls(getInstance()!.camera, getInstance()!.renderer.domElement)
    firstControls.movementSpeed = 70;
    firstControls.lookSpeed = 0.15;
    // firstControls.noFly = true;
    firstControls.lookVertical = false;
    
    // 加载手机模型播放视频
    const iphoneMesh: any = await new Promise(resolve => {
      gltfLoader.load('https://yuanshu-3d-model-demo.oss-cn-beijing.aliyuncs.com/zhinengkefu/model/jiemi.glb' || iphone, data => {
        if(data.scene) {
          data.scene.traverse(child => {
            if(child instanceof Three.Mesh && child.material instanceof Three.MeshStandardMaterial) {
              // child.material.envMap = environmentMap
              // child.material.envMapIntensity = 2 
              // if (child.name === '屏幕') {
              //   screen.mesh = child;
              //   screen.material = child.material;
              // }
              // if (child.name.includes('logo')) {
              //   child.material.metalness = 1;
              // }
              
            }
          })
          // data.scene.scale.set(60, 60, 60)
          data.scene.position.y = -5 
          data.scene.rotation.y = -Math.PI
          
          resolve(data.scene)
        }
      })
    })

    getInstance()?.scene.add(textureMesh, boxMesh, iphoneMesh)
  }, []);

  return (
    <>
      <ThreeInitial 
        ref={threeRef} 
        onCreate={onCreate}
        onTick={onTick}
      />
      <video ref={videoRef} style={{width: 0, height: 0}} />
    </>
  );
}

export default Home;
