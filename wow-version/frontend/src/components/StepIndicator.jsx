import { Check } from 'lucide-react'

const steps = [
  { number: 1, label: 'Resume' },
  { number: 2, label: 'Job' },
  { number: 3, label: 'Analysis' },
  { number: 4, label: 'Results' },
]

export default function StepIndicator({ currentStep }) {
  return (
    <div className="bg-white border-b border-slate-100 py-6">
      <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-center">
        <div className="flex items-center gap-4 w-full max-w-2xl">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number

            return (
              <div key={step.number} className="contents">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${isCompleted || isCurrent
                        ? 'bg-[#6366f1] text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }
                      ${isCurrent ? 'ring-4 ring-indigo-50' : ''}
                    `}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : step.number}
                  </div>
                  <span
                    className={`
                      text-[10px] uppercase tracking-widest font-bold
                      ${isCurrent ? 'text-[#6366f1]' : 'text-slate-400'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mb-6 transition-colors ${
                      isCompleted ? 'bg-indigo-100' : 'bg-slate-100'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
