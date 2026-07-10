# Onboarding — tu primera cosecha

> Para developers que quieren *probar* Milpa hoy. Cada ejercicio está
> diseñado para completarse **con ayuda de un agente de IA** (Claude Code,
> Codex, el que uses) — no como trampa, sino como parte del punto: el
> framework está construido para que humanos y agentes trabajen juntos.
> Al final de cada siembra hay un **criterio de éxito verificable** — si el
> comando lo confirma, cosechaste.

## Requisitos

- PHP ≥ 8.3 y Composer 2.
- Un agente de IA con acceso a tu terminal (opcional pero recomendado).
- 30–60 minutos por siembra.

## Quick start (5 minutos)

```bash
composer create-project milpa/skeleton mi-app
cd mi-app
php -S localhost:8000 -t public
# abre http://localhost:8000 — una app que corre, con cero base de datos
```

En otra terminal, desde `mi-app`:

```bash
php bin/coa doctor          # el sistema se autodiagnostica
```

Si `doctor` confirma que el plugin, el contenedor, el dispatcher y la ruta
arrancaron, el campo está listo.

> **Tip para tu agente:** antes de pedirle nada, dile que corra
> `php bin/coa inspect:plugins`, `php bin/coa inspect:routes` y
> `php bin/coa inspect:commands`, y que lea el `README.md` de la app. Esas
> superficies existen en el skeleton público y reducen la adivinación.

---

## 🌱 Siembra 1 — Haz que el campo diga tu nombre

**Objetivo:** entender el flujo request → respuesta y perderle el miedo al repo.

1. Encuentra dónde se genera la respuesta de `/` (pista: pídele a tu agente
   que la rastree desde `public/index.php`).
2. Cambia la respuesta para que salude con tu nombre.
3. **Éxito:** `curl localhost:8000` te saluda. `php bin/coa doctor` sigue
   confirmando que el kernel arrancó.

**Prompt sugerido para tu agente:**
> "En esta app milpa/skeleton, rastrea cómo se genera la respuesta de la
> ruta raíz y modifícala para que responda 'Hola, [nombre] — el campo está
> sembrado'. Después corre `php bin/coa doctor` y confirma que todo sigue
> verde."

---

## 🌱 Siembra 2 — Enciende la superficie para agentes

**Objetivo:** vivir la idea central — *una acción declarada una vez, para
humanos y agentes.*

El skeleton inicial es deliberadamente mínimo: todavía no instala el runtime
de tools ni el servidor MCP. Actívalos de forma explícita y genera una tool:

```bash
php bin/coa agent:enable
php bin/coa make:tool CalendarPlugin DiasParaTool --description="Calcula los días hasta una fecha"
```

1. Sigue la instrucción que imprime el generador para registrar
   `CalendarPlugin` en `config/plugins.php`.
2. Abre la clase generada, implementa el cálculo y revisa su atributo `#[Tool]`.
3. Inspecciona lo que realmente registró el kernel:
   ```bash
   php bin/coa inspect:tools
   ```
4. **Éxito:** `inspect:tools` muestra la tool y su descripción. Antes de
   `agent:enable`, el mismo comando debe explicar limpiamente que la superficie
   agent-ready no está habilitada.

**Qué aprendiste sin darte cuenta:** atributos de PHP como contratos,
registro por introspección, y el pipeline resolver→validar→autorizar→
ejecutar→auditar que corre en cada llamada.

---

## 🌱 Siembra 3 — Rompe el grafo (a propósito)

**Objetivo:** entender contratos de módulos leyendo errores bien diseñados.

1. Genera un consumidor con una capacidad todavía inexistente:
   ```bash
   php bin/coa make:plugin ConsumerPlugin --requires=academy.demo
   ```
2. Sigue la instrucción del generador y registra **solo** `ConsumerPlugin` en
   `config/plugins.php`.
3. Corre `php bin/coa validate` y **lee el error con calma**.
4. Genera al proveedor y regístralo también:
   ```bash
   php bin/coa make:plugin ProviderPlugin --provides=academy.demo
   php bin/coa validate
   ```
5. **Éxito:** viste el error preciso (qué falta y quién lo pide), y luego
   viste al grafo resolverse cuando alguien proveyó la capacidad.

**Bonus del bonus:** crea dos plugins con contratos cruzados y registra ambos:

```bash
php bin/coa make:plugin CycleA --provides=cycle.a --requires=cycle.b
php bin/coa make:plugin CycleB --provides=cycle.b --requires=cycle.a
php bin/coa validate
```

Así se ve un sistema que falla *antes* de producción y señala el ciclo.

---

## 🌱 Siembra 4 — Del generador a una ruta verificable

**Objetivo:** inspeccionar qué escribe un generador y cerrar el ciclo contra el
runtime real.

1. Genera un controlador y su plugin de rutas:
   ```bash
   php bin/coa make:controller PingPlugin PingController --path=/ping
   ```
2. Lee la lista de archivos y la instrucción de registro que imprime el
   comando; después revisa el código generado antes de registrarlo.
3. Añade `PingPlugin` a `config/plugins.php` y verifica la tabla real:
   ```bash
   php bin/coa inspect:routes
   curl localhost:8000/ping
   ```
4. **Éxito:** `/ping` aparece en `inspect:routes` y responde por HTTP.

El motor de `milpa/devtools` construye archivos planeados en memoria, aplica un
`WriteGuard` y verifica sus salidas. El CLI público actual **no expone** una
opción `--dry-run`; para ver ese diseño sin atribuirle una bandera inexistente,
usa el artifact [El plan antes del disco](../artifacts/#plan) y audita el código
de `milpa/devtools`.

---

## 🌱 Siembra 5 — Cambia la piel sin tocar el hueso

**Objetivo:** contratos aplicados a interfaces (no requiere PHP).

1. Clona `github.com/getmilpa/milpa-design` y corre `npm install && npm run proof`.
2. Crea tu propio skin (un CSS con overrides de tokens — colores, radios,
   fuente) siguiendo `THEMING.md` nivel 1.
3. Valídalo: `npm run verify:theme -- mi-skin.css`.
4. **Éxito:** tu skin pasa el gate (contraste AA verificado en automático)
   y puedes ver el blog de prueba con TU piel: misma estructura, otra marca.

**Prompt sugerido:**
> "Lee THEMING.md de este repo y crea un skin nivel 1 con [tu paleta].
> Debe pasar `npm run verify:theme`. Si un par de contraste falla, ajusta
> los valores hasta que pase — sin tocar CSS estructural."

---

## ¿Terminaste las cinco?

Ya viste con tus manos: contratos de módulos, grafo de dependencias, una
superficie agent-ready explícita, scaffolding verificado por el runtime y
theming por contrato. Eso es arquitectura que se puede inspeccionar y probar.

Siguientes pasos:
- **¿Encontraste algo raro?** Eso vale oro → [`CONTRIBUIR.md`](./CONTRIBUIR.md).
- **¿Quieres profundizar?** → [`REFERENCIA-SENIOR.md`](./REFERENCIA-SENIOR.md).
