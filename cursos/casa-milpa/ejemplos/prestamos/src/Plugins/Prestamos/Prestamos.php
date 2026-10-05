<?php

/**
 * This file is part of Milpa Framework.
 *
 * (c) Rodrigo Vicente - TeamX Agency — https://teamx.agency <hola@teamx.agency>
 *
 * @license Apache-2.0
 *
 * @link https://github.com/getmilpa/framework
 */

declare(strict_types=1);

namespace App\Plugins\Prestamos;

use App\Plugins\Prestamos\Domain\PrestamosService;
use App\Plugins\Prestamos\Entities\Herramienta;
use Milpa\Attributes\PluginMetadata;
use Milpa\Command\CommandProvider;
use Milpa\Command\Effect\Authority;
use Milpa\Command\Effect\EffectProfile;
use Milpa\Command\Effect\Externality;
use Milpa\Command\Effect\Mutation;
use Milpa\Command\Effect\Reversibility;
use Milpa\Command\Effect\Subject;
use Milpa\Command\Operation;
use Milpa\Data\RepositoryFactory;
use Milpa\Interfaces\Di\DIContainerInterface;
use Milpa\Interfaces\Plugin\PluginInterface;
use Milpa\Runtime\Config;
use Milpa\Runtime\Kernel;

#[PluginMetadata(version: '0.1.0', author: 'Curso Milpa', site: 'https://github.com/getmilpa/framework', name: 'Prestamos', type: 'Web')]
final class Prestamos implements PluginInterface, CommandProvider
{
    private ?PrestamosService $service = null;

    public function __construct(private readonly DIContainerInterface $container)
    {
    }

    public function boot(): void
    {
        // Declarar la casa no abre una conexión ni lee datos del dominio.
    }

    public function install(): void
    {
    }

    public function uninstall(): void
    {
    }

    public function enable(): void
    {
    }

    public function disable(): void
    {
    }

    /** @return list<Operation> */
    public function operations(): array
    {
        $lectura = EffectProfile::readOnly();
        $escritura = new EffectProfile(
            mutation: Mutation::Persistent,
            externality: Externality::None,
            reversibility: Reversibility::ManualRecovery,
            authority: Authority::WriteAsUser,
            subject: Subject::Data,
        );
        $idSchema = [
            'type' => 'object',
            'required' => ['id'],
            'properties' => ['id' => ['type' => 'integer', 'minimum' => 1]],
        ];

        return [
            new Operation(
                name: 'herramientas.listar',
                description: 'Consultar herramientas y su disponibilidad.',
                handler: fn (array $input): array => $this->service()->listar(),
                scopes: ['herramientas:read'],
                path: '/taller/herramientas',
                surfaces: ['cli', 'tui', 'mcp', 'http'],
                effects: $lectura,
                observableEvidence: 'La colección devuelta por el repositorio del dominio.',
            ),
            new Operation(
                name: 'herramientas.agregar',
                description: 'Registrar una herramienta disponible.',
                handler: fn (array $input): array => $this->service()->agregar($input['nombre']),
                inputSchema: [
                    'type' => 'object',
                    'required' => ['nombre'],
                    'properties' => ['nombre' => ['type' => 'string']],
                ],
                mutating: true,
                scopes: ['herramientas:write'],
                surfaces: ['cli', 'tui', 'mcp'],
                effects: $escritura,
                observableEvidence: 'La herramienta con id asignado, recuperada de la persistencia.',
            ),
            new Operation(
                name: 'herramientas.prestar',
                description: 'Prestar una herramienta que está disponible.',
                handler: fn (array $input): array => $this->service()->prestar($input['id']),
                inputSchema: $idSchema,
                mutating: true,
                scopes: ['herramientas:write'],
                surfaces: ['cli', 'tui', 'mcp'],
                namedTarget: 'id',
                effects: $escritura,
                observableEvidence: 'La herramienta persistida con prestada=true.',
            ),
            new Operation(
                name: 'herramientas.devolver',
                description: 'Devolver una herramienta que está prestada.',
                handler: fn (array $input): array => $this->service()->devolver($input['id']),
                inputSchema: $idSchema,
                mutating: true,
                scopes: ['herramientas:write'],
                surfaces: ['cli', 'tui', 'mcp'],
                namedTarget: 'id',
                effects: $escritura,
                observableEvidence: 'La herramienta persistida con prestada=false.',
            ),
        ];
    }

    private function service(): PrestamosService
    {
        if ($this->service !== null) {
            return $this->service;
        }

        $kernel = $this->container->has(Kernel::class) ? $this->container->get(Kernel::class) : null;
        $root = $kernel instanceof Kernel ? $kernel->root() : \dirname(__DIR__, 3);
        $config = $this->container->get(Config::class);
        \assert($config instanceof Config);
        $storage = $config->get('prestamos.storage', ['driver' => 'file', 'path' => $root . '/var/herramientas.json']);
        if (!\is_array($storage)) {
            throw new \InvalidArgumentException('prestamos.storage debe ser un arreglo de configuración.');
        }

        return $this->service = new PrestamosService(RepositoryFactory::fromConfig($storage, Herramienta::class));
    }
}
