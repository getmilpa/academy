[Español](../08-superficies.md) · **English**

# Choosing the house's surfaces

**Outcome:** you will expose an HTTP read with verified access and understand what it means for an operation to appear in CLI, TUI or MCP.

## One operation several entries

Declaring operations avoids writing a different catalogue of capabilities per surface. Each projection keeps a native form: a command name in CLI, a form in TUI, an MCP tool and a route in HTTP. The same declaration does not mean unrestricted access or an identical identity on all of them.

| Surface | Workshop entry | Relevant boundary |
| --- | --- | --- |
| CLI | `herramientas:listar` | Local read; signed writes |
| TUI | `php bin/coa shell` | Navigation of the catalogue; a call that needs a signature goes back to CLI |
| MCP | `herramientas_listar` in the client | Local stdio pipe and the authority presented to the process |
| HTTP | `GET /taller/herramientas` | Express exposure and a caller with `herramientas:read` |

`shell` and `chat` are screens that converse; they are not domain operations. At a destination without an interactive terminal they print a frame and exit. In the TUI, Enter opens the operation and Esc goes back. If the door cannot sign, it reports the exact terminal line that authorizes it; pressing a button does not replace identity.

## Connecting HTTP identity

The workshop already uses `milpa/data`. Adopt identity:

```bash
php bin/coa capabilities:enable milpa/auth --dry-run --json
php bin/coa capabilities:enable milpa/auth --sign --json
php bin/coa operation:contract --name=token:new --json
```

In `config/boot.php` the house connects the policy with `milpa/auth` and the Bearer store and verifier with `milpa/data`. `App\Http\IdentityWiring` registers those pieces. `App\Http\IdentityChain` carries them to the request before the handler. Keep that path when you incorporate middleware of your own.

In this exercise the token store uses its own file, `storage/tokens.json`, if you did not configure another. The tools file belongs to `prestamos.storage`; do not share the file collection between different entities.

Adopting auth may also declare the passkey door. You do not need to complete that ceremony to check Bearer. In a browser, the passkey identity may be another principal. The Bearer is processed first and a rejected token is not laundered by a cookie. Writes authenticated by cookie have the JSON and origin conditions the chain implements; an application that modifies that path needs to test them again.

## Exposing only the read

Edit `config/http.php` and name the internal operation:

```php
<?php
declare(strict_types=1);

return ['expose' => ['herramientas.listar']];
```

If you already had exposed operations, review the complete list before replacing it. The name uses a dot; the path is declared by the operation. Because it admits HTTP and has `path: '/taller/herramientas'`, it produces that read route. The example's writes do not admit HTTP and we do not add them here.

The host refuses to expose operations with scopes or permissions if the corresponding policy is missing. Having the package installed without connecting the verifier does not produce a valid identity either; it is a server configuration problem. Do not remove the scopes to make the boot stop complaining.

## Testing the negative and the positive

Start `php -S localhost:8000 -t public` in another terminal. Without identity:

```bash
curl -i http://localhost:8000/taller/herramientas
# HTTP 401
```

Mint a read token and one with a foreign scope:

```bash
php bin/coa token:new --actor='curso-lector' \
  --scopes='["herramientas:read"]' --sign --json
php bin/coa token:new --actor='curso-sin-lectura' \
  --scopes='["otro:read"]' --sign --json
```

The secret is shown once; the store keeps its hash. Keep the id to revoke later. Do not include the secret in your evidence or in a versioned file. Capture the token through your terminal's input or your secrets manager; the following Bash or Zsh example lets you paste it without writing it in the command:

```bash
read -r -s MILPA_READ_TOKEN
curl -i -H "Authorization: Bearer $MILPA_READ_TOKEN" \
  http://localhost:8000/taller/herramientas
# HTTP 200 and the collection
unset MILPA_READ_TOKEN
```

Repeat with the `otro:read` token and expect HTTP 403. The absence of identity, an identity without scope and an admitted identity are three different cases. That positive check keeps a middleware that rejects absolutely everything from looking correct because it passes only negatives.

When you finish, look up the ids and revoke the two tokens:

```bash
php bin/coa token:list --json
php bin/coa token:revoke --id='ID_REAL_DEL_TOKEN' --sign --json
```

Replace the placeholder with each real id. Revocation applies on the next request. `token:list` does not recover the secret.

## Discovering the same domain from MCP

MCP is optional:

```bash
php bin/coa capabilities:enable milpa/mcp-server --dry-run --json
php bin/coa capabilities:enable milpa/mcp-server --sign --json
```

Configure your MCP client to run PHP with the absolute path of `mi-taller/bin/coa` and the argument `mcp`. Many clients accept a structure of this kind; adjust to their documented format:

```json
{
  "mcpServers": {
    "mi-taller": {
      "command": "php",
      "args": ["/ruta/absoluta/mi-taller/bin/coa", "mcp"]
    }
  }
}
```

`bin/mcp-server.php` remains as a compatible entry and delegates to `coa mcp`. STDOUT contains JSON-RPC messages, one per line; the output for people goes to STDERR. The client keeps the pipe open during the dialogue. A pipe closed immediately after sending messages can end the supervisor before you receive responses; checking only exit code 0 does not demonstrate a handshake.

Ask for `tools/list` and find `herramientas_listar`, `herramientas_agregar`, `herramientas_prestar` and `herramientas_devolver`. Invoke the read with empty arguments. The course's test obtained the collection from the same file as CLI. `mcp` is a transport entry; do not look for it as a domain operation in `operation:contract`.

Without a presented identity, reads through the local pipe can run as `stdio`; a write that lasts is rejected and returns the signed line that must authorize it. That the tool appears in `tools/list` does not guarantee that this caller can execute it. The runtime can also receive a valid token through `MILPA_TOKEN` in the process's environment; its identity and scopes are judged at the corresponding door. A demand for a signature is not resolved by returning a confirmation text from the same client.

Do not use the presence of `MILPA_TOKEN` as proof that it was verified: test the effective identity and access, including a positive control and another with a foreign scope. The semantics of the local host must be reviewed before reusing its transport as a remote service.

## Checkpoint

Keep the three HTTP results without secrets. Explain the path identity → policy → handler → service. If you activated MCP, keep the name of the tool, the real result of the read and the rejection of an unauthorized write. You do not need MCP to continue to the end of the course.

Continue with [bringing in an agent](09-agentes.md).
