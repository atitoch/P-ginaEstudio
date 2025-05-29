# 📚 Material de Estudio - Plataforma Educativa Interactiva

Una plataforma web interactiva diseñada para el estudio de **Programación Web** y **Sistemas Programables**, con cuestionarios dinámicos y navegación intuitiva.

## 🌟 Características

- **Interfaz moderna y responsiva** con gradientes atractivos
- **Cuestionarios interactivos** con preguntas aleatorias
- **Múltiples tipos de pregunta**: opción múltiple, verdadero/falso, completar espacios
- **Sistema de puntuación** en tiempo real
- **Navegación breadcrumb** para mejor orientación
- **Diseño mobile-first** adaptable a diferentes dispositivos
- **Animaciones suaves** para mejor experiencia de usuario

## 📁 Estructura del Proyecto

```
MaterialEstudio/
├── index.html                          # Página principal
├── ProgramacionWeb/
│   ├── index.html                      # Índice de Programación Web
│   ├── ProgWebU4.html                  # Cuestionario JavaScript (Unidad 4)
│   └── u4.gift                         # Formato GIFT para preguntas
└── SistemasProgramables/
    ├── index.html                      # Índice de Sistemas Programables
    ├── SisProgU3.html                  # Cuestionario Arduino (Unidad 3)
    └── u3.gift                         # Formato GIFT para preguntas
```

## 🚀 Características Técnicas

### Programación Web - Unidad 4: JavaScript
- **80 preguntas** sobre fundamentos de JavaScript
- Temas cubiertos:
  - Sintaxis básica y variables
  - Tipos de datos (números, strings, booleanos)
  - Objetos y arrays
  - Funciones y control de flujo
  - DOM y eventos
  - Secuencias de escape
  - Operadores especiales

### Sistemas Programables - Unidad 3: Arduino
- **100 preguntas** sobre placas Arduino
- Temas cubiertos:
  - Microcontroladores y especificaciones técnicas
  - Placas Arduino (UNO, MEGA, Leonardo, Due, etc.)
  - Protocolos de comunicación (I2C, SPI, UART)
  - Características específicas por modelo
  - Conectividad inalámbrica
  - Aplicaciones IoT

## 🎯 Funcionalidades del Cuestionario

### Características Principales
- **Preguntas aleatorias**: Cada sesión presenta las preguntas en orden diferente
- **Opciones mezcladas**: Las respuestas de opción múltiple se reorganizan aleatoriamente
- **Validación inteligente**: Acepta múltiples variaciones de respuestas correctas
- **Feedback inmediato**: Muestra la respuesta correcta después de cada pregunta
- **Progreso visual**: Barra de progreso y contador de preguntas
- **Resultados detallados**: Puntuación final con opción de reintentar

### Tipos de Preguntas
1. **Opción Múltiple**: 4 opciones con una respuesta correcta
2. **Verdadero/Falso**: Preguntas de confirmación conceptual
3. **Completar**: Llenar espacios en blanco con respuestas específicas

## 💻 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: 
  - Flexbox y Grid Layout
  - Gradientes y transiciones
  - Diseño responsivo
  - Variables CSS personalizadas
- **JavaScript Vanilla**:
  - Algoritmo Fisher-Yates para aleatorización
  - Delegación de eventos
  - LocalStorage (implementación futura)
  - Validación de formularios

## 🎨 Diseño UI/UX

### Paleta de Colores
- **Programación Web**: Verde (#4caf50) a verde claro (#8bc34a)
- **Sistemas Programables**: Naranja (#ff9800) a amarillo (#ffc107)
- **Gradiente principal**: Púrpura (#667eea) a violeta (#764ba2)

### Características de Diseño
- **Cards flotantes** con sombras suaves
- **Iconos emoji** para identificación visual rápida
- **Botones con hover effects** y transiciones
- **Typography hierarchy** clara y legible
- **Espaciado consistente** siguiendo principios de diseño

## 📱 Responsive Design

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**:
  - Móvil: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid adaptativo** que se reorganiza según el tamaño de pantalla
- **Touch-friendly** buttons y elementos interactivos

## 🔧 Instalación y Uso

1. **Clonar el repositorio**:
```bash
git clone [URL-del-repositorio]
cd MaterialEstudio
```

2. **Abrir en navegador**:
```bash
# Usar un servidor local (recomendado)
python -m http.server 8000
# O usar Live Server en VS Code
```

3. **Navegar**:
   - Abre `http://localhost:8000` en tu navegador
   - Selecciona la materia deseada
   - Comienza un cuestionario

## 📊 Formato GIFT

Los archivos `.gift` contienen las preguntas en formato estándar para importación a LMS:

```gift
::Pregunta:: ¿Cuál es la respuesta correcta?{
=Opción correcta
~Opción incorrecta 1
~Opción incorrecta 2
~Opción incorrecta 3
}
```

## 🚧 Desarrollos Futuros

- [ ] **Sistema de autenticación** de usuarios
- [ ] **Persistencia de progreso** con LocalStorage/Base de datos
- [ ] **Más unidades** para ambas materias
- [ ] **Modo examen** con tiempo límite
- [ ] **Estadísticas detalladas** por tema
- [ ] **Export de resultados** en PDF
- [ ] **Modo offline** con Service Workers
- [ ] **Integración con LMS** (Moodle, Canvas)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para facilitar el aprendizaje en programación web y sistemas embebidos.

---

**¿Encontraste un bug o tienes una sugerencia?** ¡Abre un issue en GitHub!
