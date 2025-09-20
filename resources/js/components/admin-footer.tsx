import { useMemo } from 'react';
import { useTranslator } from '@/hooks/use-translator';

export default function AdminFooter() {
    const { t } = useTranslator('manage');
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <span className="text-xs tracking-wide text-neutral-600 dark:text-neutral-300">
            © {currentYear} {t('layout.footer', 'CSIE Admin')}
        </span>
    );
}
