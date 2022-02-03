varying vec2 v_uv;
uniform float millis;
//uniform sampler2D texture;
//vec4 tex;
void main() {
  //tex = texture2D(texture, v_uv);
  gl_FragColor = vec4(0.5, v_uv.y, step(0.5, mod(v_uv.x + millis / 1000.0, 1.0)), 1.0);
}