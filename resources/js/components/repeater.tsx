import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RepeaterProps<T> {
    name: string
    value?: T[]
    onChange: (event: {
        target: {
            name: string
            value: T[]
        }
    }) => void
    createItem: () => T
    renderRow: (
        item: T,
        index: number,
        update: (value: Partial<T>) => void
    ) => ReactNode
    minItems?: number
    maxItems?: number
}

export function Repeater<T>({
    name,
    value = [],
    onChange,
    createItem,
    renderRow,
    minItems = 0,
    maxItems,
}: RepeaterProps<T>) {
    const emitChange = (val: T[]) => {
        onChange({
            target: {
                name,
                value: val,
            },
        })
    }

    const addItem = () => {
        if (maxItems && value.length >= maxItems) return
        emitChange([...value, createItem()])
    }

    const removeItem = (index: number) => {
        if (value.length <= minItems) return
        emitChange(value.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, updates: Partial<T>) => {
        emitChange(
            value.map((item, i) =>
                i === index ? { ...item, ...updates } : item
            )
        )
    }

    const canRemove = value.length > minItems
    const canAdd = maxItems ? value.length < maxItems : true

    return (
        <div className="space-y-4">
            {value.length > 0 && (
                <div className="space-y-3">
                    {value.map((item, index) => (
                        <Card
                            key={index}
                            className={cn(
                                "group relative overflow-hidden transition-all duration-200",
                                "border-border/50 hover:border-border hover:shadow-md",
                                "bg-card"
                            )}
                        >
                            <div className="p-5 space-y-4">
                                {/* Header with item number and remove button */}
                                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                            {index + 1}
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Item {index + 1}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(index)}
                                        disabled={!canRemove}
                                        className={cn(
                                            "h-8 w-8 transition-all duration-200",
                                            "hover:bg-destructive/10 hover:text-destructive",
                                            "disabled:opacity-40 disabled:cursor-not-allowed",
                                            "group-hover:opacity-100"
                                        )}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Content area */}
                                <div className="pt-2">
                                    {renderRow(item, index, (updates) =>
                                        updateItem(index, updates)
                                    )}
                                </div>
                            </div>

                            {/* Subtle accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </Card>
                    ))}
                </div>
            )}

            {/* Add button */}
            <Button
                type="button"
                variant="outline"
                onClick={addItem}
                disabled={!canAdd}
                className={cn(
                    "w-full transition-all duration-200",
                    // "border-dashed border-2",
                    "hover:border-primary/50 hover:bg-primary/5",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    value.length === 0 && "mt-0"
                )}
            >
                <Plus className="h-4 w-4 mr-2" />
                {value.length === 0 ? "Add First Item" : "Add Another Item"}
                {maxItems && (
                    <span className="ml-2 text-xs text-muted-foreground">
                        ({value.length}/{maxItems})
                    </span>
                )}
            </Button>
        </div>
    )
}
