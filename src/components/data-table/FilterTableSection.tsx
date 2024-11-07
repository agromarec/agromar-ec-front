import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from 'react';

interface FilterTableSectionProps<TData> {
  table: Table<TData>;
}

export const FilterTableSection = <TData,>({ table }: FilterTableSectionProps<TData>) => {
  const [selected, setSelected] = useState<string>(table.getAllColumns()[0].id);


  // const tableColumsNames = table.getColumn('amount')

  return (
    <div className="flex items-center py-4">
      <Select defaultValue={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-[180px] focus:outline-none focus:ring-0 focus:ring-transparent rounded-r-none">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {
              table.getAllColumns().filter((column) => column.getCanFilter()).map((column) => {
                return (
                  <SelectItem key={column.id} value={column.id}>
                    {column.id}
                  </SelectItem>
                )
              })
            }
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input
        placeholder={`Filtrar por ${selected}`}
        value={(table.getColumn(selected)?.getFilterValue() as string) ?? ""}
        className="max-w-sm rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(event) =>{
          table.getColumn(selected)?.setFilterValue(event.target.value)
        }
        }
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columnas <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
