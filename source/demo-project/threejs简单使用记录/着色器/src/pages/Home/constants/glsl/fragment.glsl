// 设置精度
precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main(){
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 0.5;
  // 颜色
  gl_FragColor = textureColor;
}