import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

// Import logos
import zeptoLogo from '@/logos/zepto.png';
import swiggyLogo from '@/logos/swiggy.png';
import bigbasketLogo from '@/logos/bigbasket.png';
import flipkartLogo from '@/logos/flipkart.png';

interface Company {
  id: string;
  name: string;
  color: string;
  lightColor: string;
  icon?: string;
  logo?: string;
}

const companies: Company[] = [
  { id: 'zepto', name: 'Zepto', color: 'hsl(280 70% 50%)', lightColor: 'hsl(280 60% 95%)', logo: zeptoLogo },
  { id: 'swiggy-instamart', name: 'Swiggy Instamart', color: 'hsl(25 95% 53%)', lightColor: 'hsl(25 90% 95%)', logo: swiggyLogo },
  { id: 'bigbasket', name: 'BigBasket', color: 'hsl(145 70% 40%)', lightColor: 'hsl(145 60% 95%)', logo: bigbasketLogo },
  { id: 'flipkart-minutes', name: 'Flipkart Minutes', color: 'hsl(45 95% 50%)', lightColor: 'hsl(45 90% 95%)', logo: flipkartLogo },
  { id: 'blinkit', name: 'Blinkit', color: 'hsl(50 95% 50%)', lightColor: 'hsl(50 90% 95%)', icon: '🚀' },
];

interface CompanySelectorProps {
  selectedCompany: string | null;
  onCompanySelect: (companyId: string) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({
  selectedCompany,
  onCompanySelect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {companies.map((company, index) => {
        const isSelected = selectedCompany === company.id;

        return (
          <button
            key={company.id}
            onClick={() => onCompanySelect(company.id)}
            className={cn(
              'relative p-5 rounded-xl border-2 transition-all duration-300 text-left group',
              'hover:shadow-elevated focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isSelected
                ? 'border-primary bg-accent shadow-glow'
                : 'border-border bg-card hover:border-primary/30'
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {isSelected && (
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center animate-scale-in"
                style={{ backgroundColor: company.color }}
              >
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}

            <div className="flex flex-col items-start gap-3">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 overflow-hidden',
                  'group-hover:scale-110'
                )}
                style={{ backgroundColor: company.lightColor }}
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <span className="text-2xl">{company.icon}</span>
                )}
              </div>
              <div>
                <p className={cn(
                  'font-semibold transition-colors duration-200',
                  isSelected ? 'text-foreground' : 'text-foreground/80'
                )}>
                  {company.name}
                </p>
              </div>
            </div>

            {/* Decorative accent bar */}
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-all duration-300',
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
              )}
              style={{ backgroundColor: company.color }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default CompanySelector;
