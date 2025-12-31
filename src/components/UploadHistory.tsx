import React from 'react';
import { CheckCircle2, XCircle, Loader2, FileText, Clock, Package, FileBox } from 'lucide-react';
import { HistoryItem, UploadType } from '@/types';
import { cn } from '@/lib/utils';

interface UploadHistoryProps {
    history: HistoryItem[];
}

const platformNames: Record<string, string> = {
    'zepto': 'Zepto',
    'swiggy-instamart': 'Swiggy Instamart',
    'bigbasket': 'BigBasket',
    'flipkart-minutes': 'Flipkart Minutes',
    'blinkit': 'Blinkit',
};

const TypeBadge: React.FC<{ type: UploadType }> = ({ type }) => {
    if (type === 'po') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Package className="w-3 h-3" />
                PO
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <FileBox className="w-3 h-3" />
            GRN
        </span>
    );
};

const StatusBadge: React.FC<{ status: HistoryItem['status']; rowCount?: number }> = ({ status, rowCount }) => {
    if (status === 'processing') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing
            </span>
        );
    }

    if (status === 'success') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                Success {rowCount !== undefined && `• ${rowCount} rows`}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            Failed
        </span>
    );
};

const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const UploadHistory: React.FC<UploadHistoryProps> = ({ history }) => {
    return (
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Upload History</h3>
                <span className="text-sm text-muted-foreground">({history.length})</span>
            </div>

            {history.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">No uploads yet. Upload a file to see history here.</p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="divide-y divide-border">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "flex items-center justify-between p-4 transition-colors",
                                    "hover:bg-muted/50"
                                )}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
                                                {item.fileName}
                                            </p>
                                            <TypeBadge type={item.uploadType || 'po'} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {platformNames[item.platform] || item.platform} • {formatDate(item.uploadedAt)} at {formatTime(item.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge status={item.status} rowCount={item.rowCount} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default UploadHistory;
