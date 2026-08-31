import React, { useState } from 'react';
import { NavTab, ProductListingDraft, BatikMotif } from '../types';
import { CANTING_WORKSHOP_IMG } from '../data/mockData';
import { 
  Check, 
  Upload, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Image as ImageIcon,
  Loader2,
  PackageCheck
} from 'lucide-react';
import { IMG } from '../assets/images';

interface OnboardingViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onAddProductToCatalog: (newMotif: BatikMotif) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onNavigateTab,
  onAddProductToCatalog,
}) => {
  const [productName, setProductName] = useState('Parang Rusak Barong');
  const [price, setPrice] = useState('2,500,000');
  const [description, setDescription] = useState(
    'A majestic royal Parang motif crafted with premium natural Sogan wax resist dyes. Hand-drawn on Mori Primissima silk, embodying endurance and noble leadership.'
  );
  const [technique, setTechnique] = useState<'Tulis' | 'Cap'>('Tulis');
  const [region, setRegion] = useState('Central Java');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [generatingAi, setGeneratingAi] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAiDescription = async () => {
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motifName: productName,
          technique,
          region,
          keywords: 'Master artisan level, premium silk fabric',
        }),
      });

      const data = await res.json();
      if (data.result) {
        try {
          const parsed = JSON.parse(data.result);
          if (parsed.heritageDescription) {
            setDescription(parsed.heritageDescription);
          } else {
            setDescription(data.result);
          }
          if (parsed.suggestedPrice) {
            setPrice(parsed.suggestedPrice.replace(/[^0-9,.]/g, ''));
          }
        } catch {
          setDescription(data.result);
        }
      }
    } catch (err) {
      console.error('Failed to generate AI description');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleCompleteSetup = () => {
    if (!productName.trim()) return;

    const newMotif: BatikMotif = {
      id: `custom-${Date.now()}`,
      name: productName.trim(),
      region,
      technique,
      motifType: 'Geometris',
      description: description || 'Masterpiece created by certified master artisan.',
      philosophy: 'Continuous endurance, noble strength, and spiritual harmony.',
      originHistory: 'Hand-crafted during 2024 Artisan Workshop Residency.',
      imageUrl: imagePreview || IMG['parang-rusak'],
      priceEstimate: `IDR ${price}`,
      tags: ['New Masterpiece', technique, region],
    };

    onAddProductToCatalog(newMotif);
    setCompleteSuccess(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#fbf9f5] pt-24 pb-20 px-4 flex flex-col items-center justify-center">
      <main className="w-full max-w-4xl bg-white border border-[#767683]/15 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row relative">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#000666]/5 rounded-bl-full pointer-events-none z-0" />

        {/* Left Side: Stepper & Information */}
        <aside className="w-full md:w-1/3 bg-[#f5f3ef] border-b md:border-b-0 md:border-r border-[#767683]/15 p-8 relative z-10 flex flex-col justify-between">
          <div>
            <div className="mb-10">
              <h1 className="font-serif-garamond text-2xl font-bold text-[#000666] tracking-tight">
                Batik Nusantara
              </h1>
              <p className="text-sm text-[#454652] mt-0.5 font-medium">Artisan Onboarding</p>
            </div>

            {/* Stepper */}
            <nav aria-label="Progress">
              <ol className="space-y-8">
                {/* Step 1 Completed */}
                <li className="relative flex items-start group">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-[#000666] text-white flex items-center justify-center font-bold text-xs">
                      <Check className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="ml-4 flex flex-col">
                    <span className="text-[11px] font-bold text-[#000666] uppercase tracking-widest">Step 1</span>
                    <span className="text-sm font-semibold text-[#1b1c1a]">Profile Setup</span>
                  </div>
                </li>

                {/* Step 2 Completed */}
                <li className="relative flex items-start group">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-[#000666] text-white flex items-center justify-center font-bold text-xs">
                      <Check className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="ml-4 flex flex-col">
                    <span className="text-[11px] font-bold text-[#000666] uppercase tracking-widest">Step 2</span>
                    <span className="text-sm font-semibold text-[#1b1c1a]">Certification</span>
                  </div>
                </li>

                {/* Step 3 Active */}
                <li className="relative flex items-start group">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full border-2 border-[#000666] bg-white flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#000666]" />
                    </span>
                  </div>
                  <div className="ml-4 flex flex-col">
                    <span className="text-[11px] font-bold text-[#000666] uppercase tracking-widest">Step 3</span>
                    <span className="text-sm font-bold text-[#000666]">Shop Setup</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Grayscale Canting Workshop Photo */}
          <div className="mt-12 hidden md:block">
            <div
              className="w-full h-44 bg-cover bg-center rounded-lg shadow-sm border border-[#767683]/10 grayscale hover:grayscale-0 transition-all duration-500"
              style={{ backgroundImage: `url('${CANTING_WORKSHOP_IMG}')` }}
            />
          </div>
        </aside>

        {/* Right Side: Product Listing Preview Setup Form */}
        <div className="w-full md:w-2/3 p-8 md:p-12 relative z-10 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h2 className="font-serif-garamond text-3xl font-bold text-[#000666] mb-2">
                Prepare Your Digital Workshop
              </h2>
              <p className="text-sm text-[#454652] leading-relaxed">
                Preview how your crafts will be presented to collectors and institutional buyers. Set up your first product offering below.
              </p>
            </div>

            {/* Container for Product Listing Preview Form */}
            <div className="bg-[#fbf9f5] border border-[#767683]/15 rounded-lg p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#cba72f]/20 pb-3">
                <h3 className="font-serif-garamond text-xl font-bold text-[#1b1c1a]">
                  Product Listing Preview
                </h3>
                <span className="text-xs font-bold bg-[#ffe088] text-[#4e3d00] px-3 py-1 rounded-full uppercase tracking-wider">
                  Draft
                </span>
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-bold text-[#a14000] uppercase tracking-widest mb-2">
                  Product Imagery
                </label>
                <div className="relative border-2 border-dashed border-[#c6c5d4] rounded-md bg-[#f5f3ef] hover:bg-[#eae8e4] transition-colors p-6 text-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="h-32 object-cover rounded border border-[#767683]/20 mb-2"
                      />
                      <span className="text-xs text-[#000666] font-semibold underline">
                        Click to change image
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-10 h-10 mx-auto text-[#767683] group-hover:text-[#000666] transition-colors" />
                      <div className="text-xs text-[#454652]">
                        <span className="font-semibold text-[#000666]">Upload a file</span> or drag and drop
                      </div>
                      <p className="text-[11px] text-[#767683]">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Inputs Form */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-[#a14000] uppercase tracking-widest mb-1">
                    Motif / Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Parang Rusak Barong"
                    className="w-full bg-transparent border-0 border-b border-[#767683] py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666] font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#a14000] uppercase tracking-widest mb-1">
                    Price (IDR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-0 top-2 text-xs text-[#767683] font-semibold">Rp</span>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-6 bg-transparent border-0 border-b border-[#767683] py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666] font-sans"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-[#a14000] uppercase tracking-widest mb-1">
                    Craft Technique
                  </label>
                  <select
                    value={technique}
                    onChange={(e) => setTechnique(e.target.value as any)}
                    className="w-full bg-transparent border-0 border-b border-[#767683] py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
                  >
                    <option value="Tulis">Tulis (Hand drawn wax)</option>
                    <option value="Cap">Cap (Copper stamp)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-[#a14000] uppercase tracking-widest mb-1">
                    Region of Origin
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#767683] py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
                  />
                </div>

                <div className="sm:col-span-6">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#a14000] uppercase tracking-widest">
                      Heritage Description
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAiDescription}
                      disabled={generatingAi}
                      className="text-[11px] font-bold text-[#000666] hover:text-[#a14000] flex items-center gap-1 transition-colors"
                    >
                      {generatingAi ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          AI Writing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#a14000]" />
                          Auto-generate with AI
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the philosophical meaning, technique (Tulis/Cap), and origin of this piece..."
                    className="w-full bg-transparent border-0 border-b border-[#767683] py-2 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#000666] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Success Overlay Modal or Message */}
          {completeSuccess && (
            <div className="mt-6 p-4 bg-[#e0e0ff] border border-[#000666]/30 rounded-lg text-sm text-[#000666] flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#a14000]" />
                <span>Product listing published to the Association Heritage Catalog!</span>
              </div>
              <button
                onClick={() => onNavigateTab('catalog')}
                className="px-3 py-1 bg-[#000666] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#1a237e]"
              >
                View Catalog
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-[#767683]/15">
            <button
              type="button"
              onClick={() => onNavigateTab('portal')}
              className="text-xs font-bold text-[#454652] hover:text-[#000666] uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleCompleteSetup}
              className="bg-[#000666] text-white hover:bg-[#1a237e] px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
            >
              Complete Setup
              <CheckCircle className="w-4 h-4 text-[#ffe088]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
