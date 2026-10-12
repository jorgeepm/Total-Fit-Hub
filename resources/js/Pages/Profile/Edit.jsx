import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import TdeeCalculator from './Partials/TdeeCalculator';
import ResistanceBandsManager from './Partials/ResistanceBandsManager';

export default function Edit({ auth, mustVerifyEmail, status, resistanceBands }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Perfil
                </h2>
            }
        >
            <Head title="Perfil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-slate-800">
                        <UpdateProfileInformationForm
                            key={auth?.user?.updated_at}
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* ─── Calculadora TDEE ─── */}
                    <div className="sm:px-0">
                        <TdeeCalculator />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-slate-800">
                        <ResistanceBandsManager bands={resistanceBands} />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-slate-800">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-slate-800">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
