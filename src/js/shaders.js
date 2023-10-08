const baseShaders = {
  vsSource: /*glsl*/ `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
            gl_PointSize = 10.0;
        }`,
  fsSource: /*glsl*/ `
        precision mediump float;
        varying lowp vec4 vColor;

        void main(void) {
            gl_FragColor = vColor;
        }`,
}

const phongTextureShaders = {
  vsSource: /* glsl */ `
          attribute vec3 aVertexPosition;
          attribute vec3 aVertexNormal;   
          attribute vec2 aVertexTextureCoordinate; 
  
          uniform mat4 uModelMatrix;	   
          uniform mat4 uModelViewMatrix;
          uniform mat4 uProjectionMatrix;
  
          varying vec3 vVertexNormal;
          varying vec3 vVertexPositionInWorldCoords;
          varying lowp vec2 vTextureCoordinate;
  
          void main() {
              vec4 vertexPositionInWorldCoords = uModelMatrix * vec4(aVertexPosition, 1.0);
              vVertexPositionInWorldCoords = vec3(vertexPositionInWorldCoords);
              vVertexNormal = aVertexNormal;
              vTextureCoordinate = aVertexTextureCoordinate;

              gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);  
          }
        `,
  fsSource: /* glsl */ `
          precision mediump float;

          uniform mat3 uNormalMatrix;    
          uniform vec3 uLightPosition;    
          uniform vec3 uAmbientLightColor;
          uniform vec3 uDiffuseLightColor;

          varying vec3 vVertexNormal;
          varying vec3 vVertexPositionInWorldCoords;
          varying lowp vec2 vTextureCoordinate;
          uniform sampler2D uSampler;

          void main() {
            vec3 vectorToLightSource = normalize(uLightPosition - vVertexPositionInWorldCoords);
            vec3 normal = normalize(uNormalMatrix * vVertexNormal);
            float diffusLightWeightning = max(dot(normal, vectorToLightSource), 0.0);
            vec3 lightWeighting = uAmbientLightColor + (uDiffuseLightColor * diffusLightWeightning);
            gl_FragColor = vec4(lightWeighting.rgb, 1.0) + texture2D(uSampler, vec2(vTextureCoordinate.s, vTextureCoordinate.t));
          }
        `,
}

export { baseShaders, phongTextureShaders }
