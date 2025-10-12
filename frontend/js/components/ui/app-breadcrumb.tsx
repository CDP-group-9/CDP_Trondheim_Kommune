import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "js/components/ui/breadcrumb"

interface DynamicBreadcrumbProps {
  className?: string
}

export function DynamicBreadcrumb({ className }: DynamicBreadcrumbProps) {
  const location = useLocation()
  const pathParts = location.pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathParts.map((part, index) => {
          const path = "/" + pathParts.slice(0, index + 1).join("/")
          const isLast = index === pathParts.length - 1

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={path}>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}