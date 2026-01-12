'use client';

interface LoadMoreProps {
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

const LoadMore = ({ loading, hasMore, onLoadMore }: LoadMoreProps) => {
    if (!hasMore) {
        return (
            <div className="w-full text-center py-8">
                <p className="text-white/40 text-sm">You have reached the end.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-8">
            <button
                onClick={onLoadMore}
                disabled={loading}
                className={`
                            px-8 py-3 rounded-full font-medium text-white transition-all duration-300
                            border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]
                            ${loading
                                            ? "bg-white/5 cursor-wait opacity-70"
                                            : "bg-[#050505]/80 hover:bg-[#1a1a1a] hover:border-white/20 active:scale-95"
                                        }
                        `}>
                {loading ? (
                    <span className="flex items-center gap-2">
                        {/* Simple CSS Spinner */}
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Loading...
                    </span>
                ) : (
                    "Load More"
                )}
            </button>
        </div>
    );
};

export default LoadMore;
