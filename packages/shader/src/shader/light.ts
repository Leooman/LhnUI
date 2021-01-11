export const lightVertexShader = `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() 
    {
      vNormal = normalize( normalMatrix * normal );
      vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`
// bias值决定颜色最亮值的位置
// power决定透明度变化速度及方向
export const lightFragmentShader = `
    uniform vec3 glowColor;
    uniform float bias;
    uniform float power;
    uniform float scale;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() 
    {
      float a = pow( bias + scale * abs(dot(vNormal, vPositionNormal)), power );
      gl_FragColor = vec4( glowColor, a );
    }
`