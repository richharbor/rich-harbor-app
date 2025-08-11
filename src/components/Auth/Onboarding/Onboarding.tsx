"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Download, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

type DocsKey = "cmlCopy" | "panCard" | "cancelCheque" | "signature" | "agreement"

type FormDataState = {
  accountType: string
  name: string
  state: string
  aadharCard: string
  panCard: string
  email: string
  mobile: string
  bankName: string
  accountNumber: string
  ifscCode: string
  country: string
  addressState: string
  addressLine1: string
  addressLine2: string
  city: string
  zipCode: string
  documents: Record<DocsKey, File | null>
}

const DEFAULT_STEPS = ["Account Type", "Account Info", "Upload Documents", "Franchise Agreement", "Completed"]

export default function Onboarding() {

  const steps = DEFAULT_STEPS
  const stepsSafe = steps && steps.length > 0 ? steps : DEFAULT_STEPS

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [maxStepVisited, setMaxStepVisited] = useState<number>(1)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [formData, setFormData] = useState<FormDataState>({
    accountType: "",
    name: "",
    state: "",
    aadharCard: "",
    panCard: "",
    email: "",
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
    documents: {
      cmlCopy: null,
      panCard: null,
      cancelCheque: null,
      signature: null,
      agreement: null,
    },
  })

  const progress = useMemo(() => (currentStep / stepsSafe.length) * 100, [currentStep, stepsSafe.length])

  useEffect(() => {
    // Smoothly scroll content back to top on step change
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStep])

  const handleNext = () => {
    if (currentStep < stepsSafe.length && isStepValid(currentStep)) {
      const next = currentStep + 1
      setCurrentStep(next)
      setMaxStepVisited((prev) => Math.max(prev, next))
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (field: DocsKey, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }))
  }

  const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  const isIFSC = (val: string) => /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(val) // Common IFSC format
  const isAadhar = (val: string) => /^\d{12}$/.test(val.replace(/\s/g, ""))
  const isPAN = (val: string) => /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(val.toUpperCase())
  const isMobile = (val: string) => /^\d{10}$/.test(val)

  function isStepValid(step: number): boolean {
    if (step === 1) {
      return formData.accountType.length > 0
    }
    if (step === 2) {
      return (
        formData.name.trim().length > 1 &&
        formData.state.trim().length > 0 &&
        isAadhar(formData.aadharCard) &&
        isPAN(formData.panCard) &&
        isEmail(formData.email) &&
        isMobile(formData.mobile) &&
        formData.bankName.trim().length > 0 &&
        formData.accountNumber.trim().length >= 8 &&
        isIFSC(formData.ifscCode) &&
        formData.country.trim().length > 0 &&
        formData.addressState.trim().length > 0 &&
        formData.addressLine1.trim().length > 0 &&
        formData.city.trim().length > 0 &&
        formData.zipCode.trim().length >= 4
      )
    }
    if (step === 3) {
      return Boolean(
        formData.documents.cmlCopy &&
          formData.documents.panCard &&
          formData.documents.cancelCheque &&
          formData.documents.signature,
      )
    }
    if (step === 4) {
      return Boolean(formData.documents.agreement)
    }
    return true
  }

  const canGoNext = isStepValid(currentStep)

  const stepBadge = (index: number) => {
    const stepNumber = index + 1
    const isDone = stepNumber < currentStep
    const isActive = stepNumber === currentStep
    const isClickable = stepNumber <= maxStepVisited

    return (
      <button
        key={stepsSafe[index]}
        type="button"
        onClick={() => isClickable && setCurrentStep(stepNumber)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
          isActive && "bg-emerald-100 text-emerald-700",
          !isActive && isDone && "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
          !isActive && !isDone && "bg-muted text-muted-foreground",
          !isClickable && "cursor-not-allowed opacity-60",
        )}
        aria-current={isActive ? "step" : undefined}
        aria-disabled={!isClickable}
      >
        <span
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px]",
            isActive && "border-emerald-600 text-emerald-700",
            isDone && "border-emerald-500 text-emerald-600",
            !isActive && !isDone && "border-transparent bg-background",
          )}
        >
          {isDone ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : stepNumber}
        </span>
        <span>{stepsSafe[index]}</span>
      </button>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed/Sticky Header */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-semibold">Partner Registration</h1>
            <div className="text-xs md:text-sm text-muted-foreground">
              {"Step "}
              {currentStep}
              {" of "}
              {stepsSafe.length}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs md:text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />

          {/* Stepper */}
          <div className="mt-3 -mb-2">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="Registration steps">
              {stepsSafe.map((_, i) => stepBadge(i))}
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-6">
          <Card>
            <CardContent className="pt-6">
              <StepView
                step={currentStep}
                formData={formData}
                setFormData={setFormData}
                handleFileUpload={handleFileUpload}
              />

              {/* Navigation */}
              {currentStep < stepsSafe.length && (
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    Previous
                  </Button>
                  <Button onClick={handleNext} disabled={!canGoNext}>
                    {currentStep === stepsSafe.length - 1 ? "Complete Registration" : "Next"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StepView({
  step = 1,
  formData,
  setFormData,
  handleFileUpload,
}: {
  step?: number
  formData: FormDataState
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>
  handleFileUpload: (field: DocsKey, file: File | null) => void
}) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="accountType">Select Account Type</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, accountType: value }))}
          >
            <SelectTrigger id="accountType" className="mt-2">
              <SelectValue placeholder="Choose account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual Partner</SelectItem>
              <SelectItem value="corporate">Corporate Partner</SelectItem>
              <SelectItem value="franchise">Franchise Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
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
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="state">State of Operation</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, aadharCard: e.target.value }))}
              placeholder="Enter Aadhar number"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="pan">PAN Card</Label>
            <Input
              id="pan"
              value={formData.panCard}
              onChange={(e) => setFormData((prev) => ({ ...prev, panCard: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, bankName: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, ifscCode: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                placeholder="Enter zip code"
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    const docs = [
      { key: "cmlCopy" as const, label: "CML Copy", formats: ".pdf,.png,.jpeg,.jpg" },
      { key: "panCard" as const, label: "PAN Card", formats: ".pdf,.png,.jpeg,.jpg" },
      { key: "cancelCheque" as const, label: "Cancel Cheque", formats: ".pdf,.png,.jpeg,.jpg" },
      { key: "signature" as const, label: "Signature", formats: ".png,.jpeg,.jpg" },
    ]

    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">{"If you need more info, please contact at +91 9211265558"}</p>
        {docs.map((doc) => (
          <div key={doc.key} className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <Label className="font-medium">{doc.label}</Label>
              <span className="text-xs sm:text-sm text-muted-foreground">Allowed ({doc.formats}) file-types only</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="file"
                accept={doc.formats}
                onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                className="flex-1"
                aria-label={`Upload ${doc.label}`}
              />
              <Button variant="outline" size="sm" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              {formData.documents[doc.key] && (
                <span className="text-xs text-emerald-600 inline-flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  File added
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h3 className="mb-2 text-lg font-medium">Franchise Agreement</h3>
          <p className="text-muted-foreground">
            {"Download the franchise agreement, sign it, and upload the signed document."}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            type="button"
            onClick={() => alert("Downloading agreement...")}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Franchise Agreement
          </Button>

          <div className="rounded-lg border p-4 text-left">
            <Label className="font-medium">Upload Signed Agreement</Label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload("agreement", e.target.files?.[0] || null)}
                className="flex-1"
                aria-label="Upload signed franchise agreement"
              />
              <Button variant="outline" size="sm" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              {Boolean(formData.documents.agreement) && (
                <span className="text-xs text-emerald-600 inline-flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  File added
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 5) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-emerald-600" aria-hidden="true" />
        </div>
        <div>
          <h3 className="mb-2 text-xl font-bold text-emerald-600">Registration Completed!</h3>
          <p className="text-muted-foreground">
            {"Your partner account has been created successfully. You will receive a confirmation email shortly."}
          </p>
        </div>
        <Button type="button" onClick={() => (window.location.href = "/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return null
}
