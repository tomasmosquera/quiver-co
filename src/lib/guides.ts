export interface GuideSection {
  heading: string;
  body: string;
  list?: string[];
  table?: { headers: string[]; rows: string[][] };
  tip?: string;
}

export interface Guide {
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  readTime: number; // minutos
  summary: string;
  intro: string;
  sections: GuideSection[];
  tags: string[];
  relatedSlugs?: string[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "Cometas",
    slug: "cometas",
    description: "Todo lo que necesitas saber para elegir, usar y mantener tu cometa.",
    icon: "🪁",
  },
  {
    name: "Tablas",
    slug: "tablas",
    description: "Guías para elegir entre twintip, surfboard, foilboard y más.",
    icon: "🏄",
  },
  {
    name: "Equipamiento",
    slug: "equipamiento",
    description: "Arnés, barra, líneas, traje y todo el equipo que necesitas.",
    icon: "🦺",
  },
  {
    name: "Primeros pasos",
    slug: "primeros-pasos",
    description: "Guías para quienes están empezando en el kitesurf desde cero.",
    icon: "🌊",
  },
];

export const GUIDES: Guide[] = [
  // ─── COMETAS ───────────────────────────────────────────────────────────────

  {
    title: "¿Cómo elegir el tamaño de tu cometa según tu peso y el viento?",
    slug: "como-elegir-tamano-cometa",
    category: "Cometas",
    categorySlug: "cometas",
    readTime: 7,
    summary: "El tamaño de la cometa es la decisión más importante en kitesurf. Una cometa muy grande te puede arrastrar; una muy pequeña no te mueve. Te explicamos cómo encontrar el tamaño correcto para tu peso y los vientos de tu spot.",
    intro: "Elegir el tamaño correcto de tu cometa es quizás la decisión más importante que tomarás en el kitesurf. Una cometa demasiado grande en viento fuerte puede ser peligrosa; una muy pequeña simplemente no te saca del agua. La buena noticia es que existe una lógica clara detrás de la elección, y una vez que la entiendes, todo tiene sentido.",
    sections: [
      {
        heading: "La regla básica: peso y viento",
        body: "El tamaño de la cometa depende de dos variables principales: tu peso corporal y la fuerza del viento en tu spot. A mayor viento, menos cometa necesitas. A mayor peso, más cometa necesitas. La unidad de medida del viento es el nudo (kt), y el tamaño de las cometas se mide en metros cuadrados (m²).",
        table: {
          headers: ["Tu peso", "8–12 kt (viento ligero)", "12–18 kt (viento medio)", "18–25 kt (viento fuerte)", "25+ kt (viento muy fuerte)"],
          rows: [
            ["50–65 kg", "14–16 m²", "10–12 m²", "8–9 m²", "6–7 m²"],
            ["65–80 kg", "16–18 m²", "12–14 m²", "9–11 m²", "7–8 m²"],
            ["80–95 kg", "18–21 m²", "14–16 m²", "11–13 m²", "8–10 m²"],
            ["95+ kg",   "21+ m²",   "16–18 m²", "13–15 m²", "10–12 m²"],
          ],
        },
        tip: "Esta tabla es una guía de referencia. Las condiciones reales (oleaje, rafagas, humedad) pueden hacer que necesites ajustar un tamaño arriba o abajo.",
      },
      {
        heading: "¿Cuántas cometas necesitas?",
        body: "La mayoría de los kiters tienen 2 o 3 cometas para cubrir distintos rangos de viento. La combinación más común es:",
        list: [
          "Una cometa grande (14–17 m²) para días de viento ligero (8–15 kt)",
          "Una cometa mediana (10–13 m²) para viento medio (15–22 kt) — la más usada",
          "Una cometa pequeña (7–9 m²) para viento fuerte (22–30 kt)",
        ],
      },
      {
        heading: "El rango útil de cada cometa",
        body: "Una misma cometa puede usarse en un rango de aproximadamente 8–10 nudos gracias al bar de control (puedes subir y bajar la potencia). Una cometa de 12 m², por ejemplo, puede funcionar desde 13 hasta 22 nudos aproximadamente, dependiendo de tu peso y estilo de navegación.",
        tip: "Si solo puedes tener una cometa, elige la del rango medio (12–14 m²). Cubre el mayor número de días de viento en la mayoría de spots de Colombia.",
      },
      {
        heading: "¿Qué pasa si uso una cometa del tamaño incorrecto?",
        body: "Usar una cometa muy grande en viento fuerte es peligroso: la potencia puede hacerte perder el control, hacerte volar o arrastrarte. Usar una cometa muy pequeña en poco viento simplemente no te dejará navegar. Siempre es mejor empezar con menos cometa — puedes comprar potencia, no puedes comprar seguridad.",
        list: [
          "Cometa muy grande + viento fuerte = peligroso, pérdida de control",
          "Cometa muy pequeña + poco viento = sin tracción, frustración",
          "Cometa correcta = diversión, progresión y seguridad",
        ],
      },
      {
        heading: "Consejo para comprar de segunda mano",
        body: "Si estás comprando una cometa usada, asegúrate de que el tamaño sea compatible con los vientos de tu spot habitual. En Lago Calima, por ejemplo, el viento es fuerte (18–30 kt), así que una cometa de 10–12 m² es la más versátil. En spots más ligeros como La Boquilla, una de 14–16 m² puede ser más útil.",
      },
    ],
    tags: ["cometa", "tamaño", "viento", "principiante", "compra"],
    relatedSlugs: ["que-cometa-comprar-principiante", "que-cometa-usar-viento-fuerte-vs-ligero", "como-elegir-tabla-twintip"],
  },

  {
    title: "¿Qué tipo de cometa es mejor para ti? (Freeride, Big Air, Wave, Freestyle)",
    slug: "tipos-de-cometa-freeride-bigair-wave-freestyle",
    category: "Cometas",
    categorySlug: "cometas",
    readTime: 8,
    summary: "No todas las cometas son iguales. Cada estilo de navegación tiene su cometa ideal. Te explicamos las diferencias entre cometas freeride, big air, wave y freestyle para que elijas la correcta según cómo quieres volar.",
    intro: "El mercado de cometas es enorme y puede abrumar a cualquiera. ¿Qué significa que una cometa sea 'freeride'? ¿Por qué hay cometas específicas para olas? ¿Vale la pena pagar más por una cometa de big air? La respuesta depende completamente de cómo quieres disfrutar el kitesurf.",
    sections: [
      {
        heading: "Cometas Freeride: para el 90% de los kiters",
        body: "Las cometas freeride son el estándar de la industria. Están diseñadas para ser versátiles, fáciles de relanzar desde el agua, estables y predecibles. Si estás empezando o no tienes un estilo muy definido, esta es tu cometa. Ejemplos populares: Duotone Dice, Cabrinha Switchblade, North Reach.",
        list: [
          "Rango de viento amplio — una sola cometa para muchas condiciones",
          "Fácil de relanzar desde el agua",
          "Vuela estable y predecible",
          "Buen rendimiento subiendo al viento",
          "Compatible con cualquier tipo de tabla",
        ],
        tip: "Si compras tu primera cometa o no estás seguro, elige freeride. No te equivocarás.",
      },
      {
        heading: "Cometas Big Air: para volar alto",
        body: "El big air es el estilo más espectacular del kitesurf: saltos de hasta 30 metros de altura. Las cometas de big air tienen mucho relleno de aire (6 struts o más), estructura rígida y generan potencia explosiva en el salto. No son para principiantes — requieren control preciso y son más físicas de manejar. Ejemplos: Duotone Rebel, Cabrinha FX, North Orbit.",
        list: [
          "Potencia explosiva para saltos altos",
          "Estructura muy rígida (5–6 struts)",
          "Más duras de manejar en agua",
          "Peor rendimiento en viento ligero",
          "Rango de viento más estrecho",
        ],
        tip: "No empieces con big air. Primero aprende a saltar bien con una freeride antes de dar el paso.",
      },
      {
        heading: "Cometas Wave: para surfear olas",
        body: "Las cometas wave tienen poco relleno (1–3 struts), son muy ligeras y responden rápido a los movimientos del piloto. En el surf con cometa, quieres que la cometa 'desaparezca' para poder concentrarte en la ola. Son complicadas para principiantes porque se mueven mucho. Ejemplos: Duotone Dice, F-One Bandit, Core Section.",
        list: [
          "Muy ligeras (1–3 struts)",
          "Respuesta rápida y sensible",
          "Vuela 'sola' mientras surfeas la ola",
          "Más difíciles de relanzar",
          "No recomendadas para principiantes",
        ],
      },
      {
        heading: "Cometas Freestyle: para trucos técnicos",
        body: "El freestyle de parque (wakestyle) usa cometas con mucho power y un slack preciso. Las cometas de freestyle están diseñadas para generar el 'pop' necesario para los trucos y aguantar bien sin tensión en la línea (unhooked). Ejemplos: Duotone Vegas, Cabrinha Drifter, Slingshot Rally.",
        list: [
          "Generan 'pop' preciso para trucos",
          "Buen comportamiento sin gancho (unhooked)",
          "Más estables bajo carga",
          "Menos versátiles para freeride general",
        ],
        tip: "La mayoría de kiters hace freestyle con cometas freeride. Solo cuando eres avanzado necesitas una cometa específica de freestyle.",
      },
      {
        heading: "¿Cuál elegir?",
        body: "La respuesta honesta es que el 90% de los kiters no necesita una cometa especializada. Una buena freeride te lleva muy lejos en tu progresión. Solo cuando tengas claro tu estilo — y puedas apreciar la diferencia — tiene sentido comprar una cometa específica.",
        table: {
          headers: ["Estilo", "Cometa ideal", "Para ti si..."],
          rows: [
            ["Aprender y navegar", "Freeride", "Eres principiante o intermedio"],
            ["Saltos y big air", "Big Air", "Ya saltas y quieres volar más alto"],
            ["Surfear olas", "Wave", "Navegas en el mar con oleaje"],
            ["Trucos técnicos", "Freestyle", "Haces wakestyle o unhooked"],
          ],
        },
      },
    ],
    tags: ["cometa", "freeride", "big air", "wave", "freestyle", "tipos"],
    relatedSlugs: ["como-elegir-tamano-cometa", "diferencia-cometas-1-3-5-strut", "que-cometa-comprar-principiante"],
  },

  {
    title: "¿Cuál es la diferencia entre cometas de 1, 3 y 5 strut?",
    slug: "diferencia-cometas-1-3-5-strut",
    category: "Cometas",
    categorySlug: "cometas",
    readTime: 5,
    summary: "Los struts son las varillas inflables que dan estructura a la cometa. El número de struts afecta el peso, la rigidez, el comportamiento y para qué tipo de navegación es adecuada la cometa.",
    intro: "Cuando compras una cometa, uno de los primeros datos técnicos que ves es el número de struts. Una cometa puede tener 1, 3, 5 o incluso 6 struts. ¿Qué diferencia hace? Más de lo que parece.",
    sections: [
      {
        heading: "¿Qué son los struts?",
        body: "Los struts son las varillas inflables transversales que van desde el borde de ataque (leading edge) hasta el trailing edge. Dan rigidez a la cometa y mantienen su forma durante el vuelo. Junto con el leading edge principal, forman el esqueleto inflable de la cometa.",
      },
      {
        heading: "Cometas de 1 strut: mínima estructura",
        body: "Las cometas de 1 strut son las más ligeras y compactas. Con menos estructura, se doblan más en el vuelo y tienen un movimiento más orgánico. Son perfectas para wave kiting porque 'desaparecen' mientras surfeas la ola. También son más fáciles de transportar y empacar.",
        list: [
          "Muy ligeras — excelente para olas y viento ligero",
          "Se doblan más — menos estabilidad en viento fuerte",
          "Más fáciles de transportar",
          "Menos potencia en el rango bajo de viento",
          "Ejemplos: F-One Bandit, Duotone Dice SLS (olas)",
        ],
      },
      {
        heading: "Cometas de 3 strut: el balance perfecto",
        body: "Las cometas de 3 struts son el estándar actual del kitesurf. Son suficientemente ligeras para volar bien en viento ligero, suficientemente rígidas para ser estables en viento fuerte, y versátiles para casi cualquier estilo. La gran mayoría de cometas freeride modernas son de 3 struts.",
        list: [
          "Balance perfecto entre peso y rigidez",
          "Versátiles para freeride, saltos y agua plana",
          "Fáciles de relanzar",
          "Rango de viento amplio",
          "La opción para el 90% de kiters",
        ],
        tip: "Si no sabes cuántos struts elegir, elige 3. Es el estándar por algo.",
      },
      {
        heading: "Cometas de 5 strut: máxima estructura",
        body: "Las cometas de 5 (o 6) struts son las más rígidas y potentes. Mantienen su forma perfecta incluso en viento muy fuerte y generan la potencia explosiva que necesitan los kiters de big air. Son más pesadas, más difíciles de empacar y más exigentes en el agua.",
        list: [
          "Máxima rigidez y estabilidad",
          "Potencia explosiva para big air",
          "Más pesadas y difíciles de manejar en el agua",
          "Peor comportamiento en viento muy ligero",
          "Para kiters avanzados con foco en saltos",
        ],
      },
      {
        heading: "Resumen",
        body: "La tendencia de la industria en los últimos años es hacia menos struts — las tecnologías de tela y construcción han mejorado tanto que se necesita menos estructura para lograr el mismo rendimiento. Hoy una cometa de 3 struts puede ser tan rígida como una de 5 struts de hace 10 años.",
        table: {
          headers: ["Struts", "Peso", "Rigidez", "Ideal para"],
          rows: [
            ["1", "Muy ligera", "Baja", "Wave, viento ligero"],
            ["3", "Media", "Media-alta", "Freeride, todo terreno"],
            ["5+", "Pesada", "Alta", "Big air, viento fuerte"],
          ],
        },
      },
    ],
    tags: ["strut", "cometa", "construcción", "wave", "big air"],
    relatedSlugs: ["tipos-de-cometa-freeride-bigair-wave-freestyle", "como-elegir-tamano-cometa"],
  },

  {
    title: "¿Qué cometa comprar si eres principiante?",
    slug: "que-cometa-comprar-principiante",
    category: "Cometas",
    categorySlug: "cometas",
    readTime: 6,
    summary: "Como principiante, la elección de la cometa incorrecta puede hacer tu aprendizaje más difícil y peligroso. Te decimos exactamente qué buscar, qué evitar y cuáles son las mejores opciones para empezar.",
    intro: "Aprender kitesurf es un proceso que requiere el equipo correcto. Una cometa de principiante no es lo mismo que una cometa de nivel avanzado, y empezar con el equipo equivocado puede ralentizar tu aprendizaje o incluso ser peligroso. Estas son las claves para elegir bien desde el principio.",
    sections: [
      {
        heading: "Qué buscar en una cometa para principiantes",
        body: "Una buena cometa de principiante tiene características específicas que facilitan el aprendizaje:",
        list: [
          "Barra de potencia amplia — fácil de controlar y de 'depotenciar' en caso de emergencia",
          "Fácil relanzado desde el agua — imprescindible cuando caigas (y caerás)",
          "Vuelo estable y predecible — no debe sorprenderte con movimientos bruscos",
          "Sistema de seguridad claro y accesible",
          "Durabilidad — los principiantes son más duros con el equipo",
        ],
        tip: "No compres una cometa de big air o wave para aprender. Son más difíciles de manejar y menos perdona errores.",
      },
      {
        heading: "¿Nueva o usada?",
        body: "Esta es la pregunta más frecuente. La respuesta honesta: para principiantes, una cometa usada en buen estado es perfectamente válida y ahorra mucho dinero. Sin embargo, debes revisar bien el estado antes de comprar.",
        list: [
          "Revisar que no haya reparaciones en el leading edge o struts",
          "Inflar completamente para verificar que no pierde aire",
          "Comprobar que las líneas del bridle estén en buen estado",
          "Verificar que el sistema de depower funcione correctamente",
          "Preferir marcas conocidas con repuestos disponibles",
        ],
        tip: "En Quiver Co. puedes encontrar cometas de segunda mano con buena relación calidad-precio. Busca modelos de 3-4 años de marcas como Duotone, Cabrinha o North.",
      },
      {
        heading: "¿Qué tamaño elegir?",
        body: "Para principiantes, es mejor empezar con una cometa del rango medio-alto. Una cometa más grande es más fácil de relanzar y tiene más potencia en vientos bajos, lo que hace las sesiones más entretenidas. Con 65-80 kg de peso, una cometa de 12-14 m² para vientos de 12-18 kt es un buen punto de partida.",
      },
      {
        heading: "Marcas y modelos recomendados para empezar",
        body: "Estos modelos son conocidos por su facilidad de uso, durabilidad y buen sistema de seguridad:",
        list: [
          "Duotone Dice — freeride versátil, excelente relanzado, 3 struts",
          "Cabrinha Switchblade — clásico de la industria, muy estable",
          "North Reach — amigable para principiantes, diseño moderno",
          "Naish Pivot — buena relación precio-calidad",
          "Slingshot Turbine — fácil de aprender, resistente",
        ],
      },
      {
        heading: "Lo que debes evitar",
        body: "Algunas cometas parecen atractivas pero no son adecuadas para principiantes:",
        list: [
          "Cometas de big air (Rebel, Orbit, Screamer) — demasiado potentes y difíciles",
          "Cometas de wave sin struts — se mueven mucho y son impredecibles",
          "Cometas de segunda mano con reparaciones múltiples — señal de mal trato",
          "Cometas demasiado viejas (más de 7-8 años) — la tela se degrada",
          "Cometas sin marca conocida o muy baratas — sin repuestos ni soporte",
        ],
      },
    ],
    tags: ["principiante", "cometa", "aprendizaje", "primera cometa", "segunda mano"],
    relatedSlugs: ["como-elegir-tamano-cometa", "equipo-para-empezar-kitesurf", "diferencia-cometas-1-3-5-strut"],
  },

  {
    title: "¿Qué cometa usar para viento fuerte vs viento ligero?",
    slug: "que-cometa-usar-viento-fuerte-vs-ligero",
    category: "Cometas",
    categorySlug: "cometas",
    readTime: 5,
    summary: "Navegar en viento fuerte y viento ligero son experiencias completamente diferentes. El equipo ideal para cada condición también lo es. Te explicamos cómo adaptar tu elección de cometa a las condiciones del día.",
    intro: "Uno de los mayores errores de los kiters intermedios es usar siempre la misma cometa independientemente del viento. Saber qué cometa (y cómo configurarla) para cada condición marca la diferencia entre una sesión épica y una de frustración o riesgo.",
    sections: [
      {
        heading: "Viento ligero (8–15 kt): cómo exprimir cada nudo",
        body: "En viento ligero, el objetivo es maximizar la superficie de cometa para capturar el máximo de energía. Además de elegir una cometa más grande, hay ajustes de configuración que ayudan:",
        list: [
          "Usa tu cometa más grande del quiver",
          "Mueve el punto de anclaje trasero hacia adelante (más ángulo de ataque = más potencia)",
          "Navega con una tabla más grande o con freeride — no con surfboard pequeña",
          "Prefiere cometas C-shape o híbridas que generan más potencia en poco viento",
          "Considera una hydrofoil — multiplica exponencialmente el rango de viento útil",
        ],
        tip: "En Lago Calima, el viento llega fuerte en ráfagas pero puede caer a 10 kt entre medias. Una cometa de 14-16 m² bien configurada puede salvarte la sesión.",
      },
      {
        heading: "Viento fuerte (22–35 kt): seguridad primero",
        body: "El viento fuerte es donde más accidentes ocurren. Kiters que no reducen la cometa a tiempo, que salen con cometas muy grandes o que no conocen bien su equipo de seguridad. En viento fuerte:",
        list: [
          "Siempre baja un tamaño de cometa antes de lo que crees que necesitas",
          "Revisa el sistema de depower y el quick release antes de salir",
          "Usa tu cometa más pequeña y sube el bar hacia el máximo depower",
          "Mueve el punto de anclaje trasero hacia atrás (menos ángulo de ataque = menos potencia)",
          "Navega en zonas sin obstáculos — más espacio para maniobrar",
        ],
        tip: "Si dudas entre dos cometas en viento fuerte, siempre elige la más pequeña. Puedes aprender a sacarle más jugo, pero no puedes aprender a controlar una cometa que te supera.",
      },
      {
        heading: "Cometas diseñadas para viento ligero",
        body: "Algunas cometas están especialmente optimizadas para generar potencia en poco viento:",
        list: [
          "Duotone Mono / Evo — perfil profundo, mucha potencia en rango bajo",
          "F-One Bandit — versatilidad extrema, buen range",
          "Naish Slash — gran rendimiento en viento ligero",
          "Ozone Enduro — diseñada específicamente para condiciones ligeras",
        ],
      },
      {
        heading: "Cometas para viento fuerte",
        body: "Las cometas pequeñas de viento fuerte suelen ser más rígidas y con menos superficie, pero no pienses en comprarte una cometa de 7 m² si no tienes experiencia en esas condiciones:",
        list: [
          "Core XR — excelente en condiciones de viento fuerte",
          "Cabrinha Switchblade pequeña (7-9 m²) — predecible incluso en 30+ kt",
          "Duotone Rebel — pensada para big air en viento fuerte",
        ],
      },
    ],
    tags: ["viento fuerte", "viento ligero", "condiciones", "configuración"],
    relatedSlugs: ["como-elegir-tamano-cometa", "tipos-de-cometa-freeride-bigair-wave-freestyle"],
  },

  // ─── TABLAS ────────────────────────────────────────────────────────────────

  {
    title: "¿Cómo elegir tu tabla twintip ideal?",
    slug: "como-elegir-tabla-twintip",
    category: "Tablas",
    categorySlug: "tablas",
    readTime: 7,
    summary: "La twintip es la tabla más usada en kitesurf. Pero dentro de las twintips hay diferencias enormes: tamaño, flex, rocker, canales... Te explicamos qué significa cada característica y cómo elegirla.",
    intro: "La tabla twintip es la reina del kitesurf. Simétrica, bidireccional, versátil — es la primera tabla que aprende la mayoría de kiters y la que más se usa globalmente. Pero no todas las twintips son iguales, y saber qué diferencia una tabla de otro puede transformar tu experiencia en el agua.",
    sections: [
      {
        heading: "Tamaño: largo × ancho",
        body: "Las twintips se miden en centímetros: largo × ancho (ej: 138 × 41). El largo afecta la flotabilidad y la facilidad para salir del agua; el ancho afecta la estabilidad lateral y la velocidad de planeado.",
        table: {
          headers: ["Tu peso", "Nivel principiante", "Nivel intermedio", "Nivel avanzado"],
          rows: [
            ["50–65 kg", "132–138 cm", "130–135 cm", "128–133 cm"],
            ["65–80 kg", "138–142 cm", "134–140 cm", "130–136 cm"],
            ["80–95 kg", "140–145 cm", "138–143 cm", "134–140 cm"],
            ["95+ kg",   "145–152 cm", "142–148 cm", "138–144 cm"],
          ],
        },
        tip: "A medida que progresas, generalmente pasas a tablas más cortas y estrechas, que son más reactivas pero requieren mejor técnica para salir del agua.",
      },
      {
        heading: "Flex: qué tan rígida es la tabla",
        body: "El flex se refiere a la flexibilidad de la tabla. Tablas más blandas (soft flex) absorben mejor las irregularidades del agua y son más cómodas; tablas más rígidas (stiff flex) dan más respuesta y control en maniobras.",
        list: [
          "Soft flex: ideal para agua choppy, principiantes, freeride",
          "Medium flex: el balance para la mayoría — versátil",
          "Stiff flex: para freestyle técnico y wakestyle — no recomendado para principiantes",
        ],
      },
      {
        heading: "Rocker: la curvatura de la tabla",
        body: "El rocker es la curvatura de la tabla de punta a punta. Más rocker (más curva) significa mejor comportamiento en agua choppy y saltos más suaves; menos rocker (más plana) significa más velocidad y mejor planeado en agua plana.",
        list: [
          "Poco rocker (tabla plana): veloz, buen planeado, ideal para agua plana y freeride",
          "Rocker medio: balance general, versatilidad",
          "Mucho rocker: aguanta bien las olas y el chop, pero más lenta",
        ],
      },
      {
        heading: "Pads y straps",
        body: "Los pads son las plataformas acolchadas donde van tus pies. Los straps son los correas que te sujetan. Para principiantes, pads blandos y straps amplios son más cómodos. Para freestyle, pads más rígidos dan mejor transferencia de energía en los trucos.",
        tip: "Asegúrate de que los straps son ajustables y están bien posicionados para tu posición de pie. La posición incorrecta puede causar lesiones de rodilla.",
      },
      {
        heading: "Marcas y modelos populares",
        body: "Estas twintips son conocidas por su calidad y versatilidad:",
        list: [
          "Duotone Jaime — freeride puro, excelente para principiantes e intermedios",
          "Cabrinha Ace — muy popular en Colombia, buena relación calidad-precio",
          "North Atmos — premium, ligera, para intermedios y avanzados",
          "Slingshot Vision — buena opción de precio accesible",
          "Nobile NHP — tabla colombiana/latinoamericana, muy usada en Calima",
        ],
      },
    ],
    tags: ["tabla", "twintip", "tamaño", "flex", "rocker"],
    relatedSlugs: ["tamano-tabla-segun-peso-nivel", "twintip-vs-surfboard", "como-elegir-tamano-cometa"],
  },

  {
    title: "¿Qué tamaño de tabla necesitas según tu peso y nivel?",
    slug: "tamano-tabla-segun-peso-nivel",
    category: "Tablas",
    categorySlug: "tablas",
    readTime: 5,
    summary: "El tamaño correcto de tu tabla cambia significativamente según tu peso y experiencia. Una tabla muy grande te facilita salir del agua; una muy pequeña requiere mejor técnica pero es más ágil. Te explicamos cuál es la tuya.",
    intro: "Elegir el tamaño de tabla incorrecto es uno de los errores más comunes, especialmente cuando se compra equipo de segunda mano. Una tabla que funcionaba perfecta para un kiter de 90 kg puede ser frustrante para uno de 65 kg. Aquí tienes la guía definitiva.",
    sections: [
      {
        heading: "El principio fundamental",
        body: "Las tablas más grandes flotan más, planes más fácil y son más estables. Las más pequeñas son más ágiles, reactivas y técnicas. Con el tiempo, casi todos los kiters van achicando el tamaño de su tabla a medida que mejoran su técnica.",
      },
      {
        heading: "Tabla de referencia por peso y nivel",
        body: "Esta tabla asume condiciones normales (viento 15-22 kt, agua relativamente plana o pequeño chop):",
        table: {
          headers: ["Peso", "Principiante", "Intermedio", "Avanzado / Wakestyle"],
          rows: [
            ["< 60 kg",  "132–136 cm", "128–132 cm", "< 130 cm"],
            ["60–75 kg", "136–140 cm", "132–136 cm", "130–134 cm"],
            ["75–90 kg", "140–145 cm", "136–141 cm", "133–138 cm"],
            ["90+ kg",   "145–152 cm", "141–146 cm", "138–143 cm"],
          ],
        },
        tip: "En viento ligero, vale la pena tener una tabla un poco más grande que lo que usas normalmente — te ayudará a planear en condiciones límite.",
      },
      {
        heading: "¿Cuándo bajar de tamaño?",
        body: "Sabes que es momento de pasar a una tabla más pequeña cuando:",
        list: [
          "Puedes salir del agua consistentemente en 80% de tus intentos",
          "Sientes la tabla 'lenta' o 'pesada' en tus cambios de dirección",
          "Haces saltos y sientes que la tabla grande te frena",
          "Navegas con viento de 18+ kt la mayoría del tiempo",
        ],
      },
      {
        heading: "¿Y si el spot tiene mucho chop?",
        body: "En agua choppy (irregular, con pequeñas olas y chop de viento), las tablas más grandes ayudan a mantenerse sobre el agua. En agua plana como Lago Calima, puedes permitirte una tabla más pequeña. En spots de mar con oleaje, la tabla depende también de si estás haciendo freeride o wave.",
      },
    ],
    tags: ["tabla", "tamaño", "peso", "nivel", "principiante"],
    relatedSlugs: ["como-elegir-tabla-twintip", "twintip-vs-surfboard"],
  },

  {
    title: "Twintip o surfboard: ¿cuál deberías elegir?",
    slug: "twintip-vs-surfboard",
    category: "Tablas",
    categorySlug: "tablas",
    readTime: 6,
    summary: "La twintip es la tabla por defecto del kitesurf. Pero las surfboards abren un mundo completamente diferente. ¿Cuándo tiene sentido dar el salto? ¿Es más difícil navegar en surfboard? Te lo explicamos.",
    intro: "Empezar en kitesurf casi siempre significa empezar en twintip. Pero una vez que progresás, el mundo de las surfboards y strapless se vuelve irresistible para muchos. ¿Es para ti? Depende de dónde navegas y qué buscas.",
    sections: [
      {
        heading: "La twintip: por qué es el estándar",
        body: "La twintip es bidireccional — puedes navegar en ambas direcciones sin cambiar de posición. Tiene straps que te sujetan los pies, lo que facilita los saltos y las maniobras. Es más fácil de aprender, más versátil en diferentes condiciones y más estable.",
        list: [
          "Fácil de aprender — bidireccional, no necesitas cambiar de posición",
          "Straps para mejor control en saltos y trucos",
          "Versátil en diferentes condiciones",
          "Ideal para agua plana, freeride y freestyle",
          "La usas en 95% de los spots del mundo",
        ],
      },
      {
        heading: "La surfboard: para surfear de verdad",
        body: "Una surfboard de kite (directional) está diseñada para surfear olas. Normalmente no tiene straps — navegas 'strapless', con los pies libres sobre el deck. Requiere mucho más técnica, pero la sensación de surfear una ola con cometa es incomparable.",
        list: [
          "Para surfear olas — la experiencia es superior a la twintip",
          "Sin straps en la versión strapless — más sensación, más dificultad",
          "Solo funciona bien en spots con oleaje",
          "Necesitas saber surfear (o aprender)",
          "No es buena opción para agua plana o big air",
        ],
        tip: "Antes de comprar una surfboard para kite, aprende a bodysurfar o surfear sin cometa. La técnica de surfear olas es independiente del kite.",
      },
      {
        heading: "¿Cuándo pasarte a surfboard?",
        body: "Tiene sentido si se cumplen estas condiciones:",
        list: [
          "Ya navegas cómodamente en twintip y cambias de dirección sin caer",
          "Tu spot tiene oleaje regular (mar, no lago)",
          "Te atrae más el surf que el freestyle o el big air",
          "Tienes paciencia para un nuevo aprendizaje — el inicio en strapless es difícil",
        ],
      },
      {
        heading: "¿Y si quiero los dos mundos?",
        body: "Muchos kiters tienen las dos tablas. La twintip para el día a día, la surfboard para cuando hay olas. En Colombia, si navegas en spots del Caribe (Cabo de la Vela, Palomino) puede valer la pena tener una surfboard. Si navegas solo en Lago Calima o spots de agua plana, probablemente nunca la necesites.",
      },
    ],
    tags: ["twintip", "surfboard", "strapless", "wave", "olas"],
    relatedSlugs: ["como-elegir-tabla-twintip", "cuando-vale-la-pena-foil", "tamano-tabla-segun-peso-nivel"],
  },

  {
    title: "¿Cuándo vale la pena pasarse al foil?",
    slug: "cuando-vale-la-pena-foil",
    category: "Tablas",
    categorySlug: "tablas",
    readTime: 6,
    summary: "El foil es la evolución más disruptiva del kitesurf. Volar sobre el agua con cometas pequeñas en poco viento es una sensación diferente a todo. Pero no es para todo el mundo ni en cualquier momento. Te explicamos cuándo tiene sentido.",
    intro: "Si llevas tiempo en el kitesurf, seguramente has visto kiters con un palo debajo de la tabla, volando literalmente sobre el agua. El foil ha revolucionado el deporte: permite navegar con vientos muy ligeros, hacer maniobras imposibles en tabla convencional y sentir una sensación de vuelo única. Pero también es más técnico, más caro y tiene una curva de aprendizaje exigente.",
    sections: [
      {
        heading: "¿Qué es el foil exactamente?",
        body: "El hydrofoil es un sistema de alas sumergidas que, al ganar velocidad, generan sustentación y elevan la tabla (y al rider) por encima del agua. Sin fricción con el agua, la velocidad aumenta y se puede navegar con vientos de 6-10 kt que antes hacían imposible una sesión.",
        list: [
          "Volar 30-60 cm sobre la superficie del agua",
          "Navegar con vientos de 6-10 kt (antes imposible con tabla normal)",
          "Velocidades más altas con menos esfuerzo",
          "Sensación completamente diferente — silenciosa, suave, adictiva",
        ],
      },
      {
        heading: "¿Cuándo estás listo para el foil?",
        body: "El foil no es para principiantes. Antes de dar el paso, deberías cumplir estas condiciones:",
        list: [
          "Navegas con twintip sin esfuerzo y cambias de dirección fluidamente",
          "Puedes hacer water start consistentemente",
          "Controlas bien tu cometa con una mano",
          "Tienes conciencia del espacio — el foil requiere mucho más espacio libre",
          "Has tomado al menos una clase de introducción al foil con instructor",
        ],
        tip: "El primer día en foil vas a caer mucho. Es normal. Pero el progreso es rápido si ya tienes buena base en kite.",
      },
      {
        heading: "¿Qué spot necesitas?",
        body: "El foil es ideal para spots de agua plana con poco tráfico. Lago Calima es perfecto para aprender. El Embalse de Tominé también. En spots con mucha gente, el foil puede ser peligroso — las alás de metal son como cuchillas.",
        list: [
          "Lago Calima — el mejor spot de Colombia para foil",
          "Embalse de Tominé — bueno para practicar",
          "Evitar spots concurridos o con surfistas/bañistas cercanos",
        ],
      },
      {
        heading: "¿Cuánto cuesta?",
        body: "Un foil completo (tabla + mástil + fuselaje + alas) de calidad cuesta entre 1.500 y 4.000 USD nuevo. En el mercado de segunda mano puedes encontrar opciones a mitad de precio. Las marcas más usadas en Colombia son AXIS, Slingshot, Duotone y F-One.",
        tip: "Busca en Quiver Co. foils de segunda mano. Muchos kiters compran foil, lo usan unos meses y vuelven a la twintip — puedes encontrar equipo en excelente estado.",
      },
    ],
    tags: ["foil", "hydrofoil", "viento ligero", "progresión"],
    relatedSlugs: ["twintip-vs-surfboard", "equipo-para-empezar-kitesurf"],
  },

  // ─── EQUIPAMIENTO ──────────────────────────────────────────────────────────

  {
    title: "¿Qué tipo de arnés es mejor: de cintura o de asiento?",
    slug: "arnes-cintura-vs-asiento",
    category: "Equipamiento",
    categorySlug: "equipamiento",
    readTime: 5,
    summary: "El arnés es el puente entre tú y la cometa. Elegir entre cintura y asiento puede afectar tu comodidad, progresión y estilo de navegación. Te explicamos las diferencias reales.",
    intro: "El arnés es uno de los equipos más personales del kitesurf — lo llevas en tu cuerpo durante toda la sesión. Elegir el tipo incorrecto puede hacerte la vida imposible. Las dos opciones principales son el arnés de cintura y el arnés de asiento (seat harness), y cada uno tiene sus casos de uso.",
    sections: [
      {
        heading: "Arnés de cintura (waist harness)",
        body: "El arnés de cintura rodea la parte baja de la espalda y el abdomen. Es el más usado en kitesurf moderno, especialmente para intermedios y avanzados. Da más libertad de movimiento, es más cómodo para saltos y maniobras, y se ve más limpio.",
        list: [
          "Mayor libertad de movimiento — ideal para freestyle y saltos",
          "Más cómodo para kiters con buena postura y core fuerte",
          "Estándar de la industria — la mayoría de kiters lo usa",
          "Puede subirse si no ajusta bien — requiere ajuste correcto",
          "No recomendado para principiantes o personas con dolores de espalda",
        ],
      },
      {
        heading: "Arnés de asiento (seat harness)",
        body: "El arnés de asiento tiene correas que pasan por los muslos y distribuye la carga hacia la cadera y los glúteos. Da más soporte lumbar y es mucho más difícil que se suba. Es el preferido de principiantes y personas con problemas de espalda.",
        list: [
          "Más soporte lumbar — mejor para espalda",
          "No se sube — ideal para principiantes",
          "Más restricción de movimiento",
          "Menos popular entre kiters avanzados",
          "Ideal para windsurf y kitesurf de freeride tranquilo",
        ],
        tip: "Si estás empezando o tienes problemas de espalda, el arnés de asiento es la opción más cómoda y segura. No hay nada de malo en usarlo indefinidamente.",
      },
      {
        heading: "¿Cuál elegir?",
        body: "La respuesta depende de tu nivel, anatomía y estilo:",
        table: {
          headers: ["Situación", "Recomendación"],
          rows: [
            ["Principiante", "Asiento — más soporte, no se sube"],
            ["Problemas de espalda", "Asiento — distribuye mejor la carga"],
            ["Freestyle / saltos", "Cintura — más libertad de movimiento"],
            ["Freeride avanzado", "Cintura — estándar de la industria"],
            ["Wingfoil / windsurf", "Cintura — más común en estas disciplinas"],
          ],
        },
      },
      {
        heading: "Qué mirar al comprar un arnés",
        body: "Independientemente del tipo, estos son los factores más importantes:",
        list: [
          "Ajuste: debe quedar firme sin cortar la circulación",
          "Material del gancho: acero inoxidable o plástico de alta resistencia",
          "Spreader bar: elige uno con buen sistema de quick release",
          "Acolchado: más acolchado = más comodidad en sesiones largas",
          "Bolsillos: útiles para llevar pequeños objetos durante la sesión",
        ],
      },
    ],
    tags: ["arnés", "equipamiento", "cintura", "asiento", "principiante"],
    relatedSlugs: ["como-elegir-barra", "equipo-para-empezar-kitesurf"],
  },

  {
    title: "¿Cómo elegir la barra correcta para tu cometa?",
    slug: "como-elegir-barra",
    category: "Equipamiento",
    categorySlug: "equipamiento",
    readTime: 6,
    summary: "La barra es tu punto de control sobre la cometa. No todas las barras funcionan con todas las cometas, y las diferencias técnicas entre modelos pueden afectar tu seguridad y progresión.",
    intro: "La barra (control bar) es el elemento que te conecta con la cometa y te permite maniobrar. Parece simple pero hay muchas diferencias entre modelos: longitud, sistema de depower, compatibilidad, seguridad. Elegir bien marca la diferencia, especialmente en condiciones difíciles.",
    sections: [
      {
        heading: "Compatibilidad: lo más importante",
        body: "Antes que nada: las barras NO son universales. Cada marca tiene su propio sistema de líneas y conexión. Una barra Cabrinha no funciona directamente con una cometa Duotone. Siempre que sea posible, usa la barra del mismo fabricante que tu cometa.",
        tip: "Existen adaptadores para usar barras de diferentes marcas, pero no son ideales — especialmente para el sistema de seguridad. En segunda mano, prioriza comprar barra + cometa de la misma marca.",
      },
      {
        heading: "Longitud de la barra",
        body: "Las barras vienen en diferentes longitudes (45, 50, 55, 60 cm). La longitud afecta cuánto giras la cometa con un movimiento dado — barras más cortas dan respuesta más sensible, barras más largas dan más leverage y control suave.",
        list: [
          "Barras cortas (45–50 cm): más sensibles, para cometas pequeñas y viento fuerte",
          "Barras largas (55–60 cm): más control, para cometas grandes y principiantes",
          "Las marcas suelen recomendar la longitud según el tamaño de cometa",
        ],
      },
      {
        heading: "El sistema de depower",
        body: "El sistema de depower (o trim) te permite ajustar la potencia de la cometa sin cambiarla. Hay dos tipos principales: trim strap (cinta que jala la barra hacia arriba o abajo) y chicken loop (con o sin bola de seguridad). Entender tu sistema de depower puede salvarte la vida en una emergencia.",
        list: [
          "Prueba el quick release antes de cada sesión",
          "Aprende a usar el chicken loop y el leash de seguridad",
          "El depower total debe llevar la cometa a neutro sin tensión",
        ],
      },
      {
        heading: "¿Nueva o usada?",
        body: "Las barras usadas en buen estado son una excelente opción para ahorrar. Sin embargo, revisa minuciosamente:",
        list: [
          "El estado de las líneas (sin cortes, sin pelado, longitudes iguales)",
          "El funcionamiento del quick release — pruébalo múltiples veces",
          "El estado del chicken loop y las conexiones",
          "Que no haya corrosión en las partes metálicas",
        ],
        tip: "Las líneas son baratas de reemplazar. Si la barra está bien pero las líneas están desgastadas, puedes comprar líneas nuevas y queda casi como nueva.",
      },
    ],
    tags: ["barra", "control bar", "depower", "seguridad", "compatibilidad"],
    relatedSlugs: ["que-lineas-usar-cuando-cambiarlas", "arnes-cintura-vs-asiento", "equipo-para-empezar-kitesurf"],
  },

  {
    title: "¿Qué líneas (metros) deberías usar y cuándo cambiarlas?",
    slug: "que-lineas-usar-cuando-cambiarlas",
    category: "Equipamiento",
    categorySlug: "equipamiento",
    readTime: 5,
    summary: "Las líneas son el eslabón más crítico entre tú y la cometa. Mal estado, longitud incorrecta o desequilibrio pueden ser peligrosos. Te explicamos cómo elegirlas y cuándo renovarlas.",
    intro: "Las líneas de kitesurf son invisibles en la ecuación para muchos kiters — hasta que fallan. Una línea en mal estado puede romperse en plena sesión, con consecuencias serias. Además, la longitud de las líneas afecta el comportamiento de la cometa más de lo que imaginas.",
    sections: [
      {
        heading: "Longitudes estándar",
        body: "Las líneas de kitesurf vienen en longitudes de 18, 20, 22, 24 y 27 metros (también hay sets de líneas mixtas). La longitud afecta cuánta potencia genera la cometa y qué tan lejos está del agua.",
        table: {
          headers: ["Longitud", "Efecto", "Ideal para"],
          rows: [
            ["18–20 m", "Menos potencia, respuesta más rápida", "Viento fuerte, wakestyle, spots pequeños"],
            ["22–24 m", "Balance estándar", "Uso general, freeride"],
            ["27 m",    "Más potencia, vuelo más alto", "Viento ligero, big air"],
          ],
        },
        tip: "La mayoría de kiters usa 20 o 24 metros como estándar. Prueba 27 metros si navegas en condiciones de viento ligero — notarás más potencia.",
      },
      {
        heading: "¿Cuándo cambiar las líneas?",
        body: "Las líneas se degradan con el uso, la exposición UV y la sal. Estas son las señales de que es hora de cambiarlas:",
        list: [
          "Fibras cortadas o peladas visibles al inspeccionar",
          "Líneas de diferente longitud (la cometa se tuerce al vuelo)",
          "Nodos o nudos difíciles de deshacer",
          "La cometa no vuela centrada a pesar de ajustar el bar",
          "Llevas más de 2–3 años con las mismas líneas y navegas frecuentemente",
        ],
      },
      {
        heading: "Cómo revisar el estado de tus líneas",
        body: "Una inspección rápida antes de cada sesión puede salvarte problemas:",
        list: [
          "Extiende las líneas completamente y revisa metro a metro",
          "Busca zonas peladas, decoloradas o con fibras sueltas",
          "Comprueba que las cuatro líneas tienen la misma longitud (o diferencias mínimas ajustables)",
          "Revisa las costuras en los extremos (loop de conexión)",
        ],
      },
      {
        heading: "Líneas de repuesto",
        body: "Las líneas son relativamente baratas comparadas con el resto del equipo. Un set completo de líneas de calidad cuesta entre 80 y 200 USD. Marcas como Dyneema, Liros y las propias marcas (Duotone, Cabrinha) ofrecen buenas opciones.",
      },
    ],
    tags: ["líneas", "seguridad", "mantenimiento", "equipamiento"],
    relatedSlugs: ["como-elegir-barra", "equipo-para-empezar-kitesurf"],
  },

  // ─── PRIMEROS PASOS ────────────────────────────────────────────────────────

  {
    title: "¿Qué equipo necesitas para empezar en kitesurf desde cero?",
    slug: "equipo-para-empezar-kitesurf",
    category: "Primeros pasos",
    categorySlug: "primeros-pasos",
    readTime: 8,
    summary: "Empezar en kitesurf implica una inversión de equipo. Pero no necesitas todo de golpe. Te contamos qué es imprescindible, qué puede esperar, y cómo armar un quiver de principiante sin gastar de más.",
    intro: "El kitesurf tiene fama de deporte caro. Y en parte es verdad — el equipo de calidad tiene un precio. Pero con una estrategia inteligente, especialmente usando el mercado de segunda mano, puedes empezar con un quiver completo sin descapitalizarte. Aquí va la guía real de qué necesitas y en qué orden comprarlo.",
    sections: [
      {
        heading: "Lo imprescindible: el quiver básico",
        body: "Para navegar independientemente necesitas:",
        list: [
          "Cometa — el elemento principal (con barra incluida)",
          "Tabla twintip — la más versátil para empezar",
          "Arnés — waist o seat, según tu preferencia",
          "Leash de seguridad — conecta la cometa a ti si la sueltas",
          "Casco — obligatorio mientras aprendes (y recomendado siempre)",
          "Chaleco de impacto o flotabilidad — en muchos spots es obligatorio",
        ],
        tip: "El casco y el chaleco son los elementos más importantes de seguridad. No los escatimes.",
      },
      {
        heading: "Equipo recomendado pero no obligatorio",
        body: "Con el tiempo, querrás agregar:",
        list: [
          "Traje de neopreno — imprescindible en spots de agua fría (Lago Calima, Tominé)",
          "Escarpines — protección para los pies en playas rocosas",
          "Gafas de sol o gafas de kite",
          "Bolsa de tabla y bolsa de cometa para transporte",
          "Bomba de inflado de calidad (manual o eléctrica)",
        ],
      },
      {
        heading: "¿Cuánto cuesta armar un quiver básico?",
        body: "Los precios varían enormemente entre nuevo y usado. Esta es la referencia:",
        table: {
          headers: ["Elemento", "Nuevo (USD)", "Usado buen estado (USD)"],
          rows: [
            ["Cometa + barra", "800–1.800", "300–700"],
            ["Tabla twintip", "400–900",   "150–400"],
            ["Arnés",         "150–400",   "60–150"],
            ["Casco",         "60–150",    "30–80"],
            ["Chaleco",       "80–200",    "40–100"],
            ["Total aprox.",  "1.500–3.450", "580–1.430"],
          ],
        },
        tip: "Comprar todo de segunda mano en buen estado puede dejarte con un quiver funcional por menos de 800 USD. El mercado de segunda mano en Colombia (y en Quiver Co.) tiene buenas opciones.",
      },
      {
        heading: "¿Primero las clases o primero el equipo?",
        body: "Siempre primero las clases. Antes de comprar equipo, toma al menos 6–10 horas de clases con un instructor certificado (IKO o VDWS). Las razones:",
        list: [
          "Aprenderás qué equipo realmente necesitas para tu nivel y spot",
          "Evitarás comprar equipo incorrecto (talla, tipo, etc.)",
          "Aprenderás los sistemas de seguridad antes de usar equipo propio",
          "Muchas escuelas alquilan equipo — puedes probar antes de comprar",
        ],
      },
      {
        heading: "Dónde tomar clases en Colombia",
        body: "Las escuelas más conocidas operan en los principales spots:",
        list: [
          "Lago Calima — varias escuelas en Darién, con certificación IKO",
          "Cabo de la Vela — escuelas locales en temporada",
          "Mayapo / Riohacha — escuelas durante la temporada alisios",
          "La Boquilla (Cartagena) — escuelas durante temporada",
        ],
      },
    ],
    tags: ["principiante", "quiver", "equipo", "presupuesto", "primera vez"],
    relatedSlugs: ["que-cometa-comprar-principiante", "arnes-cintura-vs-asiento", "como-elegir-tabla-twintip"],
  },

  {
    title: "¿Qué equipo de kitesurf deberías comprar según el spot donde navegas?",
    slug: "equipo-segun-tu-spot",
    category: "Primeros pasos",
    categorySlug: "primeros-pasos",
    readTime: 7,
    summary: "El equipo ideal no es el mismo para Lago Calima que para Cabo de la Vela o la Boquilla. Las condiciones del spot determinan el tamaño de cometa, el tipo de tabla e incluso el arnés que mejor te funciona.",
    intro: "Colombia tiene spots muy diferentes entre sí. Lago Calima tiene viento termal fuerte y agua fría en altura. Cabo de la Vela tiene alisios potentes con agua caliente. La Boquilla tiene viento ligero y una laguna protegida. Tu equipo ideal depende del spot donde navegas el 80% del tiempo.",
    sections: [
      {
        heading: "Lago Calima — el spot más popular de Colombia",
        body: "Viento: 15–35 kt (fuerte y consistente). Agua fría (15–18°C). Altitud 1.500 m. Agua plana.",
        list: [
          "Cometa principal: 9–12 m² (el viento es fuerte la mayoría del tiempo)",
          "Segunda cometa: 7 m² para días de viento muy fuerte",
          "Tabla: twintip estándar 132–140 cm según tu peso",
          "Traje de neopreno: 3/2 mm mínimo — el agua es fría",
          "Nota: a 1.500m las cometas generan menos potencia — ajusta un tamaño arriba",
        ],
        tip: "Muchos kiters de Calima tienen una cometa de 12 m² como su principal. Cubre el 70% de los días de viento.",
      },
      {
        heading: "Cabo de la Vela y La Guajira",
        body: "Viento: 15–30 kt. Agua cálida. Mar con pequeño chop. Temporada dic–ago.",
        list: [
          "Cometa principal: 10–13 m² (viento consistente pero variable)",
          "Segunda cometa: 7–9 m² para días muy ventosos",
          "Tabla: twintip estándar, puedes agregar una surfboard si hay oleaje",
          "Sin neopreno — agua caliente del Caribe",
          "Protección solar: el sol del desierto es extremo",
        ],
      },
      {
        heading: "La Boquilla y spots de laguna (Cartagena)",
        body: "Viento: 10–18 kt. Agua cálida. Laguna completamente plana. Ideal para aprender.",
        list: [
          "Cometa: 14–17 m² — el viento es ligero",
          "Tabla grande: 138–145 cm para planear bien con poco viento",
          "Arnés de asiento si estás aprendiendo",
          "Sin neopreno — agua cálida",
          "Buen lugar para practicar sin peligro",
        ],
      },
      {
        heading: "Embalse de Tominé — escapada de Bogotá",
        body: "Viento: 10–20 kt (variable, termal en tarde). Agua fría. Altitud 2.600 m.",
        list: [
          "Cometa: 12–16 m² (viento más ligero que Calima)",
          "Neopreno: 5/4 mm o más — el agua está muy fría a 2.600m",
          "Tabla estándar — el agua suele estar relativamente plana",
          "Hidratación extra — la altitud aumenta el esfuerzo",
        ],
      },
      {
        heading: "Si navegas en varios spots",
        body: "Si viajas entre spots con condiciones diferentes, el quiver ideal para Colombia sería:",
        list: [
          "Cometa 9 m² — para Calima en días fuertes y La Guajira media temporada",
          "Cometa 12 m² — versátil para Calima, Guajira y Atlántico",
          "Cometa 15 m² — para La Boquilla, Tominé y días ligeros en cualquier spot",
          "Twintip 136–140 cm — versátil para todos los spots",
          "Neopreno 3/2 mm — para Calima y Tominé",
        ],
      },
    ],
    tags: ["spot", "Colombia", "quiver", "Calima", "Guajira", "planificación"],
    relatedSlugs: ["equipo-para-empezar-kitesurf", "como-elegir-tamano-cometa", "que-cometa-usar-viento-fuerte-vs-ligero"],
  },

  {
    title: "Cómo comprar equipo de kitesurf de segunda mano sin cometer errores",
    slug: "comprar-equipo-segunda-mano",
    category: "Primeros pasos",
    categorySlug: "primeros-pasos",
    readTime: 7,
    summary: "El mercado de segunda mano es la forma más inteligente de armar tu quiver sin gastar una fortuna. Pero comprar equipo de kite usado sin saber qué revisar puede salirte caro. Esta guía te enseña a comprar bien.",
    intro: "El kitesurf de segunda mano es un mercado enorme y lleno de oportunidades. Una cometa de 3 años en buen estado puede funcionar tan bien como una nueva a la mitad del precio. Pero también hay equipo en mal estado que parece estar bien. Saber qué revisar es la diferencia entre una ganga y un error caro.",
    sections: [
      {
        heading: "Qué revisar en una cometa usada",
        body: "La cometa es el elemento más crítico. Una cometa con problemas puede ser peligrosa.",
        list: [
          "Infla completamente y espera 30 minutos — no debe perder presión",
          "Revisa el leading edge (tubo principal) buscando reparaciones o bultos",
          "Inspecciona cada strut por dentro y por fuera",
          "Revisa la tela contra la luz — busca áreas desgastadas o transparentes",
          "Examina las costuras del bridle (puntos de anclaje de las líneas)",
          "Verifica que no tenga reparaciones grandes o múltiples",
          "Pregunta siempre por el historial de la cometa",
        ],
        tip: "Una o dos reparaciones pequeñas en lugares no críticos son aceptables. Múltiples reparaciones en el leading edge son señal de mal trato — mejor evitar.",
      },
      {
        heading: "Qué revisar en una barra y líneas",
        body: "La barra incluye el sistema de seguridad — revísalo con especial cuidado.",
        list: [
          "Prueba el quick release varias veces — debe abrirse sin esfuerzo",
          "Revisa las líneas: sin cortes, pelado ni decoloración",
          "Comprueba que las cuatro líneas tienen la misma longitud",
          "Verifica el estado del chicken loop y las conexiones",
          "Prueba el sistema de depower — debe mover la barra suavemente",
        ],
      },
      {
        heading: "Qué revisar en una tabla",
        body: "Las tablas son más fáciles de evaluar visualmente.",
        list: [
          "Golpea suavemente toda la superficie — un sonido hueco indica delaminación",
          "Revisa los bordes por astillas o golpes fuertes",
          "Inspecciona los insertos de los straps — no deben moverse",
          "Verifica que el pad esté bien adherido",
          "Pequeñas marcas de uso son normales — busca daños estructurales",
        ],
      },
      {
        heading: "Preguntas que siempre debes hacer al vendedor",
        body: "Antes de comprar, pregunta:",
        list: [
          "¿Por qué vendes? (Cambio de nivel, cambio de disciplina, mudanza — todas válidas)",
          "¿Cuántas sesiones tiene aproximadamente?",
          "¿Ha tenido algún accidente o impacto fuerte?",
          "¿Tiene reparaciones? ¿Cuáles y dónde?",
          "¿Puedo verla inflada / en agua?",
        ],
      },
      {
        heading: "Precio justo para equipo usado",
        body: "Como referencia general para Colombia:",
        table: {
          headers: ["Estado", "Precio vs. nuevo"],
          rows: [
            ["1–2 años, excelente estado", "60–70% del precio nuevo"],
            ["2–4 años, buen estado", "40–55% del precio nuevo"],
            ["4–6 años, funcional", "25–40% del precio nuevo"],
            ["Más de 6 años", "Máximo 20–25% — revisar muy bien"],
          ],
        },
        tip: "En Quiver Co. puedes filtrar por estado del equipo. 'Como nuevo' y 'Usado' en buen estado son los mejores valores del mercado.",
      },
    ],
    tags: ["segunda mano", "compra", "checklist", "presupuesto", "principiante"],
    relatedSlugs: ["equipo-para-empezar-kitesurf", "que-cometa-comprar-principiante", "como-elegir-barra"],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug);
}

export function getGuidesByCategory(categorySlug: string): Guide[] {
  return GUIDES.filter(g => g.categorySlug === categorySlug);
}

export function getRelatedGuides(guide: Guide): Guide[] {
  if (!guide.relatedSlugs) return [];
  return guide.relatedSlugs
    .map(slug => GUIDES.find(g => g.slug === slug))
    .filter((g): g is Guide => !!g);
}
