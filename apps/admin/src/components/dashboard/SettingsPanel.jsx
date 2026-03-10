import React, { useState, useEffect, useCallback } from 'react';
import api from '../../config/api';

export default function SettingsPanel() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await api.get('/system/settings');
            setSettings(res.data.data || []);
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleToggle = async (key, currentValue) => {
        setSaving(key);
        try {
            const newValue = currentValue === 'true' ? 'false' : 'true';
            await api.put('/system/settings', { key, value: newValue });
            await fetchSettings();
        } catch (err) {
            alert('Failed to update setting');
        } finally {
            setSaving(null);
        }
    };

    const LABELS = {
        AI_FORECASTING_ENABLED: { label: 'AI Demand Forecasting', icon: 'insights', description: 'Predict tomorrow\'s meal demand at 9:50 PM IST using historical order patterns.', color: 'purple' },
        ACCEPT_NEW_SUBSCRIPTIONS: { label: 'Accept New Subscriptions', icon: 'card_membership', description: 'Allow new customers to subscribe.', color: 'blue' },
        COD_ENABLED: { label: 'Cash on Delivery', icon: 'payments', description: 'Enable COD payment option.', color: 'green' },
        ONE_TIME_ORDERS_ENABLED: { label: 'One-Time Orders', icon: 'shopping_cart', description: 'Allow single meal purchases.', color: 'amber' },
        AUTO_RENEW_ENABLED: { label: 'Auto-Renew Subscriptions', icon: 'autorenew', description: 'Automatically renew expiring subscriptions.', color: 'teal' },
    };

    const booleanSettings = settings.filter(s => s.type === 'BOOLEAN');
    const otherSettings = settings.filter(s => s.type !== 'BOOLEAN');

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-orange border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">System Settings</h2>
                <p className="text-sm text-slate-500">Manage feature flags and system configuration.</p>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white dark:bg-[#2d2418] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Feature Toggles</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {booleanSettings.map(setting => {
                        const meta = LABELS[setting.key] || { label: setting.key, icon: 'toggle_on', description: '', color: 'gray' };
                        const isOn = setting.value === 'true';
                        const isSaving = saving === setting.key;

                        return (
                            <div key={setting.key} className="p-5 flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl bg-${meta.color}-500/10 flex-shrink-0`}>
                                    <span className={`material-symbols-outlined text-${meta.color}-500`}>{meta.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{meta.label}</h4>
                                    {meta.description && <p className="text-xs text-slate-400 mt-0.5">{meta.description}</p>}
                                </div>
                                <button
                                    onClick={() => handleToggle(setting.key, setting.value)}
                                    disabled={isSaving}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${isOn ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${isOn ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Other Settings (Read-only display) */}
            {otherSettings.length > 0 && (
                <div className="bg-white dark:bg-[#2d2418] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Configuration</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {otherSettings.map(setting => (
                            <div key={setting.key} className="p-5 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{setting.key.replace(/_/g, ' ')}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">{setting.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
