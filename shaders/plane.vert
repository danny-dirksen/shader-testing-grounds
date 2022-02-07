varying vec2 v_uv;
uniform float millis;

void main() {
  v_uv = uv;
  float distort = 1.0 + sin(1.0 * (position.x + position.y) + millis / 500.0) / 1000.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position * distort, 1.0);
}
