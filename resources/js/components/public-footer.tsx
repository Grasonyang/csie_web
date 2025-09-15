export default function PublicFooter() {
    return (
        <footer className="border-t bg-neutral-50 py-6 text-sm text-neutral-600">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                    <div>
                        <div className="font-medium">CSIE</div>
                        <div className="opacity-70">© {new Date().getFullYear()} All rights reserved.</div>
                    </div>
                    <div className="opacity-70">Built with Laravel + Inertia + React</div>
                </div>
            </div>
        </footer>
    );
}

