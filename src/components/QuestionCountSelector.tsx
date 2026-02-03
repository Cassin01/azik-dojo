import { Button } from '@/components/ui/button'
import type { QuestionCountOption } from '@/hooks/useSettings'

type Props = {
  value: number
  options: readonly QuestionCountOption[]
  onChange: (count: QuestionCountOption) => void
}

export function QuestionCountSelector({ value, options, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-500">Number of words</label>
      <div className="flex gap-2 justify-center">
        {options.map(count => (
          <Button
            key={count}
            variant={value === count ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(count)}
          >
            {count}
          </Button>
        ))}
      </div>
    </div>
  )
}
