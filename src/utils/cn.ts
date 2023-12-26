import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export default function cn(...args: any[]) {
  return clsx(...args.map((arg) => twMerge(arg)))
}
