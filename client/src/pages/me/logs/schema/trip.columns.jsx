import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { deleteRow } from "../Log";

export const cols = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      return row.getValue("id");
    },
  },
  {
    accessorKey: "origin",
    header: "Origin",
    cell: ({ row }) => {
      const value = row.getValue("origin");
      return value.length > 50 ? value.slice(0, 50) + "..." : value;
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => {
      const value = row.getValue("destination");
      return value.length > 50 ? value.slice(0, 50) + "..." : value;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      return new Date(value).toLocaleString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="w-full h-full flex items-center"
                to={`/me/trip/${trip.tripId}`}
              >
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 cursor-pointer"
              onClick={async () => {
                await deleteRow(trip.id);
                window.location.reload();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
