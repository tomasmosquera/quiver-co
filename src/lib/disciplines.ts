export interface GearItem {
  name: string;
  desc: string;
}

export interface GearVariant {
  name: string;
  desc: string;
}

export interface GearVariantCategory {
  category: string;
  variants: GearVariant[];
}

export interface Discipline {
  slug: string;
  name: string;
  emoji: string;
  comingSoon: boolean;
  tagline: string;
  description: string;
  vsOthers: string;
  history: string;
  basicGear: GearItem[];
  gearVariants: GearVariantCategory[];
  color: string;
  badge: string;
}

export const DISCIPLINES: Discipline[] = [
  {
    slug: "kitesurf",
    name: "Kitesurf",
    emoji: "🪁",
    comingSoon: false,
    tagline: "La cometa que te lleva volando sobre el agua.",
    description:
      "El kitesurf combina la potencia del viento con la libertad del agua para crear una de las experiencias más emocionantes de los deportes acuáticos. El practicante controla una cometa de gran tamaño mediante una barra y líneas, mientras desliza sobre el agua parado en una tabla. La cometa genera tracción suficiente para desplazarse a alta velocidad, saltar varios metros por encima del agua y ejecutar maniobras acrobáticas espectaculares.\n\nEl deporte se practica en playas, lagunas y océanos de todo el mundo, y admite múltiples disciplinas según el tipo de agua y el estilo del rider: freeride para el placer de deslizar, freestyle para trucos y saltos, big air para alturas máximas, wave para surfear olas con la cometa, y race para competición de velocidad. Esta versatilidad lo convierte en uno de los deportes de agua más populares del planeta.\n\nEs accesible para personas con buena condición física a partir de los 14-15 años. El aprendizaje suele llevar entre 9 y 15 horas de clases con instructor certificado antes de poder navegar de forma autónoma. Una vez dominado, el kitesurf abre un mundo sin límites de aventura y progresión.",
    vsOthers:
      "A diferencia del windsurf, en el kitesurf la vela (cometa) vuela en el aire separada del cuerpo, lo que genera una tracción mucho mayor con equipos más ligeros y compactos. Comparado con el wingfoil, el kitesurf tiene mayor potencia y velocidad máxima, aunque requiere más espacio de seguridad y una curva de aprendizaje inicial más exigente. Frente al wakeboard, el kitesurf no depende de un bote ni de un cable: el viento es tu motor.",
    history:
      "Los hermanos franceses Bruno y Dominique Legaignoux patentaron en el año 2000 la cometa inflable de tubo que se convertiría en la base del kitesurf moderno. Aunque experimentos con cometas de tracción sobre agua se registran desde los años 80 con figuras como Gijsbertus Adrianus Panhuise, fue la patente Legaignoux la que permitió comercializar el deporte de forma segura. A partir de 2001 la industria creció exponencialmente y hoy existen cientos de marcas y millones de practicantes en todo el mundo.",
    basicGear: [
      { name: "Cometa (kite)", desc: "La vela inflable que vuela en el aire y genera tracción. Se mide en metros cuadrados (m²); un talla mayor vuela con menos viento." },
      { name: "Barra y líneas", desc: "Sistema de control con 4 o 5 líneas que conectan la cometa al rider. La barra permite dirigir la cometa y activar la seguridad." },
      { name: "Tabla", desc: "Superficie sobre la que el rider se desplaza. Los diseños varían según la disciplina: twintip, surfboard o foilboard." },
      { name: "Arnés", desc: "Chaleco o cinturón que toma la tracción de la barra y la transfiere al cuerpo, reduciendo el esfuerzo en brazos." },
      { name: "Traje de neopreno", desc: "Protege del frío, el sol y las caídas. El grosor depende de la temperatura del agua." },
      { name: "Casco y chaleco", desc: "Equipo de seguridad recomendado para principiantes y en condiciones de viento fuerte o zona rocosa." },
    ],
    gearVariants: [
      {
        category: "Tipos de cometa",
        variants: [
          { name: "C-kite", desc: "Forma cuadrada con poca curvatura. Tracción directa y agresiva, preferida en freestyle avanzado por su respuesta precisa." },
          { name: "Bow / SLE", desc: "Cometa plana con Leading Edge Supported. Gran rango de viento, despower seguro y reenganche fácil; ideal para principiantes." },
          { name: "Delta", desc: "Híbrido entre C y Bow. Equilibra potencia y seguridad, buen comportamiento en olas y freeride." },
          { name: "Hybrid", desc: "Diseño mixto que busca lo mejor de cada forma. Alta versatilidad para riders que practican varias disciplinas." },
        ],
      },
      {
        category: "Tipos de tabla",
        variants: [
          { name: "Twintip", desc: "Tabla simétrica con punta y cola iguales. La más usada en freeride y freestyle; permite navegar en ambas direcciones sin girar." },
          { name: "Surfboard", desc: "Tabla de surf adaptada para kitesurf con straps. Ideal para wave riding y sensaciones de surf puro." },
          { name: "Foilboard", desc: "Tabla corta y robusta equipada con un foil hidráulico. Permite volar sobre el agua a baja velocidad de viento." },
        ],
      },
    ],
    color: "bg-sky-50 border-sky-100 hover:border-sky-300",
    badge: "text-sky-700",
  },
  {
    slug: "kitefoil",
    name: "Kitefoil",
    emoji: "⚡",
    comingSoon: false,
    tagline: "Vuela sobre el agua impulsado por el viento.",
    description:
      "El kitefoil lleva la experiencia del kitesurf a otra dimensión: gracias a un foil hidráulico montado bajo la tabla, el rider despega literalmente de la superficie del agua y navega suspendido en el aire a centímetros de las olas. La sensación es absolutamente única — silencio casi total, sin resistencia del agua, deslizando a velocidades que pueden superar los 50 km/h con vientos moderados.\n\nEl foil está compuesto por un mástil vertical que une la tabla al fuselaje subacuático, del que cuelgan las alas hidráulicas (front wing y stabilizer). Al ganar velocidad, las alas generan sustentación y elevan toda la estructura. El rider controla la altura mediante el desplazamiento del peso corporal y la potencia de la cometa. La disciplina exige un equilibrio fino y una lectura constante del viento.\n\nRequiere experiencia previa en kitesurf convencional: se recomienda tener un nivel sólido en twintip antes de pasar al foil. Una vez dominado, el kitefoil abre la puerta a la competición de alto rendimiento (fórmula kite, el único formato olímpico en esta categoría) y a navegaciones de larga distancia imposibles con tabla plana.",
    vsOthers:
      "El kitefoil utiliza la misma cometa y barra que el kitesurf convencional, pero el foil cambia completamente la física del deporte: menor resistencia al avance, mayor eficiencia energética y posibilidad de navegar con vientos muy ligeros donde una tabla plana no podría moverse. Comparado con el wingfoil, la cometa ofrece mayor potencia y permite alcanzar velocidades más altas, pero requiere el espacio aéreo libre para las líneas.",
    history:
      "El foiling en kitesurf comenzó como experimento de riders de élite hacia 2008-2010, cuando Manu Bertin y otros pioneros adaptaron foils de windsurf a tablas de kite. La disciplina explotó popularmente tras su debut en el circuito mundial en 2012 y su inclusión olímpica en los Juegos de París 2024 bajo el formato IQ Foil para windsurf y Kite Foil para kitesurf. Hoy es la disciplina de mayor crecimiento dentro del mundo del kite.",
    basicGear: [
      { name: "Cometa (kite)", desc: "Mismas cometas que en kitesurf estándar, aunque en kitefoil suelen preferirse tallas más pequeñas por la eficiencia del foil." },
      { name: "Barra y líneas", desc: "Sistema de control idéntico al kitesurf convencional, generalmente con líneas de 20-24 m." },
      { name: "Mástil de foil", desc: "Perfil de aluminio o carbono que conecta la tabla al fuselaje subacuático. La longitud (60-100 cm) determina la altura de vuelo." },
      { name: "Fuselaje y alas", desc: "Fuselaje horizontal del que nacen el ala frontal (front wing) y el estabilizador trasero. Determinan la velocidad y el comportamiento de vuelo." },
      { name: "Tabla de foil", desc: "Tabla corta y reforzada con insertos para montar el mástil. Más pequeña y ligera que una twintip estándar." },
      { name: "Arnés", desc: "Generalmente arnés de cinturón para mayor movilidad de cadera, esencial para controlar el foil con el cuerpo." },
    ],
    gearVariants: [
      {
        category: "Tipos de foil",
        variants: [
          { name: "Race foil", desc: "Alas largas y estrechas (alto aspect ratio) para máxima velocidad y eficiencia. Diseñado para competición." },
          { name: "Freeride foil", desc: "Alas más anchas y de aspecto medio. Equilibrio entre velocidad, estabilidad y facilidad de manejo." },
          { name: "Big air foil", desc: "Configuración para saltos de altura máxima: aterrizaje suave y reenganche fiable tras grandes saltos." },
        ],
      },
      {
        category: "Tipos de ala (front wing)",
        variants: [
          { name: "Bajo aspect ratio", desc: "Ala ancha y corta. Más estable, ideal para aprender, funciona con vientos ligeros." },
          { name: "Alto aspect ratio", desc: "Ala larga y estrecha. Más rápida y eficiente, pero requiere más precisión en el control." },
        ],
      },
    ],
    color: "bg-rose-50 border-rose-100 hover:border-rose-300",
    badge: "text-rose-700",
  },
  {
    slug: "wingfoil",
    name: "Wingfoil",
    emoji: "🪽",
    comingSoon: false,
    tagline: "Surf, viento y vuelo — sin líneas, sin límites.",
    description:
      "El wingfoil es la disciplina más joven de los deportes de viento sobre agua, nacida alrededor de 2019. El rider sostiene un wing (ala inflable rígida) directamente con las manos, sin líneas ni barra, mientras un foil hidráulico bajo la tabla lo eleva sobre la superficie del agua. La combinación de libertad total de movimiento, curva de aprendizaje relativamente accesible y sensación de vuelo puro lo ha convertido en el deporte de mayor crecimiento en los últimos años.\n\nAl no depender de líneas ni barra, el wingfoil es más seguro que el kitesurf en espacios reducidos y permite practicarse en zonas donde los kites están prohibidos. El wing se sostiene y se suelta con facilidad, lo que simplifica el manejo de seguridad. El equipo es compacto y cabe en el maletero de un coche, lo que facilita el transporte.\n\nEs ideal para surfistas, kitesurfistas y windsurfistas que buscan una disciplina nueva, así como para personas sin experiencia previa en deportes de viento. El aprendizaje hasta navegación autónoma con foil puede lograrse en 10-20 horas de práctica, especialmente si se tiene base en surf o deportes de equilibrio.",
    vsOthers:
      "El wingfoil no tiene líneas ni barra, lo que lo hace más seguro y maniobrable en espacios reducidos que el kitesurf. Comparado con el windsurf, el rig es mucho más ligero y no está conectado a la tabla, permitiendo movimientos más libres y aterrizajes más suaves. Frente al kitefoil, el wingfoil tiene menor potencia máxima pero mayor accesibilidad y es practicable en zonas restringidas para kites.",
    history:
      "Aunque experimentos con wings de mano datan de los años 80 (Schweitzer y otros surfistas de Maui), el wingfoil moderno como deporte masivo nació en 2019 cuando marcas como Duotone, F-One y Cabrinha lanzaron wings inflables de alta calidad. La pandemia de 2020 actuó como catalizador: con playas menos concurridas y ganas de aire libre, miles de personas descubrieron el wingfoil. En 2021-2023 se convirtió en el segmento de mayor crecimiento de toda la industria de deportes acuáticos.",
    basicGear: [
      { name: "Wing (ala)", desc: "Ala inflable sostenida con las manos. Genera tracción del viento sin necesidad de líneas ni barra." },
      { name: "Mástil de foil", desc: "Perfil vertical de carbono o aluminio que conecta la tabla al fuselaje subacuático." },
      { name: "Fuselaje y alas del foil", desc: "Sistema hidráulico subacuático que genera la sustentación y eleva al rider sobre el agua." },
      { name: "Tabla de wingfoil", desc: "Tabla de mayor volumen que las de kitefoil, especialmente en niveles principiantes, para facilitar el equilibrio." },
      { name: "Arnés (opcional)", desc: "Algunos riders usan arnés con leash de wing para reducir el esfuerzo en brazos en sesiones largas." },
      { name: "Leash de tabla", desc: "Cordón que une la tabla al tobillo o pantorrilla del rider para no perderla en caídas." },
    ],
    gearVariants: [
      {
        category: "Tipos de wing",
        variants: [
          { name: "Freeride", desc: "Wing de uso general con buen rango de viento. Ideal para la mayoría de condiciones y niveles." },
          { name: "Crossover", desc: "Diseñado para surfear olas y también navegar en plano. Equilibra potencia y manejabilidad." },
          { name: "Race", desc: "Wing aerodinámico para velocidad máxima y competición. Requiere técnica avanzada." },
        ],
      },
      {
        category: "Tipos de foil",
        variants: [
          { name: "Freeride foil", desc: "Alas de aspecto medio, estables y versátiles. El más recomendado para aprender y para uso general." },
          { name: "Surf foil", desc: "Configuración optimizada para surfear olas con el wing. Alas con mayor maniobrabilidad a baja velocidad." },
          { name: "Race foil", desc: "Alto aspect ratio para eficiencia y velocidad máxima. Reservado para riders avanzados y competición." },
        ],
      },
    ],
    color: "bg-violet-50 border-violet-100 hover:border-violet-300",
    badge: "text-violet-700",
  },
  {
    slug: "windsurf",
    name: "Windsurf",
    emoji: "🏄",
    comingSoon: true,
    tagline: "El clásico del viento: vela, tabla y libertad.",
    description:
      "El windsurf es el deporte acuático de viento por excelencia, con más de cinco décadas de historia. El rider se para sobre una tabla flotante y controla una vela rígida sujeta a un mástil articulado mediante una botavara. A diferencia de los deportes con cometa, toda la energía del viento se transmite directamente a través del rig que el rider sostiene con sus manos y su cuerpo, creando una conexión física muy directa con los elementos.\n\nEl windsurf admite múltiples disciplinas: freeride para el placer de navegar en aguas abiertas, wave para surfear olas con la vela, freestyle para acrobacias y saltos, y slalom/race para competición de velocidad pura. Los riders de élite de slalom alcanzan velocidades superiores a 90 km/h, y los récords de velocidad sobre el agua con vela pertenecen históricamente al windsurf.\n\nEs un deporte que combina técnica, fuerza y lectura del viento. La curva de aprendizaje inicial es moderada pero la progresión hacia niveles avanzados requiere dedicación y condiciones específicas de viento y oleaje.",
    vsOthers:
      "El windsurf es el único deporte de esta familia donde el rig (vela+mástil+botavara) está físicamente conectado a la tabla pero no al rider, lo que permite soltarlo y recuperarlo fácilmente en caso de caída. Comparado con el kitesurf, requiere más fuerza física pero ofrece mayor control en condiciones extremas. Frente al wingfoil, tiene mayor potencia y velocidad máxima pero el equipo es más voluminoso y el transporte más complicado.",
    history:
      "El windsurf moderno fue inventado en 1964 por Jim Drake y Hoyle Schweitzer en California, aunque el diseño patentado que democratizó el deporte llegó en 1968. Durante los años 70 y 80 fue un fenómeno masivo que llenó las playas de todo el mundo. Alcanzó su pico de popularidad en los 80 y 90, con su inclusión olímpica en Los Ángeles 1984. Aunque la llegada del kitesurf en los 2000 redujo su base de practicantes, el windsurf sigue siendo un deporte técnicamente sofisticado con una comunidad apasionada y leal.",
    basicGear: [
      { name: "Vela", desc: "La vela de windsurf es semirrígida, con cámara de aire y varillas (batens) que le dan forma aerodinámica. Se mide en m²." },
      { name: "Mástil", desc: "Tubo vertical de fibra de carbono o vidrio sobre el que se monta la vela. La flexión (IMCS) debe coincidir con la vela." },
      { name: "Botavara", desc: "Barra horizontal de aluminio o carbono que el rider agarra para controlar la vela. Se regula en longitud." },
      { name: "Tabla", desc: "La tabla de windsurf tiene caja para el mástil (pie de mástil) y deriva o aleta para navegar de bolina." },
      { name: "Arnés", desc: "Se conecta a unas cinchas en la botavara para transferir la tracción de la vela al cuerpo del rider." },
      { name: "Aleta (fin)", desc: "Aleta en la cola de la tabla que proporciona estabilidad y permite navegar de bolina." },
    ],
    gearVariants: [
      {
        category: "Tipos de vela",
        variants: [
          { name: "Freeride", desc: "Vela versátil para uso general, fácil de manejar en un amplio rango de viento." },
          { name: "Wave", desc: "Vela pequeña y manejable para surfear olas. Diseñada para maniobrar rápidamente." },
          { name: "Freestyle", desc: "Vela con buen rango de potencia y respuesta rápida para acrobacias y saltos." },
          { name: "Race / Slalom", desc: "Vela potente y rápida para competición. Alto rendimiento en vientos medios y fuertes." },
        ],
      },
      {
        category: "Tipos de tabla",
        variants: [
          { name: "Freeride", desc: "Tabla ancha y estable para principiantes e intermedios. Fácil de usar en condiciones variadas." },
          { name: "Wave", desc: "Tabla corta y maniobrable para surfear olas. Requiere más habilidad para manejarla." },
          { name: "Slalom / Race", desc: "Tabla estrecha y alargada para velocidad máxima. Solo para riders avanzados." },
        ],
      },
    ],
    color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300",
    badge: "text-emerald-700",
  },
  {
    slug: "wakeboard",
    name: "Wakeboard",
    emoji: "🚤",
    comingSoon: true,
    tagline: "Trucos, aire y adrenalina detrás del bote.",
    description:
      "El wakeboard es un deporte acuático donde el rider es remolcado por una lancha motora o por un sistema de cable eléctrico, y utiliza la estela generada (wake) como rampa natural para saltar y ejecutar maniobras aéreas. La tabla tiene bindings fijos que sujetan los pies del rider, similar al snowboard, lo que permite un control preciso durante los trucos.\n\nExisten dos modalidades principales: el wakeboard detrás de bote, donde la velocidad y la forma de la estela dependen del bote y sus lastres, y el wakeboard de cable (cable park), donde un sistema de cable eléctrico remolca al rider a velocidad constante sobre un lago o canal equipado con módulos (kickers, rails, boxes) que simulan un parque de snow. Los cable parks democratizaron el deporte al eliminar la necesidad de un bote.\n\nEl wakeboard es uno de los deportes acuáticos más accesibles para personas sin experiencia previa: con la instrucción adecuada, la mayoría consigue levantarse sobre la tabla en la primera sesión. La progresión hacia trucos y saltos es gradual y muy satisfactoria.",
    vsOthers:
      "A diferencia del kitesurf o el windsurf, el wakeboard no depende del viento — el motor del bote o el cable eléctrico son la fuente de propulsión. Esto lo hace practicable en condiciones de cero viento y en zonas de agua interior como lagos y ríos. Comparado con el esquí acuático, la tabla de wakeboard es más corta, simétrica y permite trucos más complejos y saltos más altos.",
    history:
      "El wakeboard surgió a finales de los años 80 como evolución del esquí acuático, impulsado por Tony Finn y su 'Skurfer' (1985) y posteriormente popularizado por Herb O'Brien con las primeras tablas de wakeboard comerciales en 1990. Durante los 90 el deporte creció rápidamente, fue incluido en los X Games en 1996 y experimentó un boom global. La aparición de los cable parks en los 2000 amplió su base de practicantes de forma exponencial.",
    basicGear: [
      { name: "Tabla y bindings", desc: "Tabla simétrica con bindings fijos que sujetan los pies. El tamaño depende del peso del rider." },
      { name: "Barra de remolque", desc: "En wakeboard de bote: la barra y cuerda que conecta al rider con el bote. En cable park, el sistema de cable lo reemplaza." },
      { name: "Chaleco salvavidas", desc: "Obligatorio en wakeboard de bote. Proporciona flotabilidad y protección en caídas." },
      { name: "Traje de neopreno", desc: "Para agua fría o como protección adicional. En cable park puede sustituirse por boardshort en verano." },
      { name: "Casco", desc: "Recomendado especialmente en cable park donde hay módulos metálicos y otros riders." },
    ],
    gearVariants: [
      {
        category: "Tipos de tabla",
        variants: [
          { name: "Tabla de bote", desc: "Diseñada para aprovechar el wake del bote. Más flexible y con rocker pronunciado para saltos." },
          { name: "Tabla de cable", desc: "Más rígida para soportar el impacto en los módulos de parque. Generalmente sin canales profundos." },
          { name: "Wakeskate", desc: "Tabla sin bindings, similar a un skate sobre el agua. Mayor libertad de movimiento pero más difícil de controlar." },
        ],
      },
      {
        category: "Estilos de práctica",
        variants: [
          { name: "Boat wake", desc: "Detrás de lancha. La estela actúa de rampa; se enfoca en saltos limpios y trucos con envergadura." },
          { name: "Cable park", desc: "Cable eléctrico sobre lago con módulos. Permite practicar sin bote y con parques de obstáculos." },
          { name: "Park / rails", desc: "Subespecialidad de cable enfocada en deslizar sobre módulos metálicos (rails, boxes, kickers)." },
        ],
      },
    ],
    color: "bg-orange-50 border-orange-100 hover:border-orange-300",
    badge: "text-orange-700",
  },
  {
    slug: "paddle",
    name: "Paddle (SUP)",
    emoji: "🏝️",
    comingSoon: true,
    tagline: "Calma, equilibrio y conexión con el agua.",
    description:
      "El Stand-Up Paddleboard (SUP) es la disciplina más tranquila y accesible de todas las actividades sobre el agua. El rider se para de pie sobre una tabla de gran volumen y se desplaza usando un remo largo con pala en un solo extremo. La versatilidad del SUP es extraordinaria: puede practicarse en mares en calma, ríos, lagos, o incluso en olas como una forma alternativa de surf.\n\nEl paddle SUP combina el ejercicio cardiovascular con el trabajo de equilibrio y core. Es uno de los mejores deportes de bajo impacto para todas las edades y niveles de forma física. La variante de SUP surf añade la emoción de coger olas con la ventaja de la visibilidad elevada que da estar de pie, lo que permite ver y elegir las olas con mucha antelación.\n\nLas versiones inflables han democratizado el SUP completamente: una tabla inflable de calidad cabe en una mochila y puede llevarse en avión, lo que abre la práctica a cualquier destino de vacaciones. Es un deporte ideal para familias, viajeros y personas que buscan una actividad de bienestar en contacto con la naturaleza.",
    vsOthers:
      "El paddle SUP es el único deporte de esta selección que no requiere viento ni motor — el propio rider es la fuente de propulsión. Es mucho más tranquilo y meditativo que el kitesurf o el wingfoil, y más accesible que el windsurf para personas sin experiencia deportiva previa. Comparado con el kayak, el SUP ofrece mayor visibilidad, ejercita más el cuerpo completo y tiene una sensación de conexión con el agua muy diferente.",
    history:
      "El stand-up paddling tiene raíces antiguas en culturas polinesias y hawaianas, donde los instructores de surf se ponían de pie sobre sus tablas para ver mejor a sus alumnos. La versión moderna del SUP fue popularizada en Hawái a principios de los 2000 por surfistas como Laird Hamilton y Dave Kalama, quienes comenzaron a usar remos en sus sesiones de entrenamiento de grandes olas. A partir de 2005 el SUP se extendió globalmente y en 2010 ya era uno de los deportes acuáticos de más rápido crecimiento en el mundo.",
    basicGear: [
      { name: "Tabla SUP", desc: "Tabla de gran volumen (generalmente 200-350 litros) que proporciona estabilidad para estar de pie. Puede ser rígida o inflable." },
      { name: "Remo", desc: "Remo monopala más largo que el rider (aproximadamente 20-25 cm por encima de la cabeza). De aluminio, fibra o carbono." },
      { name: "Leash", desc: "Cordón que une la tabla al tobillo del rider. Fundamental para la seguridad, especialmente en el mar." },
      { name: "Chaleco salvavidas", desc: "Obligatorio según regulación en muchas zonas marítimas. Puede ser inflable compacto para mayor comodidad." },
    ],
    gearVariants: [
      {
        category: "Tipos de tabla SUP",
        variants: [
          { name: "All-around", desc: "Tabla versátil para aguas tranquilas, ideal para principiantes y uso familiar." },
          { name: "Race / Touring", desc: "Tabla estrecha y alargada para máxima velocidad y travesías largas. Para riders con experiencia." },
          { name: "SUP surf", desc: "Tabla más corta y maniobrable diseñada para coger olas. Requiere buen equilibrio." },
          { name: "Inflable", desc: "Tabla que se infla con bomba. Muy portátil, resistente y fácil de transportar. Ligera pérdida de rendimiento respecto a rígidas." },
        ],
      },
    ],
    color: "bg-teal-50 border-teal-100 hover:border-teal-300",
    badge: "text-teal-700",
  },
];
