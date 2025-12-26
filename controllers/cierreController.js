const CierreModel = require('../models/CierreModel.JS');

const cierreController = {
    // Obtener todos los cierres
    obtenerTodos: async (req, res) => {
        try {
            const cierres = await CierreModel.obtenerTodosCierres();

            // Formatear datos para el frontend
            const cierresFormateados = cierres.map(cierre => ({
                id_cierre: cierre.id_cierre,
                id_caja: cierre.id_caja,
                fecha_cierre: cierre.fecha_cierre,
                efectivo_inicial: cierre.efectivo_inicial,
                total_ventas: cierre.total_ventas,
                total_efectivo: cierre.total_efectivo,
                total_transferencias: cierre.total_transferencias,
                total_tarjetas: cierre.total_tarjetas,
                total_mixto: cierre.total_mixto,
                efectivo_esperado: cierre.efectivo_esperado,
                efectivo_contado: cierre.efectivo_contado,
                diferencia: cierre.diferencia,
                observaciones: cierre.observaciones,
                usuario_cierre: cierre.usuario_cierre,
                fecha_caja: cierre.fecha_caja,
                caja_efectivo_inicial: cierre.caja_efectivo_inicial
            }));

            res.json({
                success: true,
                data: cierresFormateados,
                total: cierresFormateados.length
            });
        } catch (error) {
            console.error('Error al obtener cierres:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los cierres de caja'
            });
        }
    },

    // Obtener detalles de un cierre específico
    obtenerDetalles: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de cierre es requerido'
                });
            }

            // 1. Obtener cierre principal
            const cierre = await CierreModel.obtenerCierrePorId(id);

            if (!cierre) {
                return res.status(404).json({
                    success: false,
                    message: 'Cierre de caja no encontrado'
                });
            }

            // 2. Obtener facturas del día del cierre
            const facturas = await CierreModel.obtenerFacturasDetalladasPorDia(cierre.fecha_cierre);

            // 3. Obtener consolidado del día
            const consolidado = await CierreModel.obtenerConsolidadoVentasDia(cierre.fecha_cierre);

            // 4. Calcular resumen por métodos de pago
            const resumenMetodosPago = calcularResumenMetodosPago(facturas, consolidado);

            // 5. Preparar respuesta
            const respuesta = {
                ...cierre,
                ventas_del_dia: facturas,
                consolidado: consolidado,
                resumen_metodos_pago: resumenMetodosPago,
                estadisticas: {
                    total_facturas: consolidado?.total_facturas || 0,
                    venta_promedio: consolidado?.total_facturas > 0
                        ? consolidado.total_ventas / consolidado.total_facturas
                        : 0,
                    venta_maxima: facturas.length > 0
                        ? Math.max(...facturas.map(f => f.total))
                        : 0,
                    venta_minima: facturas.length > 0
                        ? Math.min(...facturas.map(f => f.total))
                        : 0
                }
            };

            res.json({
                success: true,
                data: respuesta
            });
        } catch (error) {
            console.error('Error al obtener detalles del cierre:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los detalles del cierre'
            });
        }
    },


    // Obtener cierres por fecha
    obtenerPorFecha: async (req, res) => {
        try {
            const { fecha } = req.query;

            if (!fecha) {
                return res.status(400).json({
                    success: false,
                    message: 'Fecha es requerida'
                });
            }

            const cierres = await CierreModel.obtenerCierresPorFecha(fecha);

            res.json({
                success: true,
                data: cierres,
                total: cierres.length
            });
        } catch (error) {
            console.error('Error al obtener cierres por fecha:', error);
            res.status(500).json({
                success: false,
                message: 'Error al filtrar cierres por fecha'
            });
        }
    },

    // Obtener estadísticas generales
    obtenerEstadisticas: async (req, res) => {
        try {
            const estadisticas = await CierreModel.obtenerEstadisticasCierres();

            res.json({
                success: true,
                data: estadisticas
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas de cierres'
            });
        }
    },

    // Actualizar observaciones
    actualizarObservaciones: async (req, res) => {
        try {
            const { id } = req.params;
            const { observaciones } = req.body;

            if (!id || observaciones === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'ID y observaciones son requeridos'
                });
            }

            const actualizado = await CierreModel.actualizarObservaciones(id, observaciones);

            if (!actualizado) {
                return res.status(404).json({
                    success: false,
                    message: 'Cierre no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Observaciones actualizadas correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar observaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar observaciones'
            });
        }
    },

    // Crear nuevo cierre
    crearCierre: async (req, res) => {
        try {
            const datosCierre = req.body;

            // Validar datos requeridos
            const camposRequeridos = [
                'id_caja',
                'efectivo_inicial',
                'total_ventas',
                'total_efectivo',
                'efectivo_esperado',
                'efectivo_contado',
                'diferencia',
                'usuario_cierre'
            ];

            for (const campo of camposRequeridos) {
                if (datosCierre[campo] === undefined || datosCierre[campo] === null) {
                    return res.status(400).json({
                        success: false,
                        message: `El campo ${campo} es requerido`
                    });
                }
            }

            const idCierre = await CierreModel.crearCierre(datosCierre);

            res.status(201).json({
                success: true,
                message: 'Cierre de caja registrado exitosamente',
                data: {
                    id_cierre: idCierre
                }
            });
        } catch (error) {
            console.error('Error al crear cierre:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar el cierre de caja'
            });
        }
    }
};



// Función auxiliar para calcular resumen de métodos de pago
function calcularResumenMetodosPago(facturas) {
    const resumen = {};

    facturas.forEach(factura => {
        const metodo = factura.metodo_pago || 'No especificado';

        if (!resumen[metodo]) {
            resumen[metodo] = {
                metodo: metodo,
                total: 0,
                cantidad: 0,
                icono: obtenerIconoMetodoPago(metodo)
            };
        }

        resumen[metodo].total += Number(factura.total || 0);
        resumen[metodo].cantidad += 1;
    });

    return Object.values(resumen).sort((a, b) => b.total - a.total);
}


// Función para obtener icono según método de pago
function obtenerIconoMetodoPago(metodo) {
    const metodoLower = metodo.toLowerCase();

    if (metodoLower.includes('efectivo')) return '💵';
    if (metodoLower.includes('transferencia')) return '🏦';
    if (metodoLower.includes('tarjeta')) return '💳';
    if (metodoLower.includes('mixto') || metodoLower.includes('+')) return '🔄';

    return '💰';
}

module.exports = cierreController;