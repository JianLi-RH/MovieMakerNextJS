'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <h2>不好意思，网页出错了！</h2>
                <p>{error.message}</p>
                <button onClick={() => reset()}>重试</button>
            </body>
        </html>
    )
}