"use client";

import { ChangeEvent, ComponentProps, FormEvent, useState } from "react";
import { Paintbrush } from "lucide-react";
import { HexColorPicker } from "react-colorful";

import { cn } from "@/shared/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PickerColorProps {
  name: string;
  value: string;
  onChange?: (value: string) => void;
}

export function PickerColor({ name, value, onChange }: PickerColorProps) {
  const [background, setBackground] = useState("");

  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
  ];

  const handleColor = (newValue: string) => {
    setBackground(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[170px] justify-start text-left font-normal",
              !background && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {background ? (
                <div
                  className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                  style={{ background }}
                ></div>
              ) : (
                <Paintbrush className="h-4 w-4" />
              )}
              <div className="truncate flex-1">
                {background ? background : "Escolha uma cor"}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <div className="flex items-center flex-wrap gap-1">
            {solids.map((color) => (
              <div
                key={color}
                style={{ background: color }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => handleColor(color)}
              />
            ))}
          </div>

          <div className="my-3 w-full">
            <HexColorPicker
              color={background}
              onChange={(color) => handleColor(color)}
            />
          </div>

          <Input
            id="custom"
            className="col-span-2 h-8"
            onChange={(e) => handleColor(e.currentTarget.value)}
            name={name}
            value={background} // Set input value from state
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
