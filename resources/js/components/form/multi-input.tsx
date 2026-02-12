
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type InputHTMLAttributes } from "react";
import { XIcon } from "lucide-react";
import { forwardRef, useState } from "react";

type InputTagsProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
    value: string[];
    onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const MultiInput = forwardRef<HTMLInputElement, InputTagsProps>(
    ({ value, onChange, ...props }, ref) => {
        const [pendingDataPoint, setPendingDataPoint] = useState("");

        const addPendingDataPoint = () => {
            if (pendingDataPoint) {
                const newDataPoints = new Set([...value, pendingDataPoint]);
                onChange(Array.from(newDataPoints));
                setPendingDataPoint("");
            }
        };

        return (
            <>
                <div className="flex">
                    <Input
                        value={pendingDataPoint}
                        onChange={(e) => setPendingDataPoint(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addPendingDataPoint();
                            } else if (e.key === "," || e.key === " ") {
                                e.preventDefault();
                                addPendingDataPoint();
                            }
                        }}
                        className="rounded-r-none"
                        {...props}
                        ref={ref}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        className="rounded-l-none border border-l-0"
                        onClick={addPendingDataPoint}
                    >
                        Add
                    </Button>
                </div>
                <div className="border rounded-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center">
                    {value.map((item: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                            {item}
                            <button
                                type="button"
                                className="w-3 ml-2"
                                onClick={() => {
                                    onChange(value.filter((i: string) => i !== item));
                                }}
                            >
                                <XIcon className="w-3 cursor-pointer" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </>
        );
    }
);

export default MultiInput;
