import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, Search } from "lucide-react";

interface CustomSelectProps {
    value: string | undefined;
    onChange: (value: string) => void;
    options: string[];
    label?: string;
    placeholder?: string;
}

const CustomSelect = ({
    value,
    onChange,
    options,
    placeholder = "Select...",
}: CustomSelectProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full">
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                    <button
                        className="w-full inline-flex items-center justify-between px-4 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        aria-expanded={open}
                    >
                        <span className={`truncate ${!value ? "text-neutral-400" : ""}`}>
                            {value || placeholder}
                        </span>
                        <ChevronDown size={18} className="text-neutral-400 opacity-50" />
                    </button>
                </Popover.Trigger>

                <Popover.Content
                    className="w-[var(--radix-popover-trigger-width)] p-0 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50"
                    align="start"
                    sideOffset={5}
                >
                    <CommandPrimitive className="flex flex-col w-full text-white">
                        <div className="flex items-center px-3 border-b border-neutral-800">
                            <Search className="w-4 h-4 text-neutral-500 mr-2" />
                            <CommandPrimitive.Input
                                placeholder="Search..."
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 text-white"
                            />
                        </div>

                        <CommandPrimitive.List className="max-h-[200px] overflow-y-auto overflow-x-hidden p-1 no-scrollbar scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                            <CommandPrimitive.Empty className="py-6 text-center text-sm text-neutral-500">
                                No results found.
                            </CommandPrimitive.Empty>
                            <CommandPrimitive.Group>
                                {options.map((option) => (
                                    <CommandPrimitive.Item
                                        key={option}
                                        value={option}
                                        onSelect={() => {
                                            onChange(option);
                                            setOpen(false);
                                        }}
                                        className={`relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2.5 text-sm outline-none ${value === option
                                                ? "text-cyan-400 bg-cyan-500/10" 
                                                : "text-neutral-300 data-[selected='true']:bg-neutral-800 data-[selected='true']:text-white" 
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full px-2">
                                            <span>{option}</span>
                                            {value === option && <Check size={14} className="text-cyan-400" />}
                                        </div>
                                    </CommandPrimitive.Item>
                                ))}
                            </CommandPrimitive.Group>
                        </CommandPrimitive.List>
                    </CommandPrimitive>
                </Popover.Content>
            </Popover.Root>
        </div>
    );
};

export default CustomSelect;