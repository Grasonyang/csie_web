export default function AdminFooter() {
    return (
        <span className="text-xs tracking-wide text-neutral-600 dark:text-neutral-300">
            © {new Date().getFullYear()} CSIE Admin
        </span>
    );
}
