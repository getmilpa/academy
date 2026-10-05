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

namespace App\Plugins\Prestamos\Entities;

use Milpa\Data\EntityInterface;

final readonly class Herramienta implements EntityInterface
{
    public function __construct(
        public int|string|null $id,
        public string $nombre,
        public bool $prestada = false,
    ) {
    }

    public function id(): int|string|null
    {
        return $this->id;
    }

    /** @return array{id: int|string|null, nombre: string, prestada: bool} */
    public function toArray(): array
    {
        return ['id' => $this->id, 'nombre' => $this->nombre, 'prestada' => $this->prestada];
    }

    /** @param array<string, mixed> $row */
    public static function fromArray(array $row): static
    {
        return new self($row['id'] ?? null, $row['nombre'], $row['prestada']);
    }
}
