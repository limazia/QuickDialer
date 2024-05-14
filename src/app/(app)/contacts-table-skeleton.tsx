import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function ContactsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="w-[270px] h-[20px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-[361px] h-[20px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-[238px] h-[20px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="w-[135px] h-[20px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
