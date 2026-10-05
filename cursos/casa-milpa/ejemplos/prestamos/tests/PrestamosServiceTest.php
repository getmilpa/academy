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

namespace App\Tests;

use App\Plugins\Prestamos\Domain\PrestamosService;
use App\Plugins\Prestamos\Entities\Herramienta;
use Milpa\Data\FileRepository;
use Milpa\Data\InMemoryRepository;
use PHPUnit\Framework\TestCase;

final class PrestamosServiceTest extends TestCase
{
    public function testElPrestamoDuplicadoSeRechazaSinCambiarElEstado(): void
    {
        $repository = new InMemoryRepository(Herramienta::class);
        $service = new PrestamosService($repository);
        $alta = $service->agregar('  Taladro  ');
        self::assertSame('Taladro', $alta['herramienta']['nombre']);
        $id = $alta['herramienta']['id'];
        self::assertTrue($service->prestar($id)['ok']);
        $antes = $repository->find($id)->toArray();

        self::assertSame('ya_prestada', $service->prestar($id)['code']);
        self::assertSame($antes, $repository->find($id)->toArray());
        self::assertTrue($service->devolver($id)['ok']);
        self::assertFalse($repository->find($id)->prestada);
        self::assertSame('ya_disponible', $service->devolver($id)['code']);
    }

    public function testUnaEntradaInvalidaONoExistenteNoCreaDatos(): void
    {
        $repository = new InMemoryRepository(Herramienta::class);
        $service = new PrestamosService($repository);
        self::assertSame('nombre_invalido', $service->agregar('   ')['code']);
        self::assertSame('nombre_invalido', $service->agregar(str_repeat('a', 121))['code']);
        self::assertSame('herramienta_ausente', $service->prestar(999)['code']);
        self::assertSame('herramienta_ausente', $service->devolver(999)['code']);
        self::assertSame([], $repository->all());
    }

    public function testElEstadoSobreviveANuevasInstanciasDelRepositorio(): void
    {
        $path = sys_get_temp_dir() . '/milpa-prestamos-' . bin2hex(random_bytes(8)) . '.json';
        try {
            $primero = new PrestamosService(new FileRepository($path, Herramienta::class));
            $id = $primero->agregar('Coa')['herramienta']['id'];
            self::assertTrue($primero->prestar($id)['ok']);

            $segundo = new PrestamosService(new FileRepository($path, Herramienta::class));
            self::assertTrue($segundo->listar()['herramientas'][0]['prestada']);
            self::assertSame('ya_prestada', $segundo->prestar($id)['code']);
        } finally {
            if (is_file($path)) {
                unlink($path);
            }
        }
    }
}
