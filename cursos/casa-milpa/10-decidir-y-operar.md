**Español** · [English](en/10-decidir-y-operar.md)

# Decidir y operar una casa que evoluciona

**Resultado:** registrarás una decisión con límites de evidencia y distinguirás las actualizaciones de paquetes de las del template.

## Doctrina que se puede comprobar

La doctrina orienta quién decide, qué debe explicarse y qué afirmaciones deben sostenerse con evidencia. Su valor operativo aparece cuando una condición se incumple y un mecanismo real rechaza el paso. Un título de «gobernado» o un archivo de reglas no demuestra ese mecanismo.

Tres hábitos permiten mantener esa diferencia: formular una pregunta que cambie el orden de construcción, probar una afirmación pequeña e interpretar el cierre en función de lo realmente observado. Si la evidencia sólo muestra llamadas secuenciales, no concluyas que el dominio maneja concurrencia. Si el test sólo observa el servicio, no concluyas que HTTP requiere el scope correcto.

Los contratos públicos que puedes extender como aplicación son las operaciones y sus efectos. Gate, fundación e historial de sesión son piezas del sustrato con sus responsabilidades. No hay un contrato público genérico para que cualquier plugin declare una nueva compuerta del piso. Para una política de tu dominio usa sus puntos de integración definidos y prueba las entradas que la hacen valer.

## Registrar una decisión

Conserva las decisiones de la casa bajo `.milpa/decisions/` y su evidencia bajo `.milpa/evidence/`. Sigue la numeración existente después del acta. Puedes crear un archivo como `0002-disponibilidad-secuencial.md` con esta estructura:

```markdown
# Disponibilidad secuencial en el primer taller

Estado: aceptada por la autoridad humana de producto

Pregunta: ¿una herramienta conserva su disponibilidad y rechaza un segundo préstamo?

Contexto: el primer taller es operado por una persona, con llamadas secuenciales.

Decisión: usar operaciones agregar, listar, prestar y devolver; persistencia local de archivo.

Fronteras: no personas, pagos, reservas ni préstamos concurrentes.

Evidencia: pruebas del servicio, CLI entre procesos y prueba HTTP 401 403 200.

Consecuencia: antes de aceptar concurrencia necesitamos una transición atómica probada.

Pregunta abierta: ¿el siguiente uso real exige múltiples operadores simultáneos?
```

Este es un registro legible de la casa, **no el formato de entrada del motor `milpa/governance`**. Escribe autor, fecha, comandos y referencias concretas a la evidencia. Un archivo vacío o el nombre de un test que no se ejecutó no sostiene la decisión.

Para una enmienda de propósito o fronteras registra qué cambia y por qué, conserva el acta inicial y revisa las partes que hacen valer el cambio. No vuelvas a fundar para sobrescribir lo anterior. Si una decisión nueva sustituye otra, conserva ambos documentos y la relación entre ellos.

## Cuándo adoptar el motor de gobernanza

`milpa/governance` es una capacidad especializada que valida y compila un corpus de decisiones y un perfil. Es un motor puro: recibe objetos, no lee por sí mismo todos los archivos de una casa. El host debe proporcionar un repositorio de gobernanza e integrar sus verificaciones al flujo elegido.

Una adopción puede comenzar con `composer require milpa/governance`, pero esa instalación no conecta automáticamente el enforcement del producto. El paquete usa su formato de ADRs y perfil bajo `.milpa/governance/`, y ofrece `GovernanceValidator`, `GovernanceCompiler` y `GovernanceRepositoryInterface`. Sigue su [README](https://github.com/getmilpa/governance/blob/main/README.md) y prueba la integración real antes de declararla activa.

El validador comprueba referencias, sustituciones y compuertas declaradas como enforced contra mecanismos admitidos. Un `boundTo` admitido prueba la validez de la declaración bajo ese contrato; el host todavía debe ejecutar el mecanismo que cita. Una prueba de integración que incumpla la condición y observe el rechazo cierra esa afirmación.

No necesitas este motor para terminar el taller. La casa recién fundada ya tiene constitución; una administración más compleja se adopta cuando la pregunta y la evidencia la justifican.

## Observar la operación

Antes de diagnosticar pregunta por el estado:

```bash
php bin/coa house:start --json
php bin/coa house:context --json
php bin/coa routes:list --json
php bin/coa stack --json
php bin/coa plugins:list --json
```

`stack` describe servicios que los plugins declararon y su disponibilidad observada; no inicia contenedores sólo porque alguien abrió la página. Un listado vacío significa que no hay declaraciones en ese catálogo, no que comprobaste la ausencia de toda dependencia posible en tu código.

Si una operación desaparece, revisa el paquete presente, proveedor declarado, plugin activo y superficie admitida. Si HTTP devuelve 401 o 403, revisa identidad y alcance; si falla al arrancar con una operación protegida, revisa la política conectada. Si devuelve 428 por una lectura no clasificada, revisa su perfil de efectos. Si el dominio devuelve `ya_prestada`, funciona una regla del negocio: no es una avería de autenticación.

Con `milpa/devtools`, `doctor` aporta diagnóstico. Los contratos informan los argumentos y la evidencia de otras herramientas como reparación o validación. No ejecutes todas las reparaciones a ciegas ni interpretes un catálogo que arranca como prueba de conectividad de una base remota.

## Actualizar paquetes y archivos de nacimiento

Los paquetes bajo `vendor/` se actualizan mediante Composer. Revisa cambios de contrato, ejecuta las pruebas y conserva el lock. Previsualiza la resolución con Composer:

```bash
composer update --dry-run
```

Los archivos copiados por `composer create-project` no se sustituyen sólo por actualizar un paquete. Para ellos la casa conserva procedencia:

```bash
php bin/coa framework:provenance --json
php bin/coa framework:diff --json
php bin/coa operation:contract --name=framework:apply --json
```

`framework:diff` puede consultar el registro para comparar versiones y no escribe cambios. Revisa qué archivos permanecen originales y cuáles personalizaste. La aplicación de un template nuevo evita pisar personalizaciones y declara efectos sobre el ejecutable; decide la versión y la aplicación concreta después de revisar el diff. Guarda un respaldo verificable y prueba el arranque y el dominio después.

## Antes de atender un uso real

Un taller de laboratorio no demuestra una operación multiusuario. Para atender ese uso define acceso por recurso, transición atómica si hay concurrencia, auditoría de hechos, respaldos y restauración probada. Configura el servidor web y PHP para el entorno, TLS cuando haya credenciales por red, ubicación durable de datos y secretos fuera del árbol público. Esas decisiones nacen de requisitos concretos del uso que aceptas.

Prueba además qué ocurre con una dependencia caída. Listar el catálogo debe seguir disponible si no requiere esa dependencia. Una ruta que sí la necesita debe devolver un fallo comprensible y registrar la causa sin exponer secretos. «El proceso arrancó» y «el dominio está listo para atender» son evidencias diferentes.

## Comprobación

Entrega una decisión con evidencia, una pregunta abierta y un plan breve de recuperación. Demuestra que puedes distinguir una actualización de runtime de una del template. Para respaldos, una copia existente no basta: restaura en otra ubicación y lee el estado esperado.

Continúa con [construir tu propia casa](11-tu-propia-casa.md).
