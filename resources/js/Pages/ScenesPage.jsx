import React from 'react';
import { usePage } from '@inertiajs/react';
import SceneTable from '../components/SceneTable';
import { useTranslation } from "react-i18next";

export default function ScenesPage() {
    const { t } = useTranslation();
    const { scenes } = usePage().props;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t("landing.card6_title")}</h1>
            <SceneTable scenes={scenes} />
        </div>
    );
}