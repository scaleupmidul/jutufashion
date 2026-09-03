// High-resolution, clean-background vector renders matching JUTU footwear

export const SHOE_IMAGES = {
  // 1. Women's Canvas Cruiser - Sea Spray (Light Blue canvas sneaker, white sole)
  canvasCruiserSeaSpray: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blueCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8bb1c5" />
          <stop offset="60%" stop-color="#7298ac" />
          <stop offset="100%" stop-color="#5f8396" />
        </linearGradient>
        <linearGradient id="blueCanvasDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#7298ac" />
          <stop offset="100%" stop-color="#56788b" />
        </linearGradient>
        <linearGradient id="whiteSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#f0ebe0" />
          <stop offset="100%" stop-color="#ded7cb" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#4a4036" />
        </filter>
      </defs>
      <g filter="url(#softShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#whiteSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 55,208 Q 240,218 458,205" fill="none" stroke="#e4ded3" stroke-width="1" />
        <path d="M 44,197 C 52,155 85,125 150,115 C 190,108 245,130 290,148 C 340,168 395,172 445,178 C 466,180 468,190 460,195 C 410,190 320,188 230,188 C 120,188 70,191 44,197 Z" fill="url(#blueCanvas)" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="url(#blueCanvasDark)" opacity="0.9" />
        <path d="M 92,108 C 110,122 135,120 152,118" fill="none" stroke="#9ec1d4" stroke-width="3" stroke-linecap="round" />
        <path d="M 160,116 C 195,128 238,145 285,153" fill="none" stroke="#63889b" stroke-width="8" stroke-linecap="round" />
        <circle cx="175" cy="122" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="198" cy="130" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="222" cy="138" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="246" cy="145" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <circle cx="270" cy="151" r="3.5" fill="#eef5f8" stroke="#5a7e91" stroke-width="1.5" />
        <path d="M 175,122 L 202,128 M 198,130 L 225,136 M 222,138 L 249,143 M 246,145 L 273,149" stroke="#92b8cb" stroke-width="3" stroke-linecap="round" />
        <path d="M 70,185 C 95,155 130,140 170,135" fill="none" stroke="#8cb2c5" stroke-width="1" stroke-dasharray="3,2" />
        <path d="M 150,118 C 220,150 320,170 435,178" fill="none" stroke="#8cb2c5" stroke-width="1" stroke-dasharray="3,2" />
        <path d="M 380,180 C 420,182 450,188 458,193" fill="none" stroke="#8cb2c5" stroke-width="1" stroke-dasharray="3,2" />
      </g>
    </svg>
  `)}`,

  // 2. Men's JUTU Slide - Anthracite (Charcoal grey knit strap, grey contoured sole)
  slideAnthracite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="anthraciteSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#555350" />
          <stop offset="45%" stop-color="#464442" />
          <stop offset="100%" stop-color="#343331" />
        </linearGradient>
        <linearGradient id="anthraciteStrap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6a6865" />
          <stop offset="50%" stop-color="#565451" />
          <stop offset="100%" stop-color="#41403e" />
        </linearGradient>
        <pattern id="knitTextureGrey" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="#62605d" opacity="0.6"/>
          <circle cx="4" cy="4" r="1" fill="#3a3937" />
        </pattern>
        <filter id="slideShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.14" flood-color="#2a2520" />
        </filter>
      </defs>
      <g filter="url(#slideShadow)">
        <path d="M 45,198 C 50,215 85,225 150,225 C 260,225 380,225 455,212 C 468,208 465,192 450,188 C 380,172 320,170 230,173 C 140,176 80,178 50,186 C 42,189 42,193 45,198 Z" fill="url(#anthraciteSole)" />
        <path d="M 52,216 Q 250,223 456,206" fill="none" stroke="#2e2d2b" stroke-width="2.5" />
        <path d="M 65,220 L 70,224 M 100,222 L 105,226 M 140,223 L 145,226 M 190,223 L 195,226 M 250,223 L 255,226 M 320,222 L 325,225 M 390,218 L 395,222 M 435,212 L 440,215" stroke="#2e2d2b" stroke-width="2" stroke-linecap="round" />
        <path d="M 50,186 C 85,178 140,175 225,173 C 315,170 380,172 448,188 C 435,183 370,177 235,177 C 130,177 75,182 50,186 Z" fill="#696764" opacity="0.6" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#anthraciteStrap)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#knitTextureGrey)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175" fill="none" stroke="#797672" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 152,174 C 185,165 240,162 338,174" fill="none" stroke="#373533" stroke-width="3" />
      </g>
    </svg>
  `)}`,

  // 3. Women's JUTU Flip Flop - Natural Black
  flipFlopBlack: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blackFlipSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#383838" />
          <stop offset="45%" stop-color="#2a2a2a" />
          <stop offset="100%" stop-color="#161616" />
        </linearGradient>
        <linearGradient id="blackThong" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3a3a3a" />
          <stop offset="60%" stop-color="#232323" />
          <stop offset="100%" stop-color="#121212" />
        </linearGradient>
        <pattern id="wovenBlack" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="3" fill="#2d2d2d"/>
          <rect y="3" width="6" height="3" fill="#181818"/>
        </pattern>
        <filter id="flipShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.15" flood-color="#222" />
        </filter>
      </defs>
      <g filter="url(#flipShadow)">
        <path d="M 50,196 C 55,212 90,222 160,222 C 270,222 375,222 452,210 C 465,206 462,192 448,188 C 380,172 320,171 230,173 C 140,175 85,178 55,185 C 47,188 47,192 50,196 Z" fill="url(#blackFlipSole)" />
        <path d="M 58,214 Q 250,221 448,205" fill="none" stroke="#111" stroke-width="2.5" />
        <path d="M 70,217 L 75,221 M 110,219 L 115,222 M 160,220 L 165,223 M 220,220 L 225,223 M 290,220 L 295,223 M 360,218 L 365,221 M 420,212 L 425,215" stroke="#111" stroke-width="2" stroke-linecap="round" />
        <path d="M 55,185 C 90,178 145,175 230,173 C 320,171 385,173 445,188 C 430,183 365,178 235,177 C 135,177 80,181 55,185 Z" fill="#4d4d4d" opacity="0.5" />
        <path d="M 320,173 L 312,128 L 328,128 Z" fill="#1f1f1f" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#blackThong)" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#wovenBlack)" opacity="0.7" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#blackThong)" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#wovenBlack)" opacity="0.7" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 355,140 375,160 388,180" fill="none" stroke="#505050" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 4. Men's JUTU Slide - Natural Black
  slideNaturalBlack: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blackSlideSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3d3d3d" />
          <stop offset="45%" stop-color="#292929" />
          <stop offset="100%" stop-color="#141414" />
        </linearGradient>
        <linearGradient id="blackStrap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#404040" />
          <stop offset="50%" stop-color="#282828" />
          <stop offset="100%" stop-color="#181818" />
        </linearGradient>
        <pattern id="knitTextureBlack" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="#353535" opacity="0.7"/>
          <circle cx="4" cy="4" r="1" fill="#111" />
        </pattern>
        <filter id="slideBlackShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.15" flood-color="#1a1a1a" />
        </filter>
      </defs>
      <g filter="url(#slideBlackShadow)">
        <path d="M 45,198 C 50,215 85,225 150,225 C 260,225 380,225 455,212 C 468,208 465,192 450,188 C 380,172 320,170 230,173 C 140,176 80,178 50,186 C 42,189 42,193 45,198 Z" fill="url(#blackSlideSole)" />
        <path d="M 52,216 Q 250,223 456,206" fill="none" stroke="#0f0f0f" stroke-width="2.5" />
        <path d="M 65,220 L 70,224 M 100,222 L 105,226 M 140,223 L 145,226 M 190,223 L 195,226 M 250,223 L 255,226 M 320,222 L 325,225 M 390,218 L 395,222 M 435,212 L 440,215" stroke="#0f0f0f" stroke-width="2" stroke-linecap="round" />
        <path d="M 50,186 C 85,178 140,175 225,173 C 315,170 380,172 448,188 C 435,183 370,177 235,177 C 130,177 75,182 50,186 Z" fill="#525252" opacity="0.6" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#blackStrap)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#knitTextureBlack)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175" fill="none" stroke="#525252" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 152,174 C 185,165 240,162 338,174" fill="none" stroke="#181818" stroke-width="3" />
      </g>
    </svg>
  `)}`,

  // 5. Women's JUTU Slide - Sand
  slideSand: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="sandSlideSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ded4c5" />
          <stop offset="45%" stop-color="#ccbfae" />
          <stop offset="100%" stop-color="#b4a694" />
        </linearGradient>
        <linearGradient id="sandStrap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e3dbcd" />
          <stop offset="50%" stop-color="#d1c6b5" />
          <stop offset="100%" stop-color="#b8ab99" />
        </linearGradient>
        <pattern id="knitTextureSand" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="#ded5c6" opacity="0.6"/>
          <circle cx="4" cy="4" r="1" fill="#aa9c8b" />
        </pattern>
        <filter id="slideSandShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#5a4e3e" />
        </filter>
      </defs>
      <g filter="url(#slideSandShadow)">
        <path d="M 45,198 C 50,215 85,225 150,225 C 260,225 380,225 455,212 C 468,208 465,192 450,188 C 380,172 320,170 230,173 C 140,176 80,178 50,186 C 42,189 42,193 45,198 Z" fill="url(#sandSlideSole)" />
        <path d="M 52,216 Q 250,223 456,206" fill="none" stroke="#9e917f" stroke-width="2.5" />
        <path d="M 65,220 L 70,224 M 100,222 L 105,226 M 140,223 L 145,226 M 190,223 L 195,226 M 250,223 L 255,226 M 320,222 L 325,225 M 390,218 L 395,222 M 435,212 L 440,215" stroke="#9e917f" stroke-width="2" stroke-linecap="round" />
        <path d="M 50,186 C 85,178 140,175 225,173 C 315,170 380,172 448,188 C 435,183 370,177 235,177 C 130,177 75,182 50,186 Z" fill="#ede5d8" opacity="0.8" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#sandStrap)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175 C 310,165 260,160 215,163 C 175,166 155,172 145,175 Z" fill="url(#knitTextureSand)" />
        <path d="M 145,175 C 160,120 195,85 240,85 C 290,85 330,120 345,175" fill="none" stroke="#ece4d6" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 152,174 C 185,165 240,162 338,174" fill="none" stroke="#a49683" stroke-width="3" />
      </g>
    </svg>
  `)}`,

  // 6. Women's & Men's JUTU Flip Flop - Sand
  flipFlopSand: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="sandFlipSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ded4c5" />
          <stop offset="45%" stop-color="#ccbfae" />
          <stop offset="100%" stop-color="#b4a694" />
        </linearGradient>
        <linearGradient id="sandThong" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e3dbcd" />
          <stop offset="60%" stop-color="#cfc4b3" />
          <stop offset="100%" stop-color="#b5a796" />
        </linearGradient>
        <pattern id="wovenSand" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="3" fill="#d9cebd"/>
          <rect y="3" width="6" height="3" fill="#c0b3a1"/>
        </pattern>
        <filter id="flipSandShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#5a4e3e" />
        </filter>
      </defs>
      <g filter="url(#flipSandShadow)">
        <path d="M 50,196 C 55,212 90,222 160,222 C 270,222 375,222 452,210 C 465,206 462,192 448,188 C 380,172 320,171 230,173 C 140,175 85,178 55,185 C 47,188 47,192 50,196 Z" fill="url(#sandFlipSole)" />
        <path d="M 58,214 Q 250,221 448,205" fill="none" stroke="#9e917f" stroke-width="2.5" />
        <path d="M 70,217 L 75,221 M 110,219 L 115,222 M 160,220 L 165,223 M 220,220 L 225,223 M 290,220 L 295,223 M 360,218 L 365,221 M 420,212 L 425,215" stroke="#9e917f" stroke-width="2" stroke-linecap="round" />
        <path d="M 55,185 C 90,178 145,175 230,173 C 320,171 385,173 445,188 C 430,183 365,178 235,177 C 135,177 80,181 55,185 Z" fill="#ede5d8" opacity="0.8" />
        <path d="M 320,173 L 312,128 L 328,128 Z" fill="#b9ab99" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#sandThong)" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 315,138 270,146 195,182 Z" fill="url(#wovenSand)" opacity="0.7" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#sandThong)" />
        <path d="M 315,128 C 355,140 375,160 388,180 C 378,182 355,165 315,138 Z" fill="url(#wovenSand)" opacity="0.7" />
        <path d="M 180,176 C 210,135 260,105 315,128 C 355,140 375,160 388,180" fill="none" stroke="#ede5d8" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 7. Women's Canvas Cruiser Slip On - Warm White
  canvasCruiserSlipOnWarmWhite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="warmWhiteCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="50%" stop-color="#f0ebe0" />
          <stop offset="100%" stop-color="#e2dacf" />
        </linearGradient>
        <linearGradient id="warmWhiteSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ebe5d8" />
          <stop offset="100%" stop-color="#ded6c7" />
        </linearGradient>
        <filter id="slipOnShadow1" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.1" flood-color="#4a4036" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow1)">
        <path d="M 45,212 C 60,225 120,232 220,232 C 350,232 445,225 465,210 C 472,205 470,193 458,191 C 420,186 360,185 240,185 C 120,185 70,188 40,195 C 34,197 36,204 45,212 Z" fill="url(#warmWhiteSole)" stroke="#dcd4c5" stroke-width="1.5" />
        <path d="M 50,206 Q 240,216 458,203" fill="none" stroke="#dcd4c5" stroke-width="1" />
        <path d="M 42,196 C 50,152 82,120 150,110 C 185,105 235,125 275,142 C 325,162 385,166 438,172 C 460,175 464,186 456,192 C 410,187 320,186 230,186 C 120,186 68,190 42,196 Z" fill="url(#warmWhiteCanvas)" />
        <path d="M 42,194 C 40,165 52,126 88,105 C 108,94 130,97 145,115 C 138,138 120,160 92,178 C 70,188 52,193 42,194 Z" fill="#e5ded2" opacity="0.8" />
        <path d="M 88,105 C 105,118 128,116 145,115" fill="none" stroke="#d5ccc0" stroke-width="3" stroke-linecap="round" />
        <path d="M 148,114 C 158,124 168,142 172,154 L 160,156 C 155,144 146,128 138,118 Z" fill="#d2c9bd" />
        <path d="M 148,114 L 160,156 M 153,116 L 165,155" stroke="#b8ad9f" stroke-width="1" />
        <path d="M 145,115 C 215,145 315,165 430,173" fill="none" stroke="#d8cfc3" stroke-width="1" stroke-dasharray="3,2" />
      </g>
    </svg>
  `)}`,

  // 8. Women's Cruiser Slip On - Blizzard (Crisp White Textured Knit)
  cruiserSlipOnBlizzard: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="blizzardWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#fafafa" />
          <stop offset="100%" stop-color="#eeeeee" />
        </linearGradient>
        <pattern id="knitDiamond" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3 L3 0 L6 3 L3 6 Z" fill="#f0f0f0"/>
        </pattern>
        <filter id="slipOnShadow2" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.09" flood-color="#444" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow2)">
        <path d="M 45,212 C 60,225 120,232 220,232 C 350,232 445,225 465,210 C 472,205 470,193 458,191 C 420,186 360,185 240,185 C 120,185 70,188 40,195 C 34,197 36,204 45,212 Z" fill="#ffffff" stroke="#e0e0e0" stroke-width="1.5" />
        <path d="M 50,206 Q 240,216 458,203" fill="none" stroke="#e8e8e8" stroke-width="1" />
        <path d="M 42,196 C 50,152 82,120 150,110 C 185,105 235,125 275,142 C 325,162 385,166 438,172 C 460,175 464,186 456,192 C 410,187 320,186 230,186 C 120,186 68,190 42,196 Z" fill="url(#blizzardWhite)" />
        <path d="M 42,196 C 50,152 82,120 150,110 C 185,105 235,125 275,142 C 325,162 385,166 438,172 C 460,175 464,186 456,192 C 410,187 320,186 230,186 C 120,186 68,190 42,196 Z" fill="url(#knitDiamond)" opacity="0.6" />
        <path d="M 42,194 C 40,165 52,126 88,105 C 108,94 130,97 145,115 C 138,138 120,160 92,178 C 70,188 52,193 42,194 Z" fill="#f5f5f5" />
        <path d="M 88,105 C 105,118 128,116 145,115" fill="none" stroke="#e0e0e0" stroke-width="3" stroke-linecap="round" />
        <path d="M 148,114 C 158,124 168,142 172,154 L 160,156 C 155,144 146,128 138,118 Z" fill="#e8e8e8" />
      </g>
    </svg>
  `)}`,

  // 9. Women's Runner NZ Slip On - Mushroom
  runnerSlipOnMushroom: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="mushroomKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#cfc4b3" />
          <stop offset="50%" stop-color="#bbaea0" />
          <stop offset="100%" stop-color="#a49688" />
        </linearGradient>
        <linearGradient id="mushroomSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#cfc3b3" />
          <stop offset="50%" stop-color="#baad9c" />
          <stop offset="100%" stop-color="#a89a87" />
        </linearGradient>
        <filter id="slipOnShadow3" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#4a3e30" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow3)">
        <path d="M 50,210 C 65,225 130,230 220,228 C 340,226 430,215 455,200 C 462,195 458,185 448,183 C 400,178 340,178 240,180 C 130,182 75,188 45,196 C 40,198 42,204 50,210 Z" fill="url(#mushroomSole)" />
        <path d="M 45,196 C 52,148 100,110 170,95 C 210,88 260,110 305,130 C 355,152 405,158 440,168 C 456,172 458,182 450,186 C 400,180 320,180 230,180 C 120,180 70,188 45,196 Z" fill="url(#mushroomKnit)" />
        <path d="M 125,82 C 128,70 135,70 138,82 L 138,98 L 125,98 Z" fill="none" stroke="#948473" stroke-width="3" stroke-linecap="round" />
        <path d="M 115,102 C 128,88 152,88 170,95 C 162,118 145,135 125,148 C 110,140 108,120 115,102 Z" fill="#a99a89" />
        <path d="M 115,102 C 128,88 152,88 170,95" fill="none" stroke="#948473" stroke-width="2.5" />
        <path d="M 130,135 Q 165,115 200,120 Q 235,128 270,145" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 140,148 Q 180,125 220,132 Q 260,140 300,155" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 155,160 Q 200,138 245,145 Q 290,152 335,163" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 175,170 Q 225,150 275,155 Q 325,162 375,170" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
        <path d="M 205,176 Q 255,160 305,165 Q 355,170 410,174" fill="none" stroke="#9b8c7b" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 10. Women's Runner NZ Slip On - Anthracite
  runnerSlipOnAnthracite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="anthraciteKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#55524e" />
          <stop offset="50%" stop-color="#423f3c" />
          <stop offset="100%" stop-color="#2d2b29" />
        </linearGradient>
        <linearGradient id="anthraciteSoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4d4a46" />
          <stop offset="50%" stop-color="#3b3835" />
          <stop offset="100%" stop-color="#282624" />
        </linearGradient>
        <filter id="slipOnShadow4" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.15" flood-color="#111" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow4)">
        <path d="M 50,210 C 65,225 130,230 220,228 C 340,226 430,215 455,200 C 462,195 458,185 448,183 C 400,178 340,178 240,180 C 130,182 75,188 45,196 C 40,198 42,204 50,210 Z" fill="url(#anthraciteSoleGrad)" />
        <path d="M 45,196 C 52,148 100,110 170,95 C 210,88 260,110 305,130 C 355,152 405,158 440,168 C 456,172 458,182 450,186 C 400,180 320,180 230,180 C 120,180 70,188 45,196 Z" fill="url(#anthraciteKnit)" />
        <path d="M 125,82 C 128,70 135,70 138,82 L 138,98 L 125,98 Z" fill="none" stroke="#66625d" stroke-width="3" stroke-linecap="round" />
        <path d="M 115,102 C 128,88 152,88 170,95 C 162,118 145,135 125,148 C 110,140 108,120 115,102 Z" fill="#3b3936" />
        <path d="M 115,102 C 128,88 152,88 170,95" fill="none" stroke="#5a5651" stroke-width="2.5" />
        <path d="M 130,135 Q 165,115 200,120 Q 235,128 270,145" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 140,148 Q 180,125 220,132 Q 260,140 300,155" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 155,160 Q 200,138 245,145 Q 290,152 335,163" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 175,170 Q 225,150 275,155 Q 325,162 375,170" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
        <path d="M 205,176 Q 255,160 305,165 Q 355,170 410,174" fill="none" stroke="#2a2826" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 11. Women's Runner NZ Slip On - Dark Navy
  runnerSlipOnDarkNavy: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="navyKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a3342" />
          <stop offset="50%" stop-color="#1b2230" />
          <stop offset="100%" stop-color="#101520" />
        </linearGradient>
        <linearGradient id="navySoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#232a38" />
          <stop offset="50%" stop-color="#161c28" />
          <stop offset="100%" stop-color="#0d111a" />
        </linearGradient>
        <filter id="slipOnShadow5" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.16" flood-color="#0a0d14" />
        </filter>
      </defs>
      <g filter="url(#slipOnShadow5)">
        <path d="M 50,210 C 65,225 130,230 220,228 C 340,226 430,215 455,200 C 462,195 458,185 448,183 C 400,178 340,178 240,180 C 130,182 75,188 45,196 C 40,198 42,204 50,210 Z" fill="url(#navySoleGrad)" />
        <path d="M 45,196 C 52,148 100,110 170,95 C 210,88 260,110 305,130 C 355,152 405,158 440,168 C 456,172 458,182 450,186 C 400,180 320,180 230,180 C 120,180 70,188 45,196 Z" fill="url(#navyKnit)" />
        <path d="M 125,82 C 128,70 135,70 138,82 L 138,98 L 125,98 Z" fill="none" stroke="#37455c" stroke-width="3" stroke-linecap="round" />
        <path d="M 115,102 C 128,88 152,88 170,95 C 162,118 145,135 125,148 C 110,140 108,120 115,102 Z" fill="#18202d" />
        <path d="M 115,102 C 128,88 152,88 170,95" fill="none" stroke="#2d394d" stroke-width="2.5" />
        <path d="M 130,135 Q 165,115 200,120 Q 235,128 270,145" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 140,148 Q 180,125 220,132 Q 260,140 300,155" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 155,160 Q 200,138 245,145 Q 290,152 335,163" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 175,170 Q 225,150 275,155 Q 325,162 375,170" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
        <path d="M 205,176 Q 255,160 305,165 Q 355,170 410,174" fill="none" stroke="#121822" stroke-width="2" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 12. Men's Tree Dasher 2 - Sage Green (Athletic running shoe with laces & performance sole)
  dasherSageGreen: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="sageKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8ba192" />
          <stop offset="60%" stop-color="#6d8073" />
          <stop offset="100%" stop-color="#546559" />
        </linearGradient>
        <linearGradient id="dasherSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f0efe9" />
          <stop offset="100%" stop-color="#d9d7ce" />
        </linearGradient>
        <filter id="dasherShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#3c4a40" />
        </filter>
      </defs>
      <g filter="url(#dasherShadow)">
        <path d="M 45,214 C 60,228 130,235 230,234 C 350,233 440,222 468,206 C 475,200 470,188 456,186 C 410,180 340,180 235,182 C 120,184 70,189 40,196 C 34,198 36,206 45,214 Z" fill="url(#dasherSole)" stroke="#dedcd3" stroke-width="1.5" />
        <path d="M 44,197 C 52,148 95,115 160,105 C 205,98 255,122 298,142 C 345,164 398,168 446,176 C 465,178 468,189 458,194 C 410,188 320,186 230,186 C 120,186 70,191 44,197 Z" fill="url(#sageKnit)" />
        <path d="M 160,108 C 200,122 245,140 290,148" fill="none" stroke="#5a6c60" stroke-width="6" stroke-linecap="round" />
        <circle cx="178" cy="116" r="3.5" fill="#f4f4f0" />
        <circle cx="204" cy="125" r="3.5" fill="#f4f4f0" />
        <circle cx="230" cy="133" r="3.5" fill="#f4f4f0" />
        <circle cx="256" cy="140" r="3.5" fill="#f4f4f0" />
        <path d="M 178,116 L 208,123 M 204,125 L 234,131 M 230,133 L 260,138" stroke="#48574c" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,125 90,105 C 112,94 135,97 150,116 C 142,138 122,160 92,180 C 70,190 52,195 45,195 Z" fill="#5b6c5f" opacity="0.8" />
      </g>
    </svg>
  `)}`,

  // 13. Women's Tree Runner - Mist Blue (Iconic everyday sneaker)
  treeRunnerMistBlue: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="mistKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#93afbc" />
          <stop offset="60%" stop-color="#7895a2" />
          <stop offset="100%" stop-color="#5f7b88" />
        </linearGradient>
        <linearGradient id="mistSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ede7db" />
          <stop offset="100%" stop-color="#ded6c6" />
        </linearGradient>
        <filter id="mistShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#3b4d56" />
        </filter>
      </defs>
      <g filter="url(#mistShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#mistSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,152 88,122 152,112 C 192,105 242,128 288,145 C 338,165 392,170 442,176 C 462,178 466,189 458,194 C 410,189 320,187 230,187 C 120,187 70,191 44,197 Z" fill="url(#mistKnit)" />
        <circle cx="172" cy="120" r="3.5" fill="#f0f5f8" />
        <circle cx="196" cy="128" r="3.5" fill="#f0f5f8" />
        <circle cx="220" cy="135" r="3.5" fill="#f0f5f8" />
        <circle cx="244" cy="142" r="3.5" fill="#f0f5f8" />
        <circle cx="268" cy="148" r="3.5" fill="#f0f5f8" />
        <path d="M 172,120 L 200,126 M 196,128 L 224,133 M 220,135 L 248,140 M 244,142 L 272,146" stroke="#9bbccc" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="#658391" opacity="0.8" />
      </g>
    </svg>
  `)}`,

  // 14. Wool Lounger - Dapple Grey (Cozy slip-on loafer)
  woolLoungerDappleGrey: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="dappleWool" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#969696" />
          <stop offset="50%" stop-color="#7a7a7a" />
          <stop offset="100%" stop-color="#616161" />
        </linearGradient>
        <linearGradient id="loungerSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#eae5da" />
          <stop offset="100%" stop-color="#dad4c7" />
        </linearGradient>
        <filter id="loungerShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.12" flood-color="#333" />
        </filter>
      </defs>
      <g filter="url(#loungerShadow)">
        <path d="M 45,212 C 60,225 120,232 220,232 C 350,232 445,225 465,210 C 472,205 470,193 458,191 C 420,186 360,185 240,185 C 120,185 70,188 40,195 C 34,197 36,204 45,212 Z" fill="url(#loungerSole)" stroke="#dcd4c5" stroke-width="1.5" />
        <path d="M 42,196 C 50,152 82,118 150,108 C 185,103 235,123 275,140 C 325,160 385,165 438,171 C 460,174 464,185 456,191 C 410,186 320,185 230,185 C 120,185 68,189 42,196 Z" fill="url(#dappleWool)" />
        <path d="M 42,194 C 40,165 52,126 88,105 C 108,94 130,97 145,115 C 138,138 120,160 92,178 C 70,188 52,193 42,194 Z" fill="#696969" opacity="0.8" />
        <path d="M 88,105 C 105,118 128,116 145,115" fill="none" stroke="#a0a0a0" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 15. Men's Tree Piper - Chalk White
  treePiperChalkWhite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="piperWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f5f2eb" />
          <stop offset="100%" stop-color="#e8e4d8" />
        </linearGradient>
        <linearGradient id="piperSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ede7db" />
          <stop offset="100%" stop-color="#ddd5c5" />
        </linearGradient>
        <filter id="piperShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.1" flood-color="#4a4036" />
        </filter>
      </defs>
      <g filter="url(#piperShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#piperSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,155 85,125 150,115 C 190,108 245,130 290,148 C 340,168 395,172 445,178 C 466,180 468,190 460,195 C 410,190 320,188 230,188 C 120,188 70,191 44,197 Z" fill="url(#piperWhite)" />
        <circle cx="175" cy="122" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="198" cy="130" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="222" cy="138" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="246" cy="145" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <circle cx="270" cy="151" r="3.5" fill="#f0ebe0" stroke="#d5cebe" stroke-width="1.5" />
        <path d="M 175,122 L 202,128 M 198,130 L 225,136 M 222,138 L 249,143 M 246,145 L 273,149" stroke="#cfc7b6" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="#eae4d8" opacity="0.9" />
      </g>
    </svg>
  `)}`,

  // 16. Women's Wool Runner Mizzle - Storm Grey (Weather-resistant)
  woolRunnerMizzleGrey: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="stormKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#707a84" />
          <stop offset="60%" stop-color="#5a626a" />
          <stop offset="100%" stop-color="#444b52" />
        </linearGradient>
        <linearGradient id="mizzleSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#e8e5dc" />
          <stop offset="100%" stop-color="#d5d0c4" />
        </linearGradient>
        <filter id="mizzleShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.13" flood-color="#2a3036" />
        </filter>
      </defs>
      <g filter="url(#mizzleShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#mizzleSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,152 88,122 152,112 C 192,105 242,128 288,145 C 338,165 392,170 442,176 C 462,178 466,189 458,194 C 410,189 320,187 230,187 C 120,187 70,191 44,197 Z" fill="url(#stormKnit)" />
        <circle cx="172" cy="120" r="3.5" fill="#f0f5f8" />
        <circle cx="196" cy="128" r="3.5" fill="#f0f5f8" />
        <circle cx="220" cy="135" r="3.5" fill="#f0f5f8" />
        <circle cx="244" cy="142" r="3.5" fill="#f0f5f8" />
        <circle cx="268" cy="148" r="3.5" fill="#f0f5f8" />
        <path d="M 172,120 L 200,126 M 196,128 L 224,133 M 220,135 L 248,140 M 244,142 L 272,146" stroke="#484f55" stroke-width="3" stroke-linecap="round" />
        <path d="M 45,195 C 42,165 55,128 92,108 C 115,95 138,98 152,118 C 145,142 125,165 95,182 C 72,192 55,195 45,195 Z" fill="#4d545b" opacity="0.8" />
      </g>
    </svg>
  `)}`,

  // 17. Men's Trail Runner SWT - Forest Green (Deep lug off-road trainer)
  trailRunnerSWTGreen: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="forestKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4d6350" />
          <stop offset="60%" stop-color="#3b4d3c" />
          <stop offset="100%" stop-color="#283529" />
        </linearGradient>
        <linearGradient id="trailSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e3dbcc" />
          <stop offset="50%" stop-color="#d0c6b3" />
          <stop offset="100%" stop-color="#44413b" />
        </linearGradient>
        <filter id="trailShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.14" flood-color="#212a22" />
        </filter>
      </defs>
      <g filter="url(#trailShadow)">
        <path d="M 45,214 C 60,228 130,235 230,234 C 350,233 440,222 468,206 C 475,200 470,188 456,186 C 410,180 340,180 235,182 C 120,184 70,189 40,196 C 34,198 36,206 45,214 Z" fill="url(#trailSole)" />
        <path d="M 44,197 C 52,148 95,115 160,105 C 205,98 255,122 298,142 C 345,164 398,168 446,176 C 465,178 468,189 458,194 C 410,188 320,186 230,186 C 120,186 70,191 44,197 Z" fill="url(#forestKnit)" />
        <path d="M 160,108 C 200,122 245,140 290,148" fill="none" stroke="#253226" stroke-width="6" stroke-linecap="round" />
        <circle cx="178" cy="116" r="3.5" fill="#f4f4f0" />
        <circle cx="204" cy="125" r="3.5" fill="#f4f4f0" />
        <circle cx="230" cy="133" r="3.5" fill="#f4f4f0" />
        <circle cx="256" cy="140" r="3.5" fill="#f4f4f0" />
        <path d="M 178,116 L 208,123 M 204,125 L 234,131 M 230,133 L 260,138" stroke="#1f2920" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 18. Women's Tree Breezer Flat - Jet Black (Silky ballet flat)
  treeBreezerJetBlack: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="breezerBlack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#363636" />
          <stop offset="60%" stop-color="#212121" />
          <stop offset="100%" stop-color="#121212" />
        </linearGradient>
        <linearGradient id="flatSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3d3d3d" />
          <stop offset="100%" stop-color="#1a1a1a" />
        </linearGradient>
        <filter id="flatShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity="0.15" flood-color="#111" />
        </filter>
      </defs>
      <g filter="url(#flatShadow)">
        <path d="M 50,214 C 65,224 125,230 220,230 C 350,230 440,224 460,212 C 466,208 464,198 454,196 C 420,192 360,190 240,190 C 120,190 70,193 45,198 C 40,200 42,206 50,214 Z" fill="url(#flatSole)" stroke="#222" stroke-width="1.5" />
        <path d="M 45,198 C 50,165 75,138 120,132 C 160,126 210,146 255,160 C 305,176 365,178 430,183 C 452,185 456,193 450,197 C 410,194 320,193 230,193 C 120,193 70,195 45,198 Z" fill="url(#breezerBlack)" />
        <path d="M 120,132 C 180,126 270,140 375,182" fill="none" stroke="#4f4f4f" stroke-width="2.5" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 19. Women's Tree Flyer Training - Lavender Mist
  treeFlyerLavender: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="lavenderKnit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b6a9c2" />
          <stop offset="60%" stop-color="#988ca3" />
          <stop offset="100%" stop-color="#7a6f84" />
        </linearGradient>
        <linearGradient id="flyerSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f2edf7" />
          <stop offset="100%" stop-color="#ded4e6" />
        </linearGradient>
        <filter id="flyerShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity="0.12" flood-color="#4a4052" />
        </filter>
      </defs>
      <g filter="url(#flyerShadow)">
        <path d="M 45,214 C 60,228 130,235 230,234 C 350,233 440,222 468,206 C 475,200 470,188 456,186 C 410,180 340,180 235,182 C 120,184 70,189 40,196 C 34,198 36,206 45,214 Z" fill="url(#flyerSole)" stroke="#dcd4e4" stroke-width="1.5" />
        <path d="M 44,197 C 52,148 95,115 160,105 C 205,98 255,122 298,142 C 345,164 398,168 446,176 C 465,178 468,189 458,194 C 410,188 320,186 230,186 C 120,186 70,191 44,197 Z" fill="url(#lavenderKnit)" />
        <circle cx="178" cy="116" r="3.5" fill="#faf8fc" />
        <circle cx="204" cy="125" r="3.5" fill="#faf8fc" />
        <circle cx="230" cy="133" r="3.5" fill="#faf8fc" />
        <circle cx="256" cy="140" r="3.5" fill="#faf8fc" />
        <path d="M 178,116 L 208,123 M 204,125 L 234,131 M 230,133 L 260,138" stroke="#7e7189" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,

  // 20. Men's Tree Runner Breeze - Salt White
  treeRunnerBreezeWhite: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
      <defs>
        <linearGradient id="breezeWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#faf9f6" />
          <stop offset="100%" stop-color="#eeebe2" />
        </linearGradient>
        <linearGradient id="breezeSole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdfbf7" />
          <stop offset="70%" stop-color="#ede7dc" />
          <stop offset="100%" stop-color="#ddd5c7" />
        </linearGradient>
        <filter id="breezeShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.1" flood-color="#444" />
        </filter>
      </defs>
      <g filter="url(#breezeShadow)">
        <path d="M 50,215 C 65,226 120,233 220,233 C 350,233 445,226 465,212 C 472,207 470,195 460,193 C 420,188 360,186 240,186 C 120,186 70,189 42,196 C 36,198 38,206 50,215 Z" fill="url(#breezeSole)" stroke="#ded7cb" stroke-width="1.5" />
        <path d="M 44,197 C 52,152 88,122 152,112 C 192,105 242,128 288,145 C 338,165 392,170 442,176 C 462,178 466,189 458,194 C 410,189 320,187 230,187 C 120,187 70,191 44,197 Z" fill="url(#breezeWhite)" />
        <circle cx="172" cy="120" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <circle cx="196" cy="128" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <circle cx="220" cy="135" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <circle cx="244" cy="142" r="3.5" fill="#ffffff" stroke="#ddd" stroke-width="1.5" />
        <path d="M 172,120 L 200,126 M 196,128 L 224,133 M 220,135 L 248,140" stroke="#d5cebe" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>
  `)}`,
};

