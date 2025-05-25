import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Button } from '@/components/shadcnui/button'
import {
  PaginationEllipsis,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Pagination,
} from '@/components/shadcnui/pagination'

interface PaginationProps {
  canPreviousPage: boolean
  canNextPage: boolean
  totalPages: number
  pageIndex: number
  previousPage: () => void
  nextPage: () => void
  firstPage: () => void
  lastPage: () => void
  setPageIndex: (page: number) => void
  className?: string
}

export default function CustomPagination(props: PaginationProps) {
  return (
    <Pagination className={props.className}>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            onClick={props.previousPage}
            disabled={!props.canPreviousPage}
            className="flex gap-2 px-4"
          >
            <CaretLeft weight="bold" />
            Anterior
          </Button>
        </PaginationItem>

        {props.totalPages <= 7
          ? renderPageNumbers(props)
          : renderMoreThanSevenPages(props)}

        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            onClick={props.nextPage}
            disabled={!props.canNextPage}
            className="flex gap-2 px-4"
          >
            Próximo
            <CaretRight weight="bold" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

// Function to render pagination numbers for fewer pages
const renderPageNumbers = (props: PaginationProps) =>
  Array.from({ length: props.totalPages }).map((_, index) => (
    <PaginationItem key={index}>
      <PaginationLink isActive={index === props.pageIndex}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => props.setPageIndex(index)}
        >
          {index + 1}
        </Button>
      </PaginationLink>
    </PaginationItem>
  ))

// Function to render pagination numbers for more than 7 pages
const renderMoreThanSevenPages = (props: PaginationProps) => {
  if (props.pageIndex < 4) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink isActive={index === props.pageIndex}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => props.setPageIndex(index)}
              >
                {index + 1}
              </Button>
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>
            <Button variant="ghost" size="sm" onClick={props.lastPage}>
              {props.totalPages}
            </Button>
          </PaginationLink>
        </PaginationItem>
      </>
    )
  } else if (props.pageIndex > props.totalPages - 5) {
    return (
      <>
        <PaginationItem>
          <PaginationLink>
            <Button variant="ghost" size="sm" onClick={props.firstPage}>
              1
            </Button>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {Array.from({ length: 5 }).map((_, index) => {
          const pageIndex = props.totalPages - 5 + index
          return (
            <PaginationItem key={pageIndex}>
              <PaginationLink isActive={pageIndex === props.pageIndex}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => props.setPageIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              </PaginationLink>
            </PaginationItem>
          )
        })}
      </>
    )
  } else {
    return (
      <>
        <PaginationItem>
          <PaginationLink isActive={props.pageIndex === 0}>
            <Button variant="ghost" size="sm" onClick={props.firstPage}>
              1
            </Button>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => props.setPageIndex(props.pageIndex - 1)}
            >
              {props.pageIndex}
            </Button>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => props.setPageIndex(props.pageIndex)}
            >
              {props.pageIndex + 1}
            </Button>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => props.setPageIndex(props.pageIndex + 1)}
            >
              {props.pageIndex + 2}
            </Button>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={props.pageIndex === props.totalPages - 1}>
            <Button variant="ghost" size="sm" onClick={props.lastPage}>
              {props.totalPages}
            </Button>
          </PaginationLink>
        </PaginationItem>
      </>
    )
  }
}
