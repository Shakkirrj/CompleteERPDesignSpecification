import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Upload, X, FileText, Image, User, MapPin, Phone, AlertCircle, Loader2, CheckCircle, Cpu } from "lucide-react";

const steps = [
  { id: "personal", label: "Personal", icon: User },
  { id: "contact", label: "Contact", icon: MapPin },
  { id: "emergency", label: "Emergency", icon: Phone },
  { id: "bank", label: "Bank", icon: FileText },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "declaration", label: "Declaration", icon: Check },
  { id: "review", label: "Review", icon: CheckCircle },
];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: "uploading" | "done" | "error";
  progress: number;
}

function FileUploadZone({ label, multiple = false, required = false, hint }: { label: string; multiple?: boolean; required?: boolean; hint?: string }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      status: "uploading",
      progress: 0,
    }));
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    newFiles.forEach((_, i) => {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 30 + 10;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setFiles(prev => prev.map((f, fi) => fi === (multiple ? prev.length - newFiles.length + i : i) ? { ...f, status: "done", progress: 100 } : f));
        } else {
          setFiles(prev => prev.map((f, fi) => fi === (multiple ? prev.length - newFiles.length + i : i) ? { ...f, progress: Math.round(p) } : f));
        }
      }, 200);
    });
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
      >
        <Upload size={20} className={`mx-auto mb-2 ${dragging ? "text-blue-500" : "text-slate-400"}`} />
        <p className="text-sm text-slate-600 font-medium">Drag files here or <span className="text-blue-600">browse</span></p>
        <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG up to 10MB{multiple ? " — multiple files allowed" : ""}</p>
        <input ref={inputRef} type="file" multiple={multiple} className="hidden" onChange={e => addFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="space-y-2 mt-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${f.type.startsWith("image") ? "bg-blue-50" : "bg-slate-100"}`}>
                {f.type.startsWith("image") ? <Image size={14} className="text-blue-500" /> : <FileText size={14} className="text-slate-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{f.name}</p>
                <p className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(1)} KB</p>
                {f.status === "uploading" && (
                  <div className="mt-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                  </div>
                )}
              </div>
              {f.status === "uploading" && <Loader2 size={14} className="text-blue-500 animate-spin flex-shrink-0" />}
              {f.status === "done" && <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />}
              {f.status === "error" && <AlertCircle size={14} className="text-red-500 flex-shrink-0" />}
              <button onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter((_, fi) => fi !== i)); }} className="p-0.5 hover:bg-slate-200 rounded flex-shrink-0">
                <X size={12} className="text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormField({ label, required, type = "text", placeholder, hint, children }: {
  label: string; required?: boolean; type?: string; placeholder?: string; hint?: string; children?: React.ReactNode;
}) {
  if (children) return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {type === "textarea" ? (
        <textarea placeholder={placeholder} rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
      ) : (
        <input type={type} placeholder={placeholder} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      )}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

const sriLankaDistricts = ["Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha","Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala","Mannar","Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya","Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya"];
const sriLankaProvinces = ["Central","Eastern","North Central","Northern","North Western","Sabaragamuwa","Southern","Uva","Western"];
const sriLankaBanks = ["Bank of Ceylon","People's Bank","Sampath Bank","Commercial Bank","HNB","Nations Trust Bank","Seylan Bank","NDB Bank","DFCC Bank","Pan Asia Bank","Amana Bank","NSB","LOLC Finance","HSBC Sri Lanka","Standard Chartered"];

export default function EmployeeRegistration({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);

  function next() { if (step < steps.length - 1) setStep(step + 1); }
  function back() { if (step > 0) setStep(step - 1); }

  const stepContent: Record<string, React.ReactNode> = {
    personal: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Full Legal Name" required placeholder="As per NIC/Passport" />
          <FormField label="Name with Initials" required placeholder="e.g. K.A.D. Perera" />
          <FormField label="Preferred Name" placeholder="e.g. Kavinda" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender<span className="text-red-500 ml-1">*</span></label>
            <div className="flex gap-4">
              {["Male","Female","Other","Prefer not to say"].map(g => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">{g}</span>
                </label>
              ))}
            </div>
          </div>
          <FormField label="Date of Birth" required type="date" />
          <FormField label="NIC / Passport Number" required placeholder="e.g. 921263456V or N1234567" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FileUploadZone label="NIC / Passport Copy" required hint="Upload front and back of NIC, or photo page of passport" />
          <FileUploadZone label="Profile Photo" required hint="Clear frontal photo, passport size preferred" />
        </div>
      </div>
    ),
    contact: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Personal Email Address" required type="email" placeholder="your@email.com" />
          <FormField label="Mobile Number" required type="tel" placeholder="+94 77 123 4567" />
          <FormField label="WhatsApp Number" required type="tel" placeholder="+94 77 123 4567" />
          <FormField label="Alternative Contact Number" type="tel" placeholder="+94 71 123 4567" />
        </div>
        <FormField label="Current Residential Address" required type="textarea" placeholder="No., Street, City" />
        <FormField label="Permanent Address" required type="textarea" placeholder="No., Street, City" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="City / Town" required placeholder="e.g. Colombo" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">District<span className="text-red-500 ml-1">*</span></label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select District</option>
              {sriLankaDistricts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Province<span className="text-red-500 ml-1">*</span></label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select Province</option>
              {sriLankaProvinces.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <FormField label="Postal Code" placeholder="e.g. 00300" />
        </div>
      </div>
    ),
    emergency: (
      <div className="space-y-5">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
          <span>Emergency contact information is used only in the event of a workplace emergency. This information is kept strictly confidential.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Emergency Contact Full Name" required placeholder="Full name" />
          <FormField label="Relationship to Employee" required placeholder="e.g. Spouse, Parent, Sibling" />
          <FormField label="Emergency Contact Number" required type="tel" placeholder="+94 77 000 0000" />
          <FormField label="WhatsApp Number" type="tel" placeholder="+94 77 000 0000" />
        </div>
        <FormField label="Emergency Contact Address" type="textarea" placeholder="Optional" />
      </div>
    ),
    bank: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Account Holder Name" required placeholder="As per bank records" hint="Must match your NIC/Passport name exactly" />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bank Name<span className="text-red-500 ml-1">*</span></label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Search or select bank...</option>
              {sriLankaBanks.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <FormField label="Branch Name" required placeholder="e.g. Colombo 03" />
          <FormField label="Account Number" required placeholder="e.g. 0012345678" hint="Enter account number without spaces" />
          <FormField label="Bank Code" required placeholder="e.g. 7010" />
          <FormField label="SWIFT / BIC Code" required placeholder="e.g. BCEYLKLX" />
        </div>
        <FileUploadZone label="Bank Account Verification Document" required hint="Bank statement header, passbook scan, or bank letter" />
      </div>
    ),
    documents: (
      <div className="space-y-6">
        <FileUploadZone label="CV / Resume" hint="PDF preferred. Max 5MB." />
        <FileUploadZone label="Educational & Professional Certificates" multiple hint="Degrees, diplomas, certifications. Multiple files allowed." />
        <FileUploadZone label="Other Supporting Documents" multiple hint="Any additional documents relevant to employment." />
      </div>
    ),
    declaration: (
      <div className="space-y-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h4 className="font-semibold text-slate-800 mb-1" style={{ fontFamily: "var(--font-display)" }}>Declaration & Consent</h4>
          <p className="text-xs text-slate-500">Please read and confirm the following statements before submitting your registration.</p>
        </div>
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={confirm1}
              onChange={e => setConfirm1(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-800 mb-0.5">Accuracy of Information</p>
              <p className="text-sm text-slate-600">I confirm that the information provided in this Employee Registration Form is accurate and complete to the best of my knowledge. I understand that providing false information may result in termination of employment.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={confirm2}
              onChange={e => setConfirm2(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-800 mb-0.5">Consent for HR Records</p>
              <p className="text-sm text-slate-600">I authorize MernCrest Solutions (Pvt) Ltd. to use the information provided for legitimate employment, HR, payroll, communication, identification, and administrative purposes in accordance with applicable data protection laws.</p>
            </div>
          </label>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Submission date will be automatically recorded as: <strong className="text-slate-700">{new Date().toLocaleString("en-LK", { dateStyle: "long", timeStyle: "short" })}</strong></p>
        </div>
      </div>
    ),
    review: (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Ready to submit</p>
            <p className="text-xs text-blue-600 mt-0.5">Please review your information before submitting. You can go back to any section to make corrections.</p>
          </div>
        </div>
        {steps.slice(0, -1).map((s, i) => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                <Check size={14} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                <p className="text-[11px] text-slate-400">Section {i + 1} — Completed</p>
              </div>
            </div>
            <button onClick={() => setStep(i)} className="text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
          </div>
        ))}
      </div>
    ),
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "var(--font-display)" }}>Registration Submitted</h2>
          <p className="text-slate-500 text-sm mb-1">Your registration has been submitted successfully.</p>
          <p className="text-slate-400 text-xs">Reference: <span className="font-mono font-semibold text-slate-600">REG-2025-{Math.floor(Math.random() * 9000) + 1000}</span></p>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
            <p className="text-xs font-semibold text-blue-800 mb-1">What happens next?</p>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>HR reviews your submitted information</li>
              <li>Manager approval (if required)</li>
              <li>Account creation and credential delivery</li>
              <li>Onboarding process begins</li>
            </ol>
          </div>
          {onBack && (
            <button onClick={onBack} className="mt-6 text-sm text-slate-500 hover:text-slate-700">← Back to Employees</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu size={15} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900" style={{ fontFamily: "var(--font-display)" }}>MernCrest IT Services</p>
            <p className="text-[10px] text-slate-400">Employee Registration</p>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active ? "bg-blue-600 text-white" :
                    done ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer hover:bg-emerald-100" :
                    "bg-slate-100 text-slate-400 cursor-default"
                  }`}
                >
                  {done ? <Check size={10} /> : <span className="font-bold">{i + 1}</span>}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < steps.length - 1 && <span className={`text-[10px] ${done || active ? "text-blue-300" : "text-slate-200"}`}>›</span>}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
              {step === 0 && "Personal Details"}
              {step === 1 && "Contact Details"}
              {step === 2 && "Emergency Contact"}
              {step === 3 && "Bank Account Details"}
              {step === 4 && "Documents"}
              {step === 5 && "Declaration & Consent"}
              {step === 6 && "Review & Submit"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Step {step + 1} of {steps.length}</p>
          </div>

          <div className="p-6">
            {stepContent[steps[step].id]}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button onClick={back} className="flex items-center gap-2 text-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <button className="text-sm text-slate-400 hover:text-slate-600 px-3 py-2 transition-colors">Save Draft</button>
            </div>
            {step < steps.length - 1 ? (
              <button onClick={next} className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors">
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                disabled={!confirm1 || !confirm2}
                className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                <CheckCircle size={14} /> Submit Registration
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
