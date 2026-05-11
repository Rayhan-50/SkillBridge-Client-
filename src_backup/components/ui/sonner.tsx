"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      gap={10}
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-white drop-shadow-sm" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-white drop-shadow-sm" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "sb-toast",
          success: "sb-toast--success",
          error: "sb-toast--error",
          warning: "sb-toast--warning",
          info: "sb-toast--info",
          title: "sb-toast__title",
          description: "sb-toast__description",
          icon: "sb-toast__icon",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
