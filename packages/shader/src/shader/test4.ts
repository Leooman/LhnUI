export const testVertexShader = `
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
    }
`;
export const testFragmentShader = `
    uniform vec3 iResolution; //viewport resolution(in pixels) 
    uniform float iTime; //shader playback time (in seconds)
    uniform vec4 iMouse; //mouse pixel coords. xy:current(if MLB down),zw:click
    vec3 drawCircle(vec2 pos, float radius, float width, float power, vec4 color)
    {
        vec2 mousePos = iMouse.xy - vec2(0.5);
        float dist1 = length(pos);
        dist1 = fract((dist1 * 5.0) - fract(iTime));
        float dist2 = dist1 - radius;
        float intensity = pow(radius / abs(dist2), width); 
        vec3 col = color.rgb * intensity * power * max((0.8- abs(dist2)), 0.0);
        return col;
    }

    vec3 hsv2rgb(float h, float s, float v)
    {
        vec4 t = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
        vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
        return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
    }

    void main()
    {
        // // -1.0 ~ 1.0
        vec2 pos = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
        
        float h = mix(0.5, 0.65, length(pos));
        vec4 color = vec4(hsv2rgb(h, 1.0, 1.0), 1.0);
        float radius = 0.5;
        float width = 0.8;
        float power = 0.1;
        vec3 finalColor = drawCircle(pos, radius, width, power, color);

        pos = abs(pos);
        // vec3 finalColor = vec3(pos.x, 0.0, pos.y);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;
