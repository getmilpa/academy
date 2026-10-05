# Fundar la casa y declarar sus autoridades

**Resultado:** tu casa tendrá dominio, objetivo, fronteras y un acta que permita leer la decisión de fundación.

## Decidir antes de escribir

La fundación responde qué existe aquí y quién decide sobre ello. Para el ejercicio:

- Dominio: préstamos de herramientas.
- Objetivo: registrar herramientas y operar su disponibilidad en un taller local.
- Fronteras: sin pagos, sin datos personales y sin préstamos concurrentes.
- Autoridades: humana para producto y cambios destructivos.

Las fronteras reducen la primera afirmación que debes probar. Evitan que un ejercicio de disponibilidad se vuelva también una aplicación de personas, reservas o facturación. Más adelante podrás revisar una frontera con una decisión y evidencia; fundar no impide evolucionar.

## Identidad para las llamadas de escritura

La puerta de terminal de la versión comprobada exige una llamada firmada para cambios que perduran, o una continuación con una autorización vigente de su secuencia. Estar en una terminal no constituye por sí mismo esa autorización. Una firma identifica quién autorizó **esta llamada**, con su operación y argumentos.

Consulta tus claves:

```bash
gpg --list-secret-keys --keyid-format long
```

Si todavía no tienes una clave de firma, créala con tu identidad y sigue el diálogo de GnuPG para protegerla:

```bash
gpg --quick-gen-key 'Tu Nombre <tu-correo@ejemplo.com>' ed25519 sign never
```

Si tienes varias claves, selecciona tu clave de firma como `default-key` en la configuración de GnuPG correspondiente a tu llavero, conservando las opciones existentes. Usa la huella completa que devuelve `gpg --list-secret-keys`. Una clave visible con `--list-secret-keys` no siempre es la que la selección predeterminada elegirá.

`GNUPGHOME` permite usar un llavero separado. Si lo usas, el proceso que ejecuta `coa` debe recibir el mismo valor. Un error `No secret key` se resuelve comprobando la clave seleccionada, su capacidad de firma y el llavero efectivo. No se resuelve prestando tu clave humana a un agente.

## Previsualizar y fundar

Lee el contrato y ejecuta primero la previsualización:

```bash
php bin/coa operation:contract --name=foundation:found --json
php bin/coa foundation:found \
  --domain='Préstamos de herramientas' \
  --objective='Registrar herramientas y operar su disponibilidad en un taller local' \
  --boundaries='["Sin pagos","Sin datos personales","Sin préstamos concurrentes"]' \
  --dry-run --json
```

La previsualización informa qué escribiría: la constitución y el acta. No debe convertir la casa en fundada. Vuelve a preguntar `foundation` si quieres comprobarlo.

Cuando esos datos describan tu decisión, realiza la llamada:

```bash
php bin/coa foundation:found \
  --domain='Préstamos de herramientas' \
  --objective='Registrar herramientas y operar su disponibilidad en un taller local' \
  --boundaries='["Sin pagos","Sin datos personales","Sin préstamos concurrentes"]' \
  --sign --json
php bin/coa foundation --json
```

GnuPG puede pedir la contraseña de tu clave. `--sign` autoriza lo que estás invocando; no concede una autorización general para otras operaciones. La salida de terminal puede incluir una línea de autorización además del JSON. Un consumidor automático debe manejar esos canales y no suponer que toda la salida combinada es un único objeto JSON.

## Leer lo que quedó

Encontrarás `.milpa/foundation.json`, con esquema `milpa.foundation/v1`, dominio, objetivo, fronteras, autoridades y fecha, y un acta bajo `.milpa/decisions/`. En una casa recién creada será `0001-fundacion.md`. La fecha se registra en UTC: puede corresponder al día siguiente respecto a tu hora local.

En este esquema las formas de autoridad aceptadas por la fundación son humanas; no inventes valores como `agent` o `committee` porque suenen adecuados. Las autoridades por omisión incluyen `product` y `destructive_changes`. Un plugin puede tener sus propios roles o permisos, pero eso no altera el contrato de este archivo.

El lector de fundación diferencia ausencia o placeholder, datos inválidos y un esquema que no puede interpretar. No confunde cualquiera de esos estados con una casa fundada. `foundation:found` es un rito de una sola vez y rechaza una segunda fundación. Para evolucionar escribe una decisión de enmienda; no uses el rito otra vez ni elimines la historia para que acepte.

## Una declaración necesita implementación

Escribir `Sin pagos` registra una frontera. No analiza automáticamente cada handler para garantizar que ninguno cobre. La casa debe evitar adoptar capacidades y entradas que contradigan esa frontera, y sus pruebas deben demostrar las restricciones que implementó.

La firma tampoco prueba que el código sea correcto o que una clave tenga cualquier autoridad de producto. Identidad, autorización, contrato y evidencia son piezas relacionadas que responden preguntas distintas. En las unidades 07 y 09 aprenderás a leerlas juntas sin confundirlas.

## Comprobación

La salida de `foundation` debe indicar `founded: true`. Lee el acta, compara el objetivo con lo que autorizaste y conserva el diff de los archivos escritos. Formula una prueba que haga valer una frontera: por ejemplo, el dominio no aceptará un nombre vacío y no almacenará un prestatario porque los datos personales están fuera del alcance.

Continúa con [la arquitectura](03-arquitectura.md).
