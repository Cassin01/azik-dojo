import { Button } from '@/components/ui/button'

type Props = {
  value: boolean
  onChange: (strict: boolean) => void
}

export function StrictModeToggle({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-500">Mode</label>
      <div className="flex gap-2 justify-center">
        <Button
          variant={!value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(false)}
        >
          Normal
        </Button>
        <Button
          variant={value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(true)}
        >
          Strict AZIK
        </Button>
      </div>
    </div>
  )
}
