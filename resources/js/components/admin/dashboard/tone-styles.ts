import { type DashboardTone } from '@/styles/layout-system';

export type DashboardToneStyle = {
    icon: string;
    accent: string;
    chip: string;
    indicator: string;
    arrow: string;
    subtle: string;
    borderColor: string;
    soft: string;
};

export const dashboardToneStyles: Record<DashboardTone, DashboardToneStyle> = {
    primary: {
        icon: 'bg-[#151f54]/10 text-[#151f54]',
        accent: 'text-[#151f54]',
        chip: 'bg-[#151f54]/12 text-[#151f54]',
        indicator: 'bg-[#151f54]/10',
        arrow: 'text-[#151f54]',
        subtle: 'text-[#3d4a87]',
        borderColor: 'border-[#cdd6ff]',
        soft: 'bg-[#151f54]/6',
    },
    secondary: {
        icon: 'bg-[#ffb401]/15 text-[#8a6300]',
        accent: 'text-[#8a6300]',
        chip: 'bg-[#ffb401]/15 text-[#8a6300]',
        indicator: 'bg-[#ffb401]/20',
        arrow: 'text-[#8a6300]',
        subtle: 'text-[#a17000]',
        borderColor: 'border-[#f8e7b5]',
        soft: 'bg-[#ffb401]/10',
    },
    accent: {
        icon: 'bg-[#fff809]/18 text-[#7a6b00]',
        accent: 'text-[#7a6b00]',
        chip: 'bg-[#fff809]/18 text-[#7a6b00]',
        indicator: 'bg-[#fff809]/22',
        arrow: 'text-[#7a6b00]',
        subtle: 'text-[#8f7c00]',
        borderColor: 'border-[#f2eca4]',
        soft: 'bg-[#fff809]/14',
    },
};

export function getDashboardToneStyle(tone: DashboardTone) {
    return dashboardToneStyles[tone] ?? dashboardToneStyles.primary;
}
