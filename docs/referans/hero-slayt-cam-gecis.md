# Hero slaydı — cam kırılması geçişi

**Kaynak:** 21st.dev · `lumina-interactive-list.tsx`
**Karar:** Bileşen olduğu gibi alınmıyor, uyarlanıyor. Gerekçeler ve yapılacaklar
planın *Faz 1b* bölümünde.

## Korunacak: cam geçişi shader'ı

Bileşenin gerçek değeri burada. Merkezden büyüyen daire, kenarında ışık kırılması,
renk sapması ve sıvı akış. Diğer dört efekt (`frost`, `ripple`, `plasma`,
`timeshift`) kaynakta boş `mix()` döndürüyor — alınmayacak.

```glsl
vec4 glassEffect(vec2 uv, float progress) {
    float time = progress * 5.0 * uSpeedMultiplier;
    vec2 uv1 = getCoverUV(uv, uTexture1Size);
    vec2 uv2 = getCoverUV(uv, uTexture2Size);

    float maxR = length(uResolution) * 0.85;
    float br   = progress * maxR;                 // dairenin anlık yarıçapı
    vec2  p    = uv * uResolution;
    vec2  c    = uResolution * 0.5;
    float d    = length(p - c);
    float nd   = d / max(br, 0.001);              // normalize uzaklık
    float param = smoothstep(br + 3.0, br - 3.0, d);   // daire içi mi

    vec4 img;
    if (param > 0.0) {
        // Kırılma: merkeze yaklaştıkça azalır, kenarda güçlenir
        float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength
                 * uGlobalIntensity
                 * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
        vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
        vec2 distUV = uv2 - dir * ro;

        // Sıvı akış — zamanla salınan hafif bozulma
        distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0))
                * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;

        // Renk sapması — R/G/B ayrı örnekleniyor
        float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity
                 * pow(smoothstep(0.3, 1.0, nd), 1.2);
        img = vec4(
            texture2D(uTexture2, distUV + dir * ca * 1.2).r,
            texture2D(uTexture2, distUV + dir * ca * 0.2).g,
            texture2D(uTexture2, distUV - dir * ca * 0.8).b,
            1.0);

        // Kenar parlaması
        if (uGlassEdgeGlow > 0.0) {
            float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
            img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
        }
    } else {
        img = texture2D(uTexture2, uv2);
    }

    vec4 oldImg = texture2D(uTexture1, uv1);
    if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
    return mix(oldImg, img, param);
}

// Yardımcı — görseli kutuya "cover" gibi oturtur
vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
}
```

Vertex shader değişmiyor:

```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## Kullanılan cam ayarları

```
transitionDuration        2.5 sn
autoSlideSpeed            5000 ms
glassRefractionStrength   1.0     kırılma gücü
glassChromaticAberration  1.0     renk sapması
glassBubbleClarity        1.0     merkez netliği
glassEdgeGlow             1.0     kenar parlaması
glassLiquidFlow           1.0     sıvı salınım
```

Ön ayarlar: `Subtle` (0.6/0.5/1.3/0.7/0.8) · `Default` · `Crystal`
(1.5/1.8/0.7/1.4/0.5) · `Liquid` (0.8/0.4/1.2/0.8/1.8).
Afloday'in sakin dili için **Subtle ile Default arası** bir yerde kalınmalı.

## Uyarlamada değişecekler

| Kaynakta | Bizde |
|---|---|
| `THREE` ve `gsap` CDN'den, ~650 KB | npm'den seçmeli import, `dynamic` + `ssr:false` |
| `gsap` ile tween | `requestAnimationFrame` + kendi easing — GSAP'a gerek yok |
| `window.innerWidth/Height` | Hero bandının ölçüsü |
| Harf harf `splitText` + 6 farklı GSAP animasyonu | Sitenin mevcut açığa çıkarma dili |
| `#0a0a0a` + `#d4af37` + Cormorant | `--mount` `--carmine` `--bronze` · Newsreader + Jost |
| 6 demo görseli (codepen) | `heroSlaytlari` — 3 slayt, `data.mjs` |
| `render()` hiç durmuyor | Görünmezken ve sekme arkadayken duracak |
| Erişilebilirlik yok | Duraklat düğmesi, ok tuşları, `prefers-reduced-motion` |
| — | **Metin görselin üzerinde** (müşteri isteği) |

## Geri düşüş

WebGL yoksa ya da azaltılmış hareket açıksa, hâlihazırda çalışan CSS
`clip-path: circle()` daire açılımı devreye giriyor. İkisi aynı işaretlemeyi
kullanacak, yalnızca geçiş katmanı değişecek.
