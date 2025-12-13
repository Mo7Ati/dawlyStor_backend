import * as React from "react"
import { ChevronDownIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

export interface MultiSelectOption {
  label: string
  value: string | number
  disabled?: boolean
  [key: string]: any // Allow additional properties
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: (string | number)[]
  onSelectedChange: (selected: (string | number)[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  maxCount?: number
  className?: string
  disabled?: boolean
  showBadges?: boolean
  renderOption?: (option: MultiSelectOption) => React.ReactNode
  renderBadge?: (option: MultiSelectOption, onRemove: () => void) => React.ReactNode
}

export function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  maxCount = 3,
  className,
  disabled = false,
  showBadges = true,
  renderOption,
  renderBadge,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => selected.includes(option.value))
  }, [options, selected])

  const filteredOptions = React.useMemo(() => {
    // Filter out selected options
    const unselectedOptions = options.filter((option) => !selected.includes(option.value))

    if (!search) return unselectedOptions
    return unselectedOptions.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search, selected])

  const handleToggle = (value: string | number) => {
    if (disabled) return

    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]

    onSelectedChange(newSelected)
  }

  const handleRemove = (value: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    onSelectedChange(selected.filter((item) => item !== value))
  }

  const displayText = React.useMemo(() => {
    if (selected.length === 0) return placeholder
    if (selected.length === 1) {
      const option = options.find((opt) => opt.value === selected[0])
      return option?.label || placeholder
    }
    return `${selected.length} items selected`
  }, [selected, options, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal",
            !selected.length && "text-muted-foreground",
            selected.length > 0 && showBadges && "min-h-[2.5rem] h-auto py-2",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {showBadges && selected.length > 0 ? (
              <>
                {selectedOptions.map((option) => {
                  if (renderBadge) {
                    return (
                      <React.Fragment key={option.value}>
                        {renderBadge(option, () => handleRemove(option.value, {} as React.MouseEvent))}
                      </React.Fragment>
                    )
                  }
                  return (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="mr-1"
                      onClick={(e) => handleRemove(option.value, e)}
                    >
                      {option.label}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-muted p-0.5 transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(option.value, e as any)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => handleRemove(option.value, e)}
                        type="button"
                      >
                        <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )
                })}
              </>
            ) : (
              <span className="truncate">{displayText}</span>
            )}
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isDisabled = option.disabled || disabled

                return (
                  <CommandItem
                    key={option.value}
                    value={String(option.value)}
                    disabled={isDisabled}
                    onSelect={() => !isDisabled && handleToggle(option.value)}
                    className={cn(
                      "cursor-pointer",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center flex-1">
                      {renderOption ? (
                        renderOption(option)
                      ) : (
                        <span className="flex-1">{option.label}</span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

