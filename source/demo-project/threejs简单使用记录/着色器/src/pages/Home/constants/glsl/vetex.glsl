// 将坐标转换为裁切空间坐标
uniform mat4 projectionMatrix;
// 相机变换
uniform mat4 viewMatrix;
// 网格变换(缩放、旋转移动)
uniform mat4 modelMatrix;
// 一些自定义的变量
uniform vec2 uFrequency;
uniform float uTime;

// 当前顶点的信息
attribute vec3 position;
attribute vec2 uv;

attribute float aRandom;

// 要传递给 片元着色器的变量，在main初始化前定义
varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main(){

  // 在这里赋值
  vRandom = aRandom;
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  vElevation = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  // gl_Position 顶点位置信息
  gl_Position = projectedPosition;
}
