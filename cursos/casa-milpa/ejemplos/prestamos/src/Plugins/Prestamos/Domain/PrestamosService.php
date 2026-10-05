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

namespace App\Plugins\Prestamos\Domain;

use App\Plugins\Prestamos\Entities\Herramienta;
use Milpa\Data\RepositoryInterface;

/**
 * Ejercicio secuencial de un solo operador. find + save no es una transacción.
 *
 * No usar esta implementación para préstamos concurrentes: ese caso necesita
 * un puerto de persistencia con transición atómica y pruebas de concurrencia.
 */
final class PrestamosService
{
    /** @param RepositoryInterface<Herramienta> $repository */
    public function __construct(private readonly RepositoryInterface $repository)
    {
    }

    /** @return array<string, mixed> */
    public function listar(): array
    {
        return [
            'ok' => true,
            'herramientas' => array_map(static fn (Herramienta $h): array => $h->toArray(), $this->repository->all()),
        ];
    }

    /** @return array<string, mixed> */
    public function agregar(string $nombre): array
    {
        $nombre = trim($nombre);
        if ($nombre === '' || strlen($nombre) > 120) {
            return ['ok' => false, 'code' => 'nombre_invalido', 'message' => 'Usa un nombre de entre 1 y 120 bytes.'];
        }

        $id = $this->repository->save(new Herramienta(null, $nombre));
        $guardada = $this->repository->find($id);
        if (!$guardada instanceof Herramienta) {
            throw new \RuntimeException('La persistencia no devolvió la herramienta que acaba de guardar.');
        }

        return ['ok' => true, 'herramienta' => $guardada->toArray()];
    }

    /** @return array<string, mixed> */
    public function prestar(int $id): array
    {
        return $this->transicion($id, true);
    }

    /** @return array<string, mixed> */
    public function devolver(int $id): array
    {
        return $this->transicion($id, false);
    }

    /** @return array<string, mixed> */
    private function transicion(int $id, bool $prestada): array
    {
        $actual = $this->repository->find($id);
        if (!$actual instanceof Herramienta) {
            return ['ok' => false, 'code' => 'herramienta_ausente', 'message' => 'La herramienta no existe.'];
        }
        if ($actual->prestada === $prestada) {
            return [
                'ok' => false,
                'code' => $prestada ? 'ya_prestada' : 'ya_disponible',
                'message' => $prestada ? 'La herramienta ya está prestada.' : 'La herramienta ya está disponible.',
            ];
        }

        $nueva = new Herramienta($actual->id, $actual->nombre, $prestada);
        $this->repository->save($nueva);

        return ['ok' => true, 'herramienta' => $nueva->toArray()];
    }
}
