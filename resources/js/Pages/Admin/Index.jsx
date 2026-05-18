import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import {
    Users, Activity, Utensils, Dumbbell, ShieldCheck, TrendingUp,
    Search, Trash2, Crown, UserCheck, AlertTriangle, ChevronUp, ChevronDown, X, MessageSquareWarning, CheckCircle2
} from 'lucide-react';

export default function AdminIndex({ stats, usuarios, errorReports }) {
    const [activeTab, setActiveTab] = useState('usuarios');
    const [search, setSearch] = useState('');
    const [filterRol, setFilterRol] = useState('todos');
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [deleteModal, setDeleteModal] = useState(null); // { id, nombre }
    const [deleteErrorModal, setDeleteErrorModal] = useState(null); // { id, subject }
    const [flash, setFlash] = useState(null);

    // Filtrar y ordenar usuarios
    const usuariosFiltrados = usuarios
        .filter(u => {
            const matchSearch = u.nombre_usuario.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase());
            const matchRol = filterRol === 'todos' || u.rol === filterRol;
            return matchSearch && matchRol;
        })
        .sort((a, b) => {
            let va = a[sortField] ?? '';
            let vb = b[sortField] ?? '';
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const handleRolChange = (id, nuevoRol) => {
        router.patch(route('admin.users.update', id), { rol: nuevoRol }, {
            preserveScroll: true,
            onSuccess: () => setFlash({ type: 'success', msg: 'Rol actualizado correctamente.' }),
            onError: () => setFlash({ type: 'error', msg: 'Error al actualizar el rol.' }),
        });
    };

    const handleDelete = () => {
        if (!deleteModal) return;
        router.delete(route('admin.users.destroy', deleteModal.id), {
            preserveScroll: true,
            onSuccess: () => {
                setFlash({ type: 'success', msg: `Usuario '${deleteModal.nombre}' eliminado.` });
                setDeleteModal(null);
            },
            onError: () => {
                setFlash({ type: 'error', msg: 'Error al eliminar el usuario.' });
                setDeleteModal(null);
            },
        });
    };

    const handleUpdateErrorStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
        router.patch(route('admin.error-reports.update', id), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => setFlash({ type: 'success', msg: 'Estado del reporte actualizado.' }),
            onError: () => setFlash({ type: 'error', msg: 'Error al actualizar el reporte.' }),
        });
    };

    const handleDeleteError = () => {
        if (!deleteErrorModal) return;
        router.delete(route('admin.error-reports.destroy', deleteErrorModal.id), {
            preserveScroll: true,
            onSuccess: () => {
                setFlash({ type: 'success', msg: 'Reporte de error eliminado.' });
                setDeleteErrorModal(null);
            },
            onError: () => {
                setFlash({ type: 'error', msg: 'Error al eliminar el reporte.' });
                setDeleteErrorModal(null);
            },
        });
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-30" />;
        return sortDir === 'asc'
            ? <ChevronUp className="h-3 w-3 text-indigo-500" />
            : <ChevronDown className="h-3 w-3 text-indigo-500" />;
    };

    const statCards = [
        {
            label: 'Usuarios totales',
            value: stats.totalUsuarios,
            icon: <Users className="h-6 w-6" />,
            color: 'from-indigo-500 to-indigo-600',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            sub: `+${stats.nuevosEstaSemana} esta semana`,
            subIcon: <TrendingUp className="h-3 w-3" />,
        },
        {
            label: 'Entrenamientos',
            value: stats.totalEntrenamientos,
            icon: <Dumbbell className="h-6 w-6" />,
            color: 'from-teal-500 to-teal-600',
            bg: 'bg-teal-50',
            text: 'text-teal-600',
            sub: 'registros en total',
        },
        {
            label: 'Registros de comida',
            value: stats.totalRegistrosComida,
            icon: <Utensils className="h-6 w-6" />,
            color: 'from-orange-500 to-orange-600',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            sub: 'entradas en diario',
        },
        {
            label: 'Rutinas creadas',
            value: stats.totalRutinas,
            icon: <Activity className="h-6 w-6" />,
            color: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            sub: 'rutinas en total',
        },
        {
            label: 'Onboarding completado',
            value: stats.usuariosOnboarding,
            icon: <UserCheck className="h-6 w-6" />,
            color: 'from-green-500 to-green-600',
            bg: 'bg-green-50',
            text: 'text-green-600',
            sub: `de ${stats.totalUsuarios} usuarios`,
        },
        {
            label: 'Administradores',
            value: stats.totalAdmins,
            icon: <ShieldCheck className="h-6 w-6" />,
            color: 'from-rose-500 to-rose-600',
            bg: 'bg-rose-50',
            text: 'text-rose-600',
            sub: `${stats.totalEstandar} estándar`,
        },
    ];

    const maxEntrenamientos = Math.max(...stats.topUsuarios.map(u => u.entrenamientos), 1);
    const maxMes = Math.max(...stats.mesesRecientes.map(m => m.cantidad), 1);

    return (
        <AuthenticatedLayout>
            <Head title="Panel de Administración – Total Fit Hub" />

            <div className="min-h-screen bg-slate-50 pb-20">

                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center space-x-4 mb-3">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-400/30">
                                <ShieldCheck className="h-6 w-6 text-indigo-300" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-3xl font-black">Panel de Administración</h1>
                                    <span className="px-2 py-0.5 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-black rounded-full uppercase tracking-wider">Admin</span>
                                </div>
                                <p className="text-slate-400 mt-1">Estadísticas globales y gestión de cuentas de usuario</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt-4">

                    {/* Flash message */}
                    {flash && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between ${flash.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                            <span className="font-medium">{flash.msg}</span>
                            <button onClick={() => setFlash(null)}><X className="h-4 w-4" /></button>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                        {statCards.map((card, i) => (
                            <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className={`w-10 h-10 ${card.bg} ${card.text} rounded-xl flex items-center justify-center mb-4`}>
                                    {card.icon}
                                </div>
                                <p className="text-3xl font-black text-slate-900 mb-1">{card.value.toLocaleString()}</p>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">{card.label}</p>
                                {card.sub && (
                                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                                        {card.subIcon && card.subIcon}
                                        <span>{card.sub}</span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Charts row */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">

                        {/* Nuevos usuarios por mes */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-black text-slate-900 mb-6">Nuevos usuarios (últimos 6 meses)</h2>
                            <div className="flex items-end space-x-3 h-40">
                                {stats.mesesRecientes.map((m, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center space-y-2">
                                        <span className="text-xs font-black text-slate-500">{m.cantidad}</span>
                                        <div
                                            className="w-full bg-indigo-500 rounded-t-xl transition-all duration-700"
                                            style={{ height: `${Math.max((m.cantidad / maxMes) * 100, 4)}%` }}
                                        ></div>
                                        <span className="text-xs text-slate-400 font-medium text-center leading-tight">{m.mes}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top usuarios activos */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-black text-slate-900 mb-6">Top 5 usuarios más activos</h2>
                            <div className="space-y-4">
                                {stats.topUsuarios.length === 0 ? (
                                    <p className="text-slate-400 text-sm">Sin datos de entrenamientos aún.</p>
                                ) : stats.topUsuarios.map((u, i) => (
                                    <div key={u.id} className="flex items-center space-x-4">
                                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {i === 0 ? '🏆' : i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-900 truncate">{u.nombre_usuario}</p>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                                                <div
                                                    className="bg-teal-500 h-1.5 rounded-full transition-all duration-700"
                                                    style={{ width: `${(u.entrenamientos / maxEntrenamientos) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-teal-600 flex-shrink-0">{u.entrenamientos}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Distribución de roles */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
                        <h2 className="text-lg font-black text-slate-900 mb-6">Distribución de roles</h2>
                        <div className="flex items-center space-x-6">
                            <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
                                    style={{ width: `${stats.totalUsuarios > 0 ? (stats.totalEstandar / stats.totalUsuarios) * 100 : 0}%` }}
                                >
                                    <span className="text-white text-xs font-black">{stats.totalEstandar} estándar</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
                                <span className="text-sm font-black text-slate-600">{stats.totalAdmins} admin{stats.totalAdmins !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-6 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('usuarios')}
                            className={`pb-3 px-2 text-sm font-black flex items-center gap-2 transition-colors border-b-2 ${
                                activeTab === 'usuarios' 
                                    ? 'border-indigo-500 text-indigo-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <Users className="h-4 w-4" />
                            Gestión de Usuarios
                        </button>
                        <button
                            onClick={() => setActiveTab('errores')}
                            className={`pb-3 px-2 text-sm font-black flex items-center gap-2 transition-colors border-b-2 ${
                                activeTab === 'errores' 
                                    ? 'border-indigo-500 text-indigo-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <MessageSquareWarning className="h-4 w-4" />
                            Buzón de Errores
                            {errorReports.filter(r => r.status === 'pending').length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                                    {errorReports.filter(r => r.status === 'pending').length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Tabla de usuarios */}
                    {activeTab === 'usuarios' && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-lg font-black text-slate-900">Gestión de usuarios</h2>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Buscador */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o email..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
                                        />
                                    </div>
                                    {/* Filtro rol */}
                                    <select
                                        value={filterRol}
                                        onChange={e => setFilterRol(e.target.value)}
                                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                                    >
                                        <option value="todos">Todos los roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="estandar">Estándar</option>
                                    </select>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mt-2">{usuariosFiltrados.length} usuarios encontrados</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        {[
                                            { label: 'Usuario', field: 'nombre_usuario' },
                                            { label: 'Email', field: 'email' },
                                            { label: 'Rol', field: 'rol' },
                                            { label: 'Registro', field: 'created_at' },
                                            { label: 'Onboarding', field: 'onboarding_completed' },
                                            { label: 'Acciones', field: null },
                                        ].map(col => (
                                            <th
                                                key={col.label}
                                                className={`px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider ${col.field ? 'cursor-pointer hover:text-slate-800 select-none' : ''}`}
                                                onClick={() => col.field && toggleSort(col.field)}
                                            >
                                                <span className="flex items-center space-x-1">
                                                    <span>{col.label}</span>
                                                    {col.field && <SortIcon field={col.field} />}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {usuariosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                                                No se encontraron usuarios con los filtros aplicados.
                                            </td>
                                        </tr>
                                    ) : usuariosFiltrados.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            {/* Usuario */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-teal-400 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                                        {u.nombre_usuario.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-sm">{u.nombre_usuario}</span>
                                                </div>
                                            </td>
                                            {/* Email */}
                                            <td className="px-6 py-4 text-slate-500 text-sm">{u.email}</td>
                                            {/* Rol */}
                                            <td className="px-6 py-4">
                                                <select
                                                    value={u.rol}
                                                    onChange={e => handleRolChange(u.id, e.target.value)}
                                                    className={`text-xs font-black px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer transition-colors ${
                                                        u.rol === 'admin'
                                                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}
                                                >
                                                    <option value="estandar">Estándar</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            {/* Fecha registro */}
                                            <td className="px-6 py-4 text-slate-400 text-sm font-medium">{u.created_at}</td>
                                            {/* Onboarding */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                                                    u.onboarding_completed
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    <span>{u.onboarding_completed ? '✓ Completado' : '⏳ Pendiente'}</span>
                                                </span>
                                            </td>
                                            {/* Acciones */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setDeleteModal({ id: u.id, nombre: u.nombre_usuario })}
                                                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span>Eliminar</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    )}

                    {/* Tabla de Errores */}
                    {activeTab === 'errores' && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-black text-slate-900">Buzón de Errores</h2>
                                <p className="text-sm text-slate-400 mt-1">Reportes enviados por los usuarios</p>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Usuario</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Asunto</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider w-1/3">Descripción</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {errorReports.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                                                    No hay reportes de error por el momento. ¡Todo funciona perfecto! 🎉
                                                </td>
                                            </tr>
                                        ) : errorReports.map(report => (
                                            <tr key={report.id} className={`hover:bg-slate-50 transition-colors ${report.status === 'resolved' ? 'opacity-70' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <button 
                                                        onClick={() => handleUpdateErrorStatus(report.id, report.status)}
                                                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-black transition-colors ${
                                                            report.status === 'pending'
                                                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                        }`}
                                                    >
                                                        {report.status === 'pending' ? (
                                                            <><span>⏳ Pendiente</span></>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                <span>Resuelto</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-sm font-medium">{report.created_at}</td>
                                                <td className="px-6 py-4 text-slate-900 font-bold text-sm">{report.user}</td>
                                                <td className="px-6 py-4 text-slate-800 text-sm font-bold">{report.subject}</td>
                                                <td className="px-6 py-4 text-slate-500 text-sm whitespace-pre-wrap">{report.description}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setDeleteErrorModal({ id: report.id, subject: report.subject })}
                                                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span>Eliminar</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-6">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 text-center mb-2">¿Eliminar usuario?</h3>
                        <p className="text-slate-500 text-center mb-8">
                            Vas a eliminar permanentemente la cuenta de <strong className="text-slate-900">"{deleteModal.nombre}"</strong> y todos sus datos (entrenamientos, rutinas, registros de comida y peso). Esta acción no se puede deshacer.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación de error */}
            {deleteErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mx-auto mb-6">
                            <Trash2 className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 text-center mb-2">¿Eliminar reporte?</h3>
                        <p className="text-slate-500 text-center mb-8">
                            Vas a eliminar el reporte <strong className="text-slate-900">"{deleteErrorModal.subject}"</strong>. Esta acción no se puede deshacer.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setDeleteErrorModal(null)}
                                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteError}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
