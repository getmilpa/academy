# Gobernar los efectos y la autoridad

**Resultado:** podrás revisar el techo de una operación y distinguir identidad, permisos, consentimiento e intención.

## Qué puede hacer una llamada

`mutating` informa si una operación modifica. No informa si escribe un dato local, cambia código o envía información a terceros. El perfil de efectos declara el peor caso razonable para esa operación; no sólo la ruta típica que te conviene mostrar.

| Eje | Pregunta | Ejemplo del taller |
| --- | --- | --- |
| `mutation` | ¿Qué cambio perdura? | Un préstamo escribe estado persistente |
| `externality` | ¿A quién alcanza fuera de aquí? | El ejercicio no comunica con terceros |
| `reversibility` | ¿Qué recuperación está comprobada? | Recuperación manual, sin promesa de rollback garantizado |
| `authority` | ¿De quién gasta autoridad? | La escritura actúa a nombre del operador |
| `subject` | ¿De qué está hecho el cambio? | Datos de herramientas, no ejecutables |

En el ejemplo, `Persistent`, `None`, `ManualRecovery`, `WriteAsUser` y `Data` describen las escrituras. `EffectProfile::readOnly()` clasifica la lectura. Devolver una herramienta tiene significado propio; no lo declaramos como rollback universal de cualquier préstamo porque eso exigiría otro contrato y otra evidencia.

`Guaranteed` necesita un `rollbackContract` y una recuperación efectivamente probada. Una lectura usa `NotApplicable`: no ocurrió un efecto que revertir. Si el handler futuro envía notificaciones, su externalidad ya no será `None`; si instala código, el subject ya no será `Data`.

## Lo desconocido no reduce controles

Una operación sin `effects` lleva un perfil no clasificado, con el techo de cada eje. No se interpreta como inocua porque `mutating` esté en `false`. Declarar `mutating=true` junto con `Mutation::None` está rechazado por el constructor; no hay dos versiones compatibles de ese hecho.

Cuando se combinan perfiles, el techo conserva el mayor nivel de cada eje. Un riesgo alto no desaparece al promediarlo con una lectura. Una reducción de techo requiere el mecanismo y la evidencia que su productor admite; agregar `dry_run` al esquema no prueba automáticamente que nada cambia. Sólo llama `--dry-run` en operaciones cuyo contrato lo ofrece y cuya implementación lo hace valer. El dominio del curso no ofrece esa bandera.

## Identidad permisos consentimiento e intención

La **identidad** dice quién presenta la llamada. La **política de autorización** decide si esa identidad puede usar la capacidad. Los **scopes** o un **permiso semántico** declaran qué debe juzgar esa política. El **consentimiento** satisface una demanda de autorización concreta para efectos que lo requieren. La **intención** pregunta si la operación y el objetivo corresponden a lo pedido por el humano.

Tener un scope de escritura no prueba que el humano pidió prestar la herramienta 7. Tener la intención no entrega un scope que el caller no tiene. Una firma vincula una autorización a una llamada, pero no vuelve verdadera una precondición del negocio. Si la herramienta ya está prestada, el servicio debe rechazarla incluso cuando el caller tiene toda la autoridad necesaria.

`namedTarget: 'id'` comunica al piso de una sesión que la selección de una herramienta existente debe estar nombrada en la petición humana. No es un filtro SQL ni una validación de propiedad del objeto. Si tu dominio requiere que una persona sólo opere sus herramientas, implementa una política por recurso además del scope global.

## La puerta de terminal

El runtime comprobado evita que una llamada sin firma produzca cambios persistentes. El comportamiento observado fue:

```bash
php bin/coa herramientas:agregar --nombre='Sin autorización' --json
# Rechazo de llamada no firmada; no crea una herramienta.
php bin/coa herramientas:listar --json
```

Ejecuta la escritura autorizada con `--sign`. Algunas secuencias pueden continuar con su recibo firmado mientras siga vigente; no generalices ese recibo a cualquier comando. Consulta el contrato y el estado de la secuencia que realmente continuas.

Hay también una demanda de consentimiento propia del contrato, por ejemplo `requiresConfirmation` o cambios privilegiados del ejecutable. Las puertas de superficie y el piso de sesión añaden condiciones sobre el caller y la invocación. Por eso leer sólo `requiresConfirmation=false` no permite concluir que una escritura de terminal es libre.

## Revisión práctica

```bash
php bin/coa operation:contract --name=herramientas:listar --json
php bin/coa operation:contract --name=herramientas:prestar --json
php bin/coa operation:contract --name=capabilities:enable --json
```

Compara el efecto de leer herramientas con el de adoptar un paquete ejecutable. Verifica superficies, scopes, objetivo nombrado y evidencia. Busca en el código las acciones que justifican cada clasificación. El contrato facilita una revisión que otra persona puede refutar; no es un detector infalible de lo que hace un handler.

## Comprobación

Conserva una llamada de escritura no firmada rechazada y la lectura posterior que demuestra ausencia de cambio. Después ejecuta la llamada firmada. Explica por qué la firma no debe permitir un segundo préstamo y por qué un modo automático de agente no puede fabricar tu consentimiento.

Continúa con [elegir superficies](08-superficies.md).
