export const floorVertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vWorldPosition2;
    uniform float offset;
    uniform float gridSize;


    void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        vWorldPosition2 = (modelMatrix * 
        vec4( position.x + mod(offset, gridSize)
            , position.y
            , position.z, 1.0)).xyz;


        gl_Position = projectionMatrix * modelViewMatrix * 
        vec4( position.x + mod(offset, gridSize)
            , position.y
            , position.z
            , 1.0 
            );
    }
`
export const floorFragmentShader = `
    varying vec3 vWorldPosition;
    varying vec3 vWorldPosition2;

    uniform float gridSize;
    uniform float offset;

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 rgb2hsv(vec3 c) {

        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);

    }

    void main() {

        float d = length(vWorldPosition2.xz);

        float x1 = mod(vWorldPosition.x, gridSize);
        float x2 = mod(-vWorldPosition.x, gridSize);

        float z1 = mod(vWorldPosition.z, gridSize);
        float z2 = mod(-vWorldPosition.z, gridSize);

        float al = 1.0-sqrt(min(min(x1, x2), min(z1, z2)));

        float b = min(1.0, al) / 2.0;
        
        vec3 c;
        float x = -vWorldPosition2.x;
        float l = mod(x - offset*2.0, gridSize * 4.0);

        if (l < 10.0) {
            c = vec3(1);
        } else 
        if (l < gridSize) {
            c = mix(vec3(0.07), 
                    hsv2rgb( vec3( l / gridSize + vWorldPosition.z/10000.0, 0.6, 1.0 ))
                    , pow(1.0 - l / gridSize, 2.0) );
            // c = vec3(1.0);
        } else { 
            c = vec3(0.07);
        }

        


        float fog = 1.0/ pow(0.0002*d, 5.0);
        gl_FragColor = vec4(c, b * fog);

    }
`