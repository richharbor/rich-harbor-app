'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Upload, Download, Check } from 'lucide-react'

const steps = [
  'Account Type',
  'Account Info', 
  'Upload Documents',
  'Franchise Agreement',
  'Completed'
]

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    accountType: '',
    name: '',
    state: '',
    aadharCard: '',
    panCard: '',
    email: '',
    mobile: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    country: 'India',
    addressState: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: '',
    documents: {
      cmlCopy: null,
      panCard: null,
      cancelCheque: null,
      signature: null,
      agreement: null
    }
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountType">Select Account Type</Label>
              <Select value={formData.accountType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, accountType: value }))
              }>
                <SelectTrigger>
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

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name of Partner</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="state">State of Operation</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aadhar">Aadhar Card</Label>
                <Input
                  id="aadhar"
                  value={formData.aadharCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, aadharCard: e.target.value }))}
                  placeholder="Enter Aadhar number"
                />
              </div>
              <div>
                <Label htmlFor="pan">PAN Card</Label>
                <Input
                  id="pan"
                  value={formData.panCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, panCard: e.target.value }))}
                  placeholder="Enter PAN number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile No.</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Bank A/C No.</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value }))}
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="addressState">State</Label>
                  <Input
                    id="addressState"
                    value={formData.addressState}
                    onChange={(e) => setFormData(prev => ({ ...prev, addressState: e.target.value }))}
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                  placeholder="Enter address line 1"
                />
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                  placeholder="Enter address line 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip / Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="Enter zip code"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-4">
              If you need more info, please contact at +91 9211265558
            </div>

            {[
              { key: 'cmlCopy', label: 'CML Copy', formats: '.pdf, .png, .jpeg, .jpg' },
              { key: 'panCard', label: 'PAN Card', formats: '.pdf, .png, .jpeg, .jpg' },
              { key: 'cancelCheque', label: 'Cancel Cheque', formats: '.pdf, .png, .jpeg, .jpg' },
              { key: 'signature', label: 'Signature', formats: '.png, .jpeg, .jpg' }
            ].map((doc) => (
              <div key={doc.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">{doc.label}</Label>
                  <span className="text-sm text-gray-500">Allowed ({doc.formats}) file-types only</span>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept={doc.formats.replace(/\./g, '.')}
                    onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-medium mb-2">Franchise Agreement</h3>
              <p className="text-gray-600 mb-4">
                Download the franchise agreement, sign it, and upload the signed document.
              </p>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Franchise Agreement
              </Button>

              <div className="border rounded-lg p-4">
                <Label className="font-medium">Upload Signed Agreement</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('agreement', e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Registration Completed!</h3>
              <p className="text-gray-600">
                Your partner account has been created successfully. You will receive a confirmation email shortly.
              </p>
            </div>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Partner Registration</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm">
            {steps.map((step, index) => (
              <span
                key={step}
                className={`${
                  index + 1 <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[400px]">
          {renderStep()}
        </div>
        
        {currentStep < 5 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 4 ? 'Complete Registration' : 'Next'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
