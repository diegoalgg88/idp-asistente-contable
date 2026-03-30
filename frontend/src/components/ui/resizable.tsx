import * as ResizablePrimitive from "react-resizable-panels"
import * as React from "react"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Group> & { direction?: "horizontal" | "vertical" }) => (
  <ResizablePrimitive.Group
    data-slot="resizable-panel-group"
    className={cn(
      "flex h-full w-full",
      props.direction === "vertical" ? "flex-col" : "flex-row",
      className
    )}
    {...props}
  />
)

const ResizablePanel = React.forwardRef<
  ResizablePrimitive.PanelImperativeHandle,
  ResizablePrimitive.PanelProps
>(({ ...props }, ref) => (
  <ResizablePrimitive.Panel
    panelRef={ref}
    data-slot="resizable-panel"
    {...props}
  />
))
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Separator>,
  ResizablePrimitive.SeparatorProps & {
    withHandle?: boolean
  }
>(({ withHandle, className, ...props }, ref) => (
  <ResizablePrimitive.Separator
    elementRef={ref}
    data-slot="resizable-handle"
    className={cn(
      "relative flex w-3 items-center justify-center bg-border/20 hover:bg-primary/40 active:bg-primary z-[100] cursor-col-resize pointer-events-auto group transition-all",
      "after:absolute after:inset-y-0 after:left-1/2 after:w-12 after:-translate-x-1/2 after:pointer-events-auto",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-6 w-1 shrink-0 rounded-full bg-primary/40 group-hover:bg-primary group-active:bg-primary transition-colors shadow-glow" />
    )}
  </ResizablePrimitive.Separator>
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
export { usePanelRef } from "react-resizable-panels"
export type { PanelImperativeHandle as ImperativePanelHandle } from "react-resizable-panels"
