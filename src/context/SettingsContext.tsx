import { createContext, useContext, useState, type ReactNode } from "react";

export interface OrgSettings {
  name: string;
  legalName: string;
  regNo: string;
  vatNo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountNo: string;
  swiftCode: string;
  paymentRef: string;
  logoColor: string;
}

export const defaultOrgSettings: OrgSettings = {
  name:         "MernCrest Solutions (Pvt) Ltd",
  legalName:    "MernCrest Solutions (Private) Limited",
  regNo:        "PV 00123456",
  vatNo:        "VAT/2024/MC/0078",
  address:      "No. 42, Galle Road, Colombo 03, Sri Lanka",
  phone:        "+94 11 234 5678",
  email:        "accounts@merncrest.lk",
  website:      "www.merncrest.lk",
  bankName:     "Sampath Bank PLC",
  bankBranch:   "Colombo 03 Branch",
  accountName:  "MernCrest Solutions (Pvt) Ltd",
  accountNo:    "1234 5678 9012",
  swiftCode:    "BSAMLKLX",
  paymentRef:   "Please quote invoice number as payment reference",
  logoColor:    "#2563EB",
};

interface SettingsContextValue {
  settings: OrgSettings;
  updateSettings: (partial: Partial<OrgSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultOrgSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<OrgSettings>(defaultOrgSettings);
  function updateSettings(partial: Partial<OrgSettings>) {
    setSettings(prev => ({ ...prev, ...partial }));
  }
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
