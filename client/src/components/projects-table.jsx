import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ProjectsTable({ projects, columns, type }) {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.key)
  );

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const filteredColumns = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );

  // Paginer les projets
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = projects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Générer les éléments de pagination
  const paginationItems = [];
  const maxPaginationItems = 5;

  let startPage = Math.max(1, page - Math.floor(maxPaginationItems / 2));
  const endPage = Math.min(totalPages, startPage + maxPaginationItems - 1);

  if (endPage - startPage + 1 < maxPaginationItems) {
    startPage = Math.max(1, endPage - maxPaginationItems + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Card className="w-full flex flex-col shadow-xs">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-normal mb-[5px]">
              Projets
            </CardTitle>
            <CardDescription>
              Affichage de {paginatedProjects.length} sur {projects.length}{" "}
              projets
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto mt-2 sm:mt-0"
              >
                <Settings className="mr-2 h-4 w-4" />
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>
                Afficher/Masquer les colonnes
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.includes(column.key)}
                  onCheckedChange={() => toggleColumn(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow-0">
        <div className="max-w-max overflow-hidden border rounded-md">
          <div className="w-full overflow-x-auto" style={{ maxWidth: "100%" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  {filteredColumns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="cursor-pointer whitespace-nowrap border-r last:border-r-0 dark:border-gray-700"
                    >
                      <Button variant="ghost" className="p-0 font-medium">
                        {column.label}
                        {/* <SortIcon field={column.key} /> */}
                      </Button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.length > 0 ? (
                  paginatedProjects.map((project, index) => (
                    <TableRow
                      key={index}
                      onClick={() =>
                        navigate(
                          `/projects/${type == "projects1" ? "1" : "2"}/${
                            project["id"]
                          }`
                        )
                      }
                      className="cursor-pointer"
                    >
                      {filteredColumns.map((column) => (
                        <TableCell
                          key={column.key}
                          className="whitespace-nowrap border-r last:border-r-0 dark:border-gray-700"
                        >
                          {project[column.key]?.toString() || "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={filteredColumns.length}
                      className="h-24 text-center"
                    >
                      Aucun projet trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {paginationItems}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
