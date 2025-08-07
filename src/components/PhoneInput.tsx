
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Country {
  name: string;
  dial_code: string;
  code: string;
}

interface PhoneInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (countryCode: string) => void;
  placeholder?: string;
  required?: boolean;
  selectedCountry: string;
}

const countries: Country[] = [
  { name: "Afghanistan", dial_code: "+93", code: "AF" },
  { name: "Albania", dial_code: "+355", code: "AL" },
  { name: "Algeria", dial_code: "+213", code: "DZ" },
  { name: "Argentina", dial_code: "+54", code: "AR" },
  { name: "Australia", dial_code: "+61", code: "AU" },
  { name: "Austria", dial_code: "+43", code: "AT" },
  { name: "Bangladesh", dial_code: "+880", code: "BD" },
  { name: "Belgium", dial_code: "+32", code: "BE" },
  { name: "Brazil", dial_code: "+55", code: "BR" },
  { name: "Canada", dial_code: "+1", code: "CA" },
  { name: "China", dial_code: "+86", code: "CN" },
  { name: "Denmark", dial_code: "+45", code: "DK" },
  { name: "Egypt", dial_code: "+20", code: "EG" },
  { name: "France", dial_code: "+33", code: "FR" },
  { name: "Germany", dial_code: "+49", code: "DE" },
  { name: "India", dial_code: "+91", code: "IN" },
  { name: "Indonesia", dial_code: "+62", code: "ID" },
  { name: "Italy", dial_code: "+39", code: "IT" },
  { name: "Japan", dial_code: "+81", code: "JP" },
  { name: "Malaysia", dial_code: "+60", code: "MY" },
  { name: "Netherlands", dial_code: "+31", code: "NL" },
  { name: "New Zealand", dial_code: "+64", code: "NZ" },
  { name: "Nigeria", dial_code: "+234", code: "NG" },
  { name: "Pakistan", dial_code: "+92", code: "PK" },
  { name: "Philippines", dial_code: "+63", code: "PH" },
  { name: "Singapore", dial_code: "+65", code: "SG" },
  { name: "South Africa", dial_code: "+27", code: "ZA" },
  { name: "South Korea", dial_code: "+82", code: "KR" },
  { name: "Spain", dial_code: "+34", code: "ES" },
  { name: "Sri Lanka", dial_code: "+94", code: "LK" },
  { name: "Sweden", dial_code: "+46", code: "SE" },
  { name: "Switzerland", dial_code: "+41", code: "CH" },
  { name: "Thailand", dial_code: "+66", code: "TH" },
  { name: "Turkey", dial_code: "+90", code: "TR" },
  { name: "United Arab Emirates", dial_code: "+971", code: "AE" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
  { name: "United States", dial_code: "+1", code: "US" },
  { name: "Vietnam", dial_code: "+84", code: "VN" }
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  onCountryChange,
  placeholder,
  required = false,
  selectedCountry
}) => {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block mb-2">
        {label} {required && "*"}
      </label>
      <div className="flex gap-2">
        <Select
          value={selectedCountry}
          onValueChange={onCountryChange}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.dial_code}>
                {country.dial_code} {country.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={id}
          name={name}
          type="tel"
          required={required}
          value={value}
          onChange={onChange}
          className="flex-1"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
