export const testVertexShader = `
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
    }
`;
export const testFragmentShader = `
    uniform vec3 iResolution; //viewport resolution(in pixels) 
    uniform float iTime; //shader playback time (in seconds)
    #define SHAPE_3D 1

    float time = 0.0;

    mat2 rot(float a) {
    float ca=cos(a);
    float sa=sin(a);
    return mat2(ca,sa,-sa,ca);  
    }

    float rnd(float t) {
    
    return fract(sin(t*425.512)*742.712);
    }

    float curve(float t, float d) {
    t/=d;
    return mix(rnd(floor(t)), rnd(floor(t)+1.0), pow(smoothstep(0.0,1.0,fract(t)), 10.0));
    }

    float box(vec3 p, vec3 s) {
    p=abs(p)-s;
    return max(p.x, max(p.y,p.z));
    }

    float map(vec3 p) {
    
    float t=time*.3 + curve(time, .7)*5.0;
    p.xz *= rot(t);
    p.yz *= rot(t*.3);
    
    p = abs(p)-curve(time, .21)*5.0;
    p = abs(p)-curve(time, .32)*2.0;
    
    float d = box(p, vec3(1.0+curve(time, .1)));
    
    vec3 p2 = p;
    float t2 = time;
    p2.xy *= rot(t2);
    p2.zy *= rot(t2*1.3);
    p2 = abs(p2)-curve(time,.4)*3.0;
    d = min(d, length(p2.xz)-.2);
    
    return d;
    }

    void main()
    {
    // slowed down the time because there is no music to pump it up
    time = mod(iTime*0.3, 300.0);
        
    vec2 uv = vec2(gl_FragCoord.x / iResolution.x, gl_FragCoord.y / iResolution.y);
    uv -= 0.5;
    uv /= vec2(iResolution.y / iResolution.x, 1);

    vec3 col=vec3(0);
    
        
    #if SHAPE_3D
    vec3 s=vec3(0,0,-20);
    vec3 r=normalize(vec3(-uv,1));
    vec3 p=s;
    for(int i=0; i<100; ++i) {
        float d=map(p);
        if(d<0.001) {
        uv += map(p+r)*.14;
        break;
        }
        if(d>100.0) {
        break;
        }
        p+=r*d;
    }
    
    col += 0.1/(0.1+abs(map(p+r)));
    #endif
    
    bool stop = rnd(floor(time*1.0+.3))>0.3;
    float ss = 10.0 + floor(pow(curve(time, 3.0),20.0)*100.0);
    //if(!stop) uv.x += sin(abs(uv.x+sin(time))+sin(uv.y*10+time)*0.1)*.3;
    float off = floor(uv.x*ss)/ss;
    if(stop) off=0.0;
    
    uv.y -= pow(curve(time+rnd(off+.1), .3),4.0)*.3;
    uv.x -= (curve(time+rnd(off), .4)-.5)*.1;
    
    
    
    
    for(float i=0.0; i<30.0; ++i) {
        
        vec2 p = uv;
        float t = time*.7;
        float t2 = curve(time + i, 0.7)*3.0;
        p *= rot(t+i*.2 + sin(t + i));
        p.x-=sin(t2 + i*7.3)*0.3;
        p.x += pow(curve(time, .7),4.0)*.7-.3;
        
        col += vec3(1,0.7-sin(i*3.7)*.3,0.8-sin(i))*0.002*exp(-fract(time+i*.1))/(0.003+abs(p.x));
        col += 0.001/(0.003+abs(length(p)-.3));
    }
    
    col *= 0.7+curve(time,.2)*.3;
    col = smoothstep(0.0,1.0,col);
    col = pow(col, vec3(curve(time*10.0 - length(uv)*10.0,1.0)*3.0+1.0));
    
    gl_FragColor = vec4(col, 1);
    }
`;
