import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const dataIngresosSalidas = [
  { mes: 'Ene', ingresos: 1250, salidas: 980 },
  { mes: 'Feb', ingresos: 1420, salidas: 1100 },
  { mes: 'Mar', ingresos: 1680, salidas: 1350 },
  { mes: 'Abr', ingresos: 1890, salidas: 1580 },
  { mes: 'May', ingresos: 2100, salidas: 1750 },
  { mes: 'Jun', ingresos: 2350, salidas: 1920 }
];

const dataEstados = [
  { name: 'Aprobados', value: 856, color: '#10b981' },
  { name: 'En Revisión', value: 234, color: '#f59e0b' },
  { name: 'Observados', value: 145, color: '#f97316' },
  { name: 'Rechazados', value: 67, color: '#ef4444' }
];

const dataPasos = [
  { paso: 'Los Libertadores', total: 450 },
  { paso: 'Chacalluta', total: 380 },
  { paso: 'Cardenal Samoré', total: 320 },
  { paso: 'Jama', total: 210 },
  { paso: 'Otros', total: 340 }
];

export function Reportes() {
  const [fechaInicio, setFechaInicio] = useState('2026-01-01');
  const [fechaFin, setFechaFin] = useState('2026-06-17');
  const [pasoFronterizo, setPasoFronterizo] = useState('todos');

  const handleGenerarReporte = () => {
    const pasoLabel = pasoFronterizo === 'todos' ? 'Todos los pasos' : pasoFronterizo;

    const filas = [
      ['Reporte Sistema de Aduanas - Gobierno de Chile'],
      [`Período: ${fechaInicio} al ${fechaFin}`],
      [`Paso Fronterizo: ${pasoLabel}`],
      [`Generado: ${new Date().toLocaleString('es-CL')}`],
      [],
      ['--- INGRESOS Y SALIDAS POR MES ---'],
      ['Mes', 'Ingresos', 'Salidas', 'Total'],
      ...dataIngresosSalidas.map(d => [d.mes, d.ingresos, d.salidas, d.ingresos + d.salidas]),
      [],
      ['--- ESTADO DE TRÁMITES ---'],
      ['Estado', 'Cantidad', 'Porcentaje'],
      ...dataEstados.map(d => [d.name, d.value, `${((d.value / 1302) * 100).toFixed(1)}%`]),
      [],
      ['--- ACTIVIDAD POR PASO FRONTERIZO ---'],
      ['Paso Fronterizo', 'Total Trámites'],
      ...dataPasos.map(d => [d.paso, d.total]),
      [],
      ['--- MOTIVOS DE OBSERVACIÓN / RECHAZO ---'],
      ['Motivo', 'Cantidad', 'Porcentaje'],
      ['Documentación incompleta', 89, '42%'],
      ['Documentos vencidos', 56, '26%'],
      ['Declaración SAG incorrecta', 34, '16%'],
      ['Falta autorización notarial', 21, '10%'],
      ['Otros', 12, '6%'],
    ];

    const csv = filas.map(fila => fila.join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-aduanas-${fechaInicio}-${fechaFin}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Reporte exportado correctamente', { description: 'Archivo CSV listo para abrir en Excel' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl mb-1">Reportes e Indicadores</h1>
          <p className="text-muted-foreground">
            Estadísticas y análisis del sistema de control fronterizo
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Reporte</CardTitle>
            <CardDescription>
              Seleccione el período y paso fronterizo para generar el reporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha Término</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pasoFronterizo">Paso Fronterizo</Label>
                <select
                  id="pasoFronterizo"
                  value={pasoFronterizo}
                  onChange={(e) => setPasoFronterizo(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm"
                >
                  <option value="todos">Todos los pasos</option>
                  <option value="libertadores">Los Libertadores</option>
                  <option value="chacalluta">Chacalluta</option>
                  <option value="samore">Cardenal Samoré</option>
                  <option value="jama">Jama</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleGenerarReporte} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Trámites</CardDescription>
              <CardTitle className="text-3xl">1,302</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ingresos</CardDescription>
              <CardTitle className="text-3xl">765</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+8.3%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Salidas</CardDescription>
              <CardTitle className="text-3xl">537</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+15.2%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tasa de Aprobación</CardDescription>
              <CardTitle className="text-3xl">85.6%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span>-2.1%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos y Salidas por Mes</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataIngresosSalidas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#0891b2" name="Ingresos" />
                  <Bar dataKey="salidas" fill="#003d7a" name="Salidas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por Estado</CardTitle>
              <CardDescription>Estado actual de los trámites</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataEstados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataEstados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad por Paso Fronterizo</CardTitle>
              <CardDescription>Trámites procesados en el período</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataPasos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="paso" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Trámites</CardTitle>
              <CardDescription>Evolución mensual</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataIngresosSalidas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#0891b2" strokeWidth={2} name="Ingresos" />
                  <Line type="monotone" dataKey="salidas" stroke="#003d7a" strokeWidth={2} name="Salidas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Observaciones y Rechazos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Motivo</th>
                    <th className="text-right py-3 px-4">Cantidad</th>
                    <th className="text-right py-3 px-4">Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Documentación incompleta</td>
                    <td className="text-right py-3 px-4">89</td>
                    <td className="text-right py-3 px-4">42%</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Documentos vencidos</td>
                    <td className="text-right py-3 px-4">56</td>
                    <td className="text-right py-3 px-4">26%</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Declaración SAG incorrecta</td>
                    <td className="text-right py-3 px-4">34</td>
                    <td className="text-right py-3 px-4">16%</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Falta autorización notarial</td>
                    <td className="text-right py-3 px-4">21</td>
                    <td className="text-right py-3 px-4">10%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Otros</td>
                    <td className="text-right py-3 px-4">12</td>
                    <td className="text-right py-3 px-4">6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
