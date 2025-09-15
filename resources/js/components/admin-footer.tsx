export default function AdminFooter() {
    return (
        <div className="mt-4 border-t border-sidebar-border/50 px-4 py-3 text-xs text-neutral-500">
            © {new Date().getFullYear()} CSIE Admin
        </div>
    );
}

