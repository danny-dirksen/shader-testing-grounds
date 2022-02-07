const float padding = 0.1;
const float cellWidth = (1.0 - 3.0 * padding) / 3.0;
const float pi = 3.1415926;
const float scale = 2000.0;
const float distFreq = 0.3 * scale;
const float distMag = 0.1 / distFreq;

varying vec2 v_uv;
uniform float millis;
uniform sampler2D tex;

float softClamp(float x) {
  return 1.0 - 1.0 / (x + 1.0);
}

vec3 pixel(vec2 pos, vec3 color) {
  float x = pos.x;
  float y = pos.y;
  float threeX = 3.0 * x;
  float brightness = softClamp(10.0 * sin(y * pi) * abs(sin(threeX * pi)));
  if (threeX < 1.0) return vec3(color.x * brightness, 0.0, 0.0);
  if (threeX < 2.0) return vec3(0.0, color.y * brightness, 0.0);
  return vec3(0.0, 0.0, color.z * brightness);
}

float stripe(float x) {
  return softClamp((1.0 + sin(x / 1.0)) * 4.0);
}

float jaggedSpikes(float x) {
  float modX = mod(x, 8.0);
  return clamp(modX, 0.0, 1.0) - clamp(modX - 1.0, 0.0, 1.0) - clamp(modX - 4.0, 0.0, 1.0) + clamp(modX - 5.0, 0.0, 1.0);
}

float smoother(float x) {
  return x - sin(2.0 * pi * x) / (2.0 * pi);
}

void main() {
  vec2 distorted = v_uv;
  distorted.x += cos(distorted.y * pi * distFreq) * distMag;
  distorted.y += cos(distorted.x * pi * distFreq) * distMag;
  distorted.x += floor(mod(distorted.y * scale, 2.0)) * smoother(jaggedSpikes(millis / 1000.0)) / scale;
  distorted.y += floor(mod(distorted.x * scale, 2.0)) * smoother(jaggedSpikes(millis / 1000.0 - 2.0)) / scale;
  vec2 fractPos = fract(distorted * scale);
  vec2 boxPos = distorted * scale - fractPos;
  float rad = distance(boxPos, vec2(scale / 2.0, scale / 2.0));
  float angle = atan(boxPos.x - scale / 2.0, boxPos.y - scale / 2.0);
  float polarFunc = rad + sin(angle * 20.0);

  vec3 image = texture2D(tex, boxPos / scale).xyz;

  vec3 stripes = vec3(
    stripe(millis / 300.0 + 11.0 + polarFunc),
    stripe(millis / 300.0 + 12.0 + polarFunc),
    stripe(millis / 300.0 + 13.0 + polarFunc)
  );
  //stripes = vec3(1.0, 0.5, 1.0);
  gl_FragColor = vec4(pixel(fractPos, image * stripes), 1.0);
}