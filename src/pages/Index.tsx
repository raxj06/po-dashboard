import React, { useState, useEffect } from 'react';
import { Send, Loader2, Package, FileBox, ArrowRight } from 'lucide-react';
import FileUploadZone from '@/components/FileUploadZone';
import CompanySelector from '@/components/CompanySelector';
import UploadHistory from '@/components/UploadHistory';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HistoryItem, WebhookResponse, UploadType } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

const ACCEPTED_FILE_TYPES = ['.csv', '.xlsx', '.xls', '.pdf', '.jpg', '.jpeg'];
const MAX_FILE_SIZE_MB = 10;
const PO_WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;
const GRN_WEBHOOK_URL = import.meta.env.VITE_GRN_WEBHOOK_URL;

const Index = () => {
  const [activeTab, setActiveTab] = useState<UploadType>('po');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { toast } = useToast();

  // Fetch history from Supabase on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('po_history')
          .select('*')
          .order('uploaded_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching history:', error);
          return;
        }

        if (data) {
          const mappedData: HistoryItem[] = data.map((item: any) => ({
            id: item.id,
            fileName: item.file_name,
            platform: item.platform,
            uploadedAt: item.uploaded_at,
            status: item.status,
            uploadType: item.upload_type,
            rowCount: item.row_count,
            errorMessage: item.error_message,
          }));
          setHistory(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();

    // Periodic cleanup: Mark stuck "processing" entries as "failed" after 2 minutes
    const cleanupInterval = setInterval(async () => {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      // Update stuck entries in Supabase
      await supabase
        .from('po_history')
        .update({ status: 'failed' })
        .eq('status', 'processing')
        .lt('uploaded_at', twoMinutesAgo);

      // Refresh history to get updated statuses
      fetchHistory();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  const canSubmit = selectedFile && selectedCompany && !isSubmitting;

  const handleSubmit = async () => {
    if (!selectedFile || !selectedCompany) return;

    setIsSubmitting(true);

    // Insert history entry to Supabase with processing status
    let historyId: string | null = null;
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from('po_history')
        .insert({
          file_name: selectedFile.name,
          platform: selectedCompany,
          upload_type: activeTab,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting history:', insertError);
      } else if (insertedData) {
        historyId = insertedData.id;
        // Add to local state immediately
        const newHistoryItem: HistoryItem = {
          id: insertedData.id,
          fileName: selectedFile.name,
          platform: selectedCompany,
          uploadedAt: insertedData.uploaded_at,
          status: 'processing',
          uploadType: activeTab,
        };
        setHistory(prev => [newHistoryItem, ...prev]);
      }
    } catch (error) {
      console.error('Failed to insert history:', error);
    }

    try {
      // Get file extension/type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const fileType = selectedFile.type || `application/${fileExtension}`;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('platform', selectedCompany);
      formData.append('fileType', fileType);
      formData.append('fileExtension', fileExtension);
      formData.append('uploadType', activeTab);
      formData.append('uploadedAt', new Date().toISOString());
      if (historyId) {
        formData.append('historyId', historyId); // Send to n8n for updating
      }

      // Create abort controller with 90-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 seconds

      const webhookUrl = activeTab === 'po' ? PO_WEBHOOK_URL : GRN_WEBHOOK_URL;

      // Use proxy in production (HTTPS) to avoid mixed content issues
      const isProduction = window.location.protocol === 'https:';
      const fetchUrl = isProduction
        ? `/api/webhook?target=${encodeURIComponent(webhookUrl)}`
        : webhookUrl;

      const response = await fetch(fetchUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear timeout if request completes

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Parse webhook response
      let webhookData: WebhookResponse = { success: true };
      try {
        webhookData = await response.json();
      } catch (e) {
        // Response might not be JSON, that's okay
      }

      // Check if webhook reports an error (n8n workflow failed)
      if (webhookData.success === false || webhookData.error) {
        throw new Error(webhookData.message || 'Workflow processing failed');
      }

      // n8n will update Supabase directly, just update local state for immediate feedback
      setHistory(prev => prev.map(item =>
        item.id === historyId
          ? { ...item, status: 'success' as const, rowCount: webhookData.rowCount }
          : item
      ));

      toast({
        title: "Success!",
        description: webhookData.rowCount
          ? `${activeTab.toUpperCase()} processed with ${webhookData.rowCount} rows.`
          : `${activeTab.toUpperCase()} sent to ${selectedCompany.replace('-', ' ')} successfully.`,
        variant: "default",
      });

      // Reset form
      setSelectedFile(null);
      setSelectedCompany(null);
    } catch (error) {
      // Update Supabase to mark as failed (so it doesn't stay stuck as "processing")
      if (historyId) {
        try {
          await supabase
            .from('po_history')
            .update({ status: 'failed' })
            .eq('id', historyId);
        } catch (e) {
          console.error('Failed to update Supabase:', e);
        }
      }

      // Update local state to show failed
      setHistory(prev => prev.map(item =>
        item.id === historyId
          ? { ...item, status: 'failed' as const }
          : item
      ));

      // Check if it's a timeout error
      const isTimeout = error instanceof Error && error.name === 'AbortError';

      toast({
        title: isTimeout ? "Request Timed Out" : "Upload Failed",
        description: isTimeout
          ? "The request took too long (over 90 seconds). Please try again."
          : "There was an error sending your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                {activeTab === 'po' ? (
                  <Package className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <FileBox className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {activeTab === 'po' ? 'PO Upload' : 'GRN Upload'}
                </h1>
                <p className="text-sm text-muted-foreground">Quick Commerce Dashboard</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => { setActiveTab('po'); setSelectedFile(null); setSelectedCompany(null); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === 'po'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Package className="w-4 h-4" />
                PO Upload
              </button>
              <button
                onClick={() => { setActiveTab('grn'); setSelectedFile(null); setSelectedCompany(null); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === 'grn'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileBox className="w-4 h-4" />
                GRN Upload
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {activeTab === 'po' ? 'Upload Purchase Orders' : 'Upload Goods Received Notes'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {activeTab === 'po'
                ? 'Send your daily POs to quick commerce partners in seconds'
                : 'Upload GRN data for quick commerce partners'}
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
            <span className={selectedFile ? 'text-primary font-medium' : ''}>
              1. Upload File
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className={selectedCompany ? 'text-primary font-medium' : ''}>
              2. Select Company
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className={canSubmit ? 'text-primary font-medium' : ''}>
              3. Send Data
            </span>
          </div>

          {/* Upload Section */}
          <section className="space-y-3 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground">Upload Your File</h3>
            </div>
            <FileUploadZone
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              acceptedTypes={ACCEPTED_FILE_TYPES}
              maxSizeMB={MAX_FILE_SIZE_MB}
            />
          </section>

          {/* Company Selection */}
          <section className="space-y-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground">Select Company</h3>
            </div>
            <CompanySelector
              selectedCompany={selectedCompany}
              onCompanySelect={setSelectedCompany}
            />
          </section>

          {/* Submit Button */}
          <section className="pt-4 animate-fade-in" style={{ animationDelay: '250ms' }}>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Data
                </>
              )}
            </Button>

            {!canSubmit && !isSubmitting && (
              <p className="text-sm text-muted-foreground mt-3">
                {!selectedFile && !selectedCompany && 'Please upload a file and select a company'}
                {selectedFile && !selectedCompany && 'Please select a company to continue'}
                {!selectedFile && selectedCompany && 'Please upload a file to continue'}
              </p>
            )}
          </section>

          {/* Upload History */}
          <UploadHistory history={history} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            PO Upload Dashboard • Streamline your quick commerce operations
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
