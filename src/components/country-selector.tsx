"use client";

import { useLocale } from "@/hooks/use-locale";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/ui/atoms/button";
import Image from "next/image";

interface Country {
  code: string;
  nameKey: string;
  flag: string;
  alt: string;
}

interface CountrySelectorProps {
  selectedCountry?: string;
  onCountryChange?: (country: string) => void;
}

export function CountrySelector({
  selectedCountry = "TH",
  onCountryChange,
}: CountrySelectorProps) {
  const { assetPath } = useLocale();
  const { t } = useI18n();

  const countries: Country[] = [
    {
      code: "TH",
      nameKey: "countries.thailand",
      flag: "/assets/images/flags/th-flag.png",
      alt: "Thailand flag",
    },
    {
      code: "EN",
      nameKey: "countries.english",
      flag: "/assets/images/flags/uk-flag.png",
      alt: "English flag",
    },
    {
      code: "LO",
      nameKey: "countries.laos",
      flag: "/assets/images/flags/laos-flag.png",
      alt: "Laos flag",
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Country</label>
      <div className="flex flex-wrap gap-3">
        {countries.map((country) => (
          <Button
            key={country.code}
            type="button"
            variant={selectedCountry === country.code ? "default" : "outline"}
            size="sm"
            onClick={() => onCountryChange?.(country.code)}
            className={`flex items-center gap-2 ${
              selectedCountry === country.code
                ? "bg-primary text-primary-foreground"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Image
              src={assetPath(country.flag)}
              alt={country.alt}
              width={20}
              height={15}
              className="rounded-sm"
            />
            {t(country.nameKey)}
          </Button>
        ))}
      </div>
    </div>
  );
}
