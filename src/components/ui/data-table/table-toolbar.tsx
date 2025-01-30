// import { Button } from '@/components/ui/button'
// import { DataTableFacetedFilter } from '@/components/ui/data-table/faceted-filter'
// import { DataTableViewOptions } from '@/components/ui/data-table/table-view-options'
// import { Input } from '@/components/ui/input'
// import { priorities, statuses } from '@/dummy'
// import { Cross2Icon } from '@radix-ui/react-icons'
// import type { Table } from '@tanstack/react-table'

// interface DataTableToolbarProps<TData> {
//   table: Table<TData>
// }

// export function DataTableToolbar<TData>({
//   table,
// }: DataTableToolbarProps<TData>) {
//   const isFiltered = table.getState().columnFilters.length > 0

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex flex-1 items-center space-x-2">
//         <Input
//           placeholder="Filter email..."
//           value={
//             (table.getColumn('criteria.form')?.getFilterValue() as string) ?? ''
//           }
//           onChange={(event) =>
//             table.getColumn('criteria.form')?.setFilterValue(event.target.value)
//           }
//           className="h-8 w-[150px] lg:w-[250px]"
//         />
//         {table.getColumn('apply_label') && (
//           <DataTableFacetedFilter
//             column={table.getColumn('apply_label')}
//             title="Apply Label"
//             options={statuses}
//           />
//         )}
//         {table.getColumn('priority') && (
//           <DataTableFacetedFilter
//             column={table.getColumn('priority')}
//             title="Priority"
//             options={priorities}
//           />
//         )}
//         {isFiltered && (
//           <Button
//             variant="ghost"
//             onClick={() => table.resetColumnFilters()}
//             className="h-8 px-2 lg:px-3">
//             Reset
//             <Cross2Icon className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <DataTableViewOptions table={table} />
//     </div>
//   )
// }
