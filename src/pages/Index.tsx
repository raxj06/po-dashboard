import React, { useState } from 'react';
import { Send, Loader2, Package, ArrowRight } from 'lucide-react';
import FileUploadZone from '@/components/FileUploadZone';
import CompanySelector from '@/components/CompanySelector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ACCEPTED_FILE_TYPES = ['.csv', '.xlsx', '.xls', '.pdf', '.jpg', '.jpeg'];
const MAX_FILE_SIZE_MB = 10;
const WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE'; // Replace with your n8n webhook URL

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const canSubmit = selectedFile && selectedCompany && !isSubmitting;

  const handleSubmit = async () => {
    if (!selectedFile || !selectedCompany) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('company', selectedCompany);
      formData.append('uploadedAt', new Date().toISOString());

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: "Success!",
        description: `PO sent to ${selectedCompany.replace('-', ' ')} successfully.`,
        variant: "default",
      });

      // Reset form
      setSelectedFile(null);
      setSelectedCompany(null);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error sending your file. Please try again.",
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">PO Upload</h1>
              <p className="text-sm text-muted-foreground">Quick Commerce Dashboard</p>
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
              Upload Purchase Orders
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Send your daily POs to quick commerce partners in seconds
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
