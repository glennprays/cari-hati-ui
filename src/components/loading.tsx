export function LoadingFullPage({
    show,
    text = "Loading...",
}: {
    show: boolean;
    text?: string;
}) {
    if (show) {
        return (
            <div className="flex flex-col gap-4 bg-primary w-full h-screen z-[1000] justify-center items-center">
                <span className="flex gap-3">
                    <span
                        className="animate-ping h-[10px] w-[10px] rounded-full bg-sky-400 opacity-75"
                        style={{
                            animationDelay: ".1s",
                        }}
                    />
                    <span
                        className="animate-ping h-[10px] w-[10px] rounded-full bg-pink-1 opacity-75"
                        style={{
                            animationDelay: ".2s",
                        }}
                    />
                    <span
                        className="animate-ping h-[10px] w-[10px] rounded-full bg-fuchsia-400 opacity-75"
                        style={{
                            animationDelay: ".3s",
                        }}
                    />
                </span>
                {text}
            </div>
        );
    } else {
        return <></>;
    }
}
