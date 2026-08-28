export default function TableBuilderSkeleton() {
    return (
        <div className="flex h-screen flex-col gap-4 overflow-hidden bg-transparent p-4">
            {/* هدر */}
            <div className="flex shrink-0 items-center justify-between rounded-lg border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/60 px-5 py-3 shadow-lg shadow-black/40">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gradient-to-br from-slate-700 to-slate-800" />
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-28 animate-pulse rounded bg-gradient-to-r from-slate-700 to-slate-800" />
                        <div className="h-3 w-40 animate-pulse rounded bg-gradient-to-r from-slate-800 to-slate-800/60" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-24 animate-pulse rounded-md bg-gradient-to-b from-slate-700 to-slate-800" />
                    <div className="h-8 w-28 animate-pulse rounded-lg bg-gradient-to-b from-slate-700 to-slate-800" />
                </div>
            </div>

            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* سایدبار */}
                <aside className="flex h-full w-72 shrink-0 flex-col gap-5 overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-lg shadow-black/40">
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-20 animate-pulse rounded bg-gradient-to-r from-slate-800 to-slate-800/60" />
                        <div className="h-9 w-full animate-pulse rounded-lg bg-gradient-to-b from-slate-800 to-slate-800/60" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-9 w-full animate-pulse rounded-md bg-gradient-to-b from-slate-800/80 to-slate-900/80" />
                        <div className="h-9 w-full animate-pulse rounded-md bg-gradient-to-b from-slate-800/80 to-slate-900/80" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-16 animate-pulse rounded bg-gradient-to-r from-slate-800 to-slate-800/60" />
                        <div className="h-11 w-full animate-pulse rounded-lg bg-gradient-to-b from-slate-700 to-slate-800" />
                        <div className="h-11 w-full animate-pulse rounded-lg bg-gradient-to-b from-slate-700 to-slate-800" />
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col gap-2">
                        <div className="h-3 w-24 animate-pulse rounded bg-gradient-to-r from-slate-800 to-slate-800/60" />
                        <div className="flex flex-col gap-1.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-9 w-full animate-pulse rounded-lg bg-gradient-to-r from-slate-800 to-slate-800/50"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                        <div className="h-24 w-full animate-pulse rounded-lg border border-slate-800 bg-gradient-to-b from-slate-800/60 to-slate-800/30" />
                        <div className="h-11 w-full animate-pulse rounded-lg bg-gradient-to-b from-slate-700 to-slate-800" />
                    </div>
                </aside>

                {/* محتوای اصلی */}
                <main className="flex-1 overflow-hidden p-6">
                    <div className="flex h-full flex-col gap-3 rounded-lg border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-inner shadow-black/30">
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={`h-${i}`}
                                    className="h-9 animate-pulse rounded-md bg-gradient-to-b from-slate-700 to-slate-800"
                                />
                            ))}
                        </div>
                        {Array.from({ length: 5 }).map((_, r) => (
                            <div key={r} className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 5 }).map((_, c) => (
                                    <div
                                        key={c}
                                        className="h-10 animate-pulse rounded-md bg-gradient-to-b from-slate-800/70 to-slate-800/40"
                                        style={{ animationDelay: `${(r * 5 + c) * 30}ms` }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}