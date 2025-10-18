"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Download, Loader2, X, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  postStartOnboard,
  postAccountInfo,
  postDocuments,
  postAgreement,
  completeOnboarding,
  getOnboardingStatus,
  verifyOnboardingToken,
} from "@/services/Auth/authServices";
import LoadingSpinner from "@/components/Common/LoadingSpinner/LoadingSpinner";
import {
  uploadDocumentFile,
  deleteDocumentFile,
  type UploadedFile,
} from "@/services/Auth/uploadServices";

type DocsKey =
  | "cmlCopy"
  | "panCard"
  | "cancelCheque"
  | "signature"
  | "agreement";

type FormDataState = {
  // Step 1
  accountType: string[];
  email: string;
  password: string;
  fullName: string;
  // Step 2
  name: string;
  state: string;
  aadharCard: string;
  panCard: string;
  mobile: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  country: string;
  addressState: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zipCode: string;
  // Step 3 & 4
  documents: Record<DocsKey, File | null>;
  uploadedFiles: Record<DocsKey, UploadedFile | null>;
};

const DEFAULT_STEPS = [
  "Account Setup",
  "Account Info",
  "Upload Documents",
  "Franchise Agreement",
  "Completed",
];

export default function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const steps = DEFAULT_STEPS;
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepVisited, setMaxStepVisited] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    // Step 1
    accountType: [],
    email: "",
    password: "",
    fullName: "",
    // Step 2
    name: "",
    state: "",
    aadharCard: "",
    panCard: "",
    mobile: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    country: "India",
    addressState: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    // Step 3 & 4
    documents: {
      cmlCopy: null,
      panCard: null,
      cancelCheque: null,
      signature: null,
      agreement: null,
    },
    uploadedFiles: {
      cmlCopy: null,
      panCard: null,
      cancelCheque: null,
      signature: null,
      agreement: null,
    },
  });
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);
  const [inviterId, setInviterId] = useState<number | null>(null);
  const [franchiseId, setFranchiseId] = useState<number | null>(null);
  const [accountRoles, setAccountRoles] = useState<
    { id: string; name: string }[]
  >([]);

  const progress = useMemo(
    () => (currentStep / steps.length) * 100,
    [currentStep, steps.length]
  );

  useEffect(() => {
    // Check if user has existing onboarding application
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const cookieToken = Cookies.get("authToken");

  useEffect(() => {
    // If token exists in cookie, don't redirect
    if (cookieToken) return;

    // If searchParams is null, redirect
    if (!searchParams) {
      router.replace("/auth/login");
      return;
    }

    const tokenFromUrl = searchParams.get("token");

    // If no token in URL, redirect
    if (!tokenFromUrl) {
      router.replace("/auth/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await verifyOnboardingToken({ token: tokenFromUrl });
        console.log("Token verified:", res);

        if (res?.data?.partnerEmail) {
          setFormData((prev) => ({
            ...prev,
            email: res.data.partnerEmail,
            accountType: res.data.partnerRoles.map((r: any) => r.id), // store IDs
          }));
          setInviteEmail(res.data.partnerEmail);
          setAccountRoles(res.data.partnerRoles); // store {id, name} for UI
        }

        setInviterId(res.data.inviterId);
        setFranchiseId(res.data.franchiseId || null);
      } catch (error: any) {
        console.error("Invalid or expired token:", error);
        toast.error("Invalid or expired invite link");
        router.replace("/auth/login");
      }
    };

    verifyToken();
  }, [searchParams, router, cookieToken]);

  const checkOnboardingStatus = async () => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        const response = await getOnboardingStatus();
        //  store status in state
        console.log(response.status);
        setCurrentStatus(response.status);

        if (response.currentStep && response.currentStep != 5) {
          setCurrentStep(response.currentStep + 1);
          setMaxStepVisited(response.currentStep);
        } else if (response.currentStep === 5) {
          setIsCompleted(true);
        }

        if (response.completedSteps) {
          // store in state
          setCompletedSteps(response.completedSteps);
        }

        if (response.formData) {
          setFormData((prev) => ({
            ...prev,
            // Step 1
            email: response.formData.step1?.email || prev.email,
            fullName: response.formData.step1?.fullName || prev.fullName,
            accountType:
              response.formData.step1?.accountType || prev.accountType,

            // Step 2 (if API sends later)
            name: response.formData.step2?.name || prev.name,
            state: response.formData.step2?.state || prev.state,
            aadharCard: response.formData.step2?.aadharCard || prev.aadharCard,
            panCard: response.formData.step2?.panCard || prev.panCard,
            mobile: response.formData.step2?.mobile || prev.mobile,
            bankName: response.formData.step2?.bankName || prev.bankName,
            accountNumber:
              response.formData.step2?.accountNumber || prev.accountNumber,
            ifscCode: response.formData.step2?.ifscCode || prev.ifscCode,
            country: response.formData.step2?.country || prev.country,
            addressState:
              response.formData.step2?.addressState || prev.addressState,
            addressLine1:
              response.formData.step2?.addressLine1 || prev.addressLine1,
            addressLine2:
              response.formData.step2?.addressLine2 || prev.addressLine2,
            city: response.formData.step2?.city || prev.city,
            zipCode: response.formData.step2?.zipCode || prev.zipCode,
          }));
        }
      } catch (error) {
        console.log("No existing application");
      }
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length && isStepValid(currentStep)) {
      setLoading(true);
      try {
        // Call API based on current step
        if (currentStep === 1) {
          await handleStep1Submit();
        } else if (currentStep === 2) {
          await handleStep2Submit();
        } else if (currentStep === 3) {
          await handleStep3Submit();
        } else if (currentStep === 4) {
          await handleStep4Submit();
        }

        const next = currentStep + 1;
        setCurrentStep(next);
        setMaxStepVisited((prev) => Math.max(prev, next));
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStep1Submit = async () => {
    try {
      const response = await postStartOnboard({
        email: formData.email,
        createdBy: inviterId!,
        password: formData.password,
        fullName: formData.fullName,
        accountType: formData.accountType,
        franchiseId, //  include franchiseId in payload
      });

      Cookies.set("authToken", response.token);
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.response?.data?.error || "Failed to create account");
    }
  };

  const handleStep2Submit = async () => {
    await postAccountInfo({
      name: formData.name,
      state: formData.state,
      aadharCard: formData.aadharCard,
      panCard: formData.panCard,
      mobile: formData.mobile,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      country: formData.country,
      addressState: formData.addressState,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      zipCode: formData.zipCode,
    });
    toast.success("Account information saved!");
  };

  const handleStep3Submit = async () => {
    const documentUrls: Record<string, string> = {};

    // Extract actual file URLs from uploadedFiles
    Object.entries(formData.uploadedFiles).forEach(
      ([key, uploadedFile]: [string, any]) => {
        if (uploadedFile && uploadedFile.fileUrl) {
          documentUrls[key] = uploadedFile.fileUrl;
        }
      }
    );

    console.log("[v0] Submitting document URLs:", documentUrls);

    await postDocuments({ documents: documentUrls });
    toast.success("Documents uploaded!");
  };

  const handleStep4Submit = async () => {
    // Upload agreement and get URL
    const agreementUrl = "uploaded_agreement_url";

    await postAgreement({ agreementUrl });

    // Complete the onboarding
    await completeOnboarding();
    toast.success("Application submitted for review!");
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [uploading, setUploading] = useState<Record<DocsKey, boolean>>({
    cmlCopy: false,
    panCard: false,
    cancelCheque: false,
    signature: false,
    agreement: false,
  });

  const handleFileUpload = async (field: DocsKey, file: File | null) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: null,
        },
      }));
      return;
    }

    // Set the file first
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));

    // Automatically start upload
    setUploading((prev) => ({ ...prev, [field]: true }));

    try {
      const uploadedFile = await uploadDocumentFile(file);
      console.log("[v0] Upload response:", uploadedFile);

      const fileData = {
        fileUrl: uploadedFile.fileUrl,
        fileName: file.name,
        fileSize: file.size,
        key: field, // Adding key property for debugging
        name: file.name, // Adding name property as alias
      };

      console.log("[v0] Storing file data:", fileData);

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          uploadedFiles: {
            ...prev.uploadedFiles,
            [field]: fileData,
          },
          documents: {
            ...prev.documents,
            [field]: null, // Clear the file input after successful upload
          },
        };
        console.log(
          "[v0] New form data uploadedFiles:",
          newFormData.uploadedFiles
        );
        return newFormData;
      });
      toast.success("File uploaded successfully");
    } catch (error) {
      console.log("[v0] Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleUpload = async (field: DocsKey) => {
    const file = formData.documents[field];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [field]: true }));

    try {
      const uploadedFile = await uploadDocumentFile(file);
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: {
          ...prev.uploadedFiles,
          [field]: uploadedFile,
        },
        documents: {
          ...prev.documents,
          [field]: null, // Clear the file input after successful upload
        },
      }));
    } catch (error) {
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDelete = async (field: DocsKey) => {
    const uploadedFile = formData.uploadedFiles[field];
    if (!uploadedFile) return;

    try {
      await deleteDocumentFile({ key: uploadedFile.key });
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: {
          ...prev.uploadedFiles,
          [field]: null,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isIFSC = (val: string) => /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(val);
  const isAadhar = (val: string) => /^\d{12}$/.test(val.replace(/\s/g, ""));
  const isPAN = (val: string) =>
    /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(val.toUpperCase());
  const isMobile = (val: string) => /^\d{10}$/.test(val);

  function isStepValid(step: number): boolean {
    if (step === 1) {
      return (
        formData.accountType.length > 0 &&
        isEmail(formData.email) &&
        formData.password.length >= 8 &&
        formData.fullName.trim().length > 2
      );
    }
    if (step === 2) {
      return (
        formData.name.trim().length > 1 &&
        formData.state.trim().length > 0 &&
        isAadhar(formData.aadharCard) &&
        isPAN(formData.panCard) &&
        isMobile(formData.mobile) &&
        formData.bankName.trim().length > 0 &&
        formData.accountNumber.trim().length >= 8 &&
        isIFSC(formData.ifscCode) &&
        formData.country.trim().length > 0 &&
        formData.addressState.trim().length > 0 &&
        formData.addressLine1.trim().length > 0 &&
        formData.city.trim().length > 0 &&
        formData.zipCode.trim().length >= 4
      );
    }
    if (step === 3) {
      return Boolean(
        formData.uploadedFiles.cmlCopy &&
          formData.uploadedFiles.panCard &&
          formData.uploadedFiles.cancelCheque &&
          formData.uploadedFiles.signature
      );
    }
    if (step === 4) {
      return Boolean(formData.uploadedFiles.agreement);
    }
    return true;
  }

  const canGoNext = isStepValid(currentStep);

  const stepBadge = (index: number) => {
    const stepNumber = index + 1;
    const isActive = stepNumber === currentStep;
    const isDone = stepNumber < currentStep;
    const isClickable = stepNumber <= currentStep && !loading;

    return (
      <button
        key={steps[index]}
        type="button"
        onClick={() => isClickable && setCurrentStep(stepNumber)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
          isActive && "bg-primary/10 text-primary border border-primary/20",
          !isActive &&
            isDone &&
            "bg-muted text-muted-foreground hover:bg-muted/80",
          !isActive && !isDone && "bg-muted text-muted-foreground",
          !isClickable && "cursor-not-allowed opacity-60"
        )}
        disabled={loading}>
        <span
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px]",
            isActive && "border-primary text-primary bg-primary/5",
            isDone && "border-primary text-primary bg-primary/10",
            !isActive &&
              !isDone &&
              "border-muted-foreground/30 bg-background text-muted-foreground"
          )}>
          {isDone ? <Check className="h-3.5 w-3.5" /> : stepNumber}
        </span>
        <span>{steps[index]}</span>
      </button>
    );
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <LoadingSpinner visible={loading} message="Please wait..." />
  ) : isCompleted ? (
    <div className="h-screen mx-auto flex w-full max-w-md flex-col items-center justify-center px-4">
      {currentStatus === "rejected" ? (
        // ❌ Rejected UI
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <X className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-red-600">
              Registration Rejected
            </h3>
            <p className="text-muted-foreground">
              Unfortunately, your application was rejected. Please review your
              details and try again or contact support for assistance.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => window.open("https://richharbor.com/", "_blank")}>
            Go to website
          </Button>
        </div>
      ) : (
        // ✅ Success UI (default if not rejected)
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-8 w-8 text-emerald-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-emerald-600">
              Registration Completed!
            </h3>
            <p className="text-muted-foreground">
              Your partner account has been created successfully. You will
              receive a confirmation email shortly.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => window.open("https://richharbor.com/", "_blank")}>
            Go to website
          </Button>
        </div>
      )}
    </div>
  ) : (
    //  Normal form wizard
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-semibold text-foreground">
              Partner Registration
            </h1>
            <div className="text-xs md:text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </div>

          <Progress value={progress} className="mt-2 h-2" />

          <div className="mt-3 -mb-2">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {steps.map((_, i) => stepBadge(i))}
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-6">
          <Card>
            <CardContent className="pt-6">
              <StepView
                step={currentStep}
                formData={formData}
                setFormData={setFormData}
                handleFileUpload={handleFileUpload}
                handleUpload={handleUpload}
                handleDelete={handleDelete}
                uploading={uploading}
                currentStatus={currentStatus}
                inviteEmail={inviteEmail}
                accountRoles={accountRoles}
              />

              {currentStep < steps.length && (
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/dashboard")}
                      disabled={loading}>
                      Skip for now
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={!canGoNext || loading}>
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {currentStep === steps.length - 1
                        ? "Complete Registration"
                        : "Save & Continue"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StepView({
  step = 1,
  formData,
  setFormData,
  handleFileUpload,
  handleUpload,
  handleDelete,
  uploading,
  currentStatus,
  inviteEmail,
  accountRoles,
}: {
  step?: number;
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  handleFileUpload: (field: DocsKey, file: File | null) => void;
  handleUpload: (field: DocsKey) => void;
  handleDelete: (field: DocsKey) => void;
  uploading: Record<DocsKey, boolean>;
  currentStatus: string | null;
  inviteEmail: string | null;
  accountRoles: any;
}) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div>
          <div>
            <Label htmlFor="accountType">Account Roles</Label>
            <div className="mt-2 p-2 rounded-md bg-muted text-sm min-h-[40px]">
              {accountRoles.length > 0
                ? accountRoles.map((r: any) => r.name).join(", ")
                : ""}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder="Enter your full name"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            readOnly={!!inviteEmail} // now using state instead of cookie
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter email address"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Enter password (min 8 characters)"
            className="mt-2"
          />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name of Partner</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter full name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="state">State of Operation</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, state: e.target.value }))
              }
              placeholder="Enter state"
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="aadhar">Aadhar Card</Label>
            <Input
              id="aadhar"
              inputMode="numeric"
              value={formData.aadharCard}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, aadharCard: e.target.value }))
              }
              placeholder="Enter Aadhar number"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="pan">PAN Card</Label>
            <Input
              id="pan"
              value={formData.panCard}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, panCard: e.target.value }))
              }
              placeholder="Enter PAN number"
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter email address"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile No.</Label>
            <Input
              id="mobile"
              inputMode="tel"
              value={formData.mobile}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mobile: e.target.value,
                }))
              }
              placeholder="Enter mobile number"
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bankName: e.target.value }))
              }
              placeholder="Enter bank name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="accountNumber">Bank A/C No.</Label>
            <Input
              id="accountNumber"
              inputMode="numeric"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountNumber: e.target.value,
                }))
              }
              placeholder="Enter account number"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="ifsc">IFSC Code</Label>
            <Input
              id="ifsc"
              value={formData.ifscCode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ifscCode: e.target.value }))
              }
              placeholder="Enter IFSC code"
              className="mt-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Address Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value }))
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="addressState">State</Label>
              <Input
                id="addressState"
                value={formData.addressState}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    addressState: e.target.value,
                  }))
                }
                placeholder="Enter state"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input
              id="addressLine1"
              value={formData.addressLine1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addressLine1: e.target.value,
                }))
              }
              placeholder="Enter address line 1"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={formData.addressLine2}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addressLine2: e.target.value,
                }))
              }
              placeholder="Enter address line 2"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Enter city"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip / Postal Code</Label>
              <Input
                id="zipCode"
                inputMode="numeric"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zipCode: e.target.value }))
                }
                placeholder="Enter zip code"
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    const docs = [
      {
        key: "cmlCopy" as const,
        label: "CML Copy",
        formats: ".pdf,.png,.jpeg,.jpg",
      },
      {
        key: "panCard" as const,
        label: "PAN Card",
        formats: ".pdf,.png,.jpeg,.jpg",
      },
      {
        key: "cancelCheque" as const,
        label: "Cancel Cheque",
        formats: ".pdf,.png,.jpeg,.jpg",
      },
      {
        key: "signature" as const,
        label: "Signature",
        formats: ".png,.jpeg,.jpg",
      },
    ];

    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {"If you need more info, please contact at +91 9211265558"}
        </p>
        {docs.map((doc) => (
          <div key={doc.key} className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <Label className="font-medium">{doc.label}</Label>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Allowed ({doc.formats}) file-types only
              </span>
            </div>

            {formData.uploadedFiles[doc.key] ? (
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    {formData.uploadedFiles[doc.key]?.key ||
                      formData.uploadedFiles[doc.key]?.name ||
                      "Unknown file"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => handleDelete(doc.key)}
                  className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Input
                  type="file"
                  accept={doc.formats}
                  onChange={(e) =>
                    handleFileUpload(doc.key, e.target.files?.[0] || null)
                  }
                  className="flex-1"
                  aria-label={`Upload ${doc.label}`}
                  disabled={uploading[doc.key]}
                />
                {uploading[doc.key] && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    Uploading...
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h3 className="mb-2 text-lg font-medium">Franchise Agreement</h3>
          <p className="text-muted-foreground">
            {
              "Download the franchise agreement, sign it, and upload the signed document."
            }
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            type="button"
            onClick={() => alert("Downloading agreement...")}>
            <Download className="mr-2 h-4 w-4" />
            Download Franchise Agreement
          </Button>

          <div className="rounded-lg border p-4 text-left">
            <Label className="font-medium">Upload Signed Agreement</Label>
            {formData.uploadedFiles.agreement ? (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    {formData.uploadedFiles.agreement?.key ||
                      formData.uploadedFiles.agreement?.name ||
                      "Unknown file"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => handleDelete("agreement")}
                  className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-3">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    handleFileUpload("agreement", e.target.files?.[0] || null)
                  }
                  className="flex-1"
                  aria-label="Upload signed franchise agreement"
                  disabled={uploading.agreement}
                />
                {uploading.agreement && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    Uploading...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 5) {
    if (currentStatus === "rejected") {
      return (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <X className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-red-600">
              Registration Rejected
            </h3>
            <p className="text-muted-foreground">
              Unfortunately, your application was rejected. Please review your
              details and try again or contact support for assistance.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => window.open("https://richharbor.com/", "_blank")}>
            Go to website
          </Button>
        </div>
      );
    } else {
      // success UI (status !== rejected)
      return (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-8 w-8 text-emerald-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold text-emerald-600">
              Registration Completed!
            </h3>
            <p className="text-muted-foreground">
              Your partner account has been created successfully. You will
              receive a confirmation email shortly.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => window.open("https://richharbor.com/", "_blank")}>
            Go to website
          </Button>
        </div>
      );
    }
  }

  return null;
}