export const SHOE_PRESETS: { label: string; url: string }[] = [
  { label: 'Breeze - Salt White', url: SHOE_IMAGES.treeRunnerBreezeWhite },
  { label: 'Cruiser - Sea Spray Blue', url: SHOE_IMAGES.canvasCruiserSeaSpray },
  { label: 'Cruiser - Warm White', url: SHOE_IMAGES.canvasCruiserSlipOnWarmWhite },
  { label: 'Cruiser - Blizzard White', url: SHOE_IMAGES.cruiserSlipOnBlizzard },
  { label: 'Dasher - Sage Green', url: SHOE_IMAGES.dasherSageGreen },
  { label: 'Runner - Mist Blue', url: SHOE_IMAGES.treeRunnerMistBlue },
  { label: 'Runner - Mushroom Beige', url: SHOE_IMAGES.runnerSlipOnMushroom },
  { label: 'Runner - Anthracite Grey', url: SHOE_IMAGES.runnerSlipOnAnthracite },
  { label: 'Runner - Dark Navy', url: SHOE_IMAGES.runnerSlipOnDarkNavy },
  { label: 'Runner - Storm Grey', url: SHOE_IMAGES.woolRunnerMizzleGrey },
  { label: 'Piper - Chalk White', url: SHOE_IMAGES.treePiperChalkWhite },
  { label: 'Trail - Forest Green', url: SHOE_IMAGES.trailRunnerSWTGreen },
  { label: 'Lounger - Dapple Grey', url: SHOE_IMAGES.woolLoungerDappleGrey },
  { label: 'Breezer - Jet Black', url: SHOE_IMAGES.treeBreezerJetBlack },
  { label: 'Flyer - Lavender Mist', url: SHOE_IMAGES.treeFlyerLavender },
  { label: 'Slide - Anthracite Grey', url: SHOE_IMAGES.slideAnthracite },
  { label: 'Slide - Sand Tan', url: SHOE_IMAGES.slideSand },
  { label: 'Slide - Natural Black', url: SHOE_IMAGES.slideNaturalBlack },
  { label: 'Flip Flop - Sand Tan', url: SHOE_IMAGES.flipFlopSand },
  { label: 'Flip Flop - Natural Black', url: SHOE_IMAGES.flipFlopBlack },
];

export const LIFESTYLE_PRESETS: { label: string; url: string }[] = [
  { label: 'Urban Lifestyle Walk', url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1800&q=85' },
  { label: 'Casual Denim & Sneakers', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Craft & Shoe Artisan', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Minimalist Outdoor Step', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=88' },
  { label: 'Studio Product Display', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Summer Canvas Walk', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Morning Coffee & Footwear', url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80' },
];
