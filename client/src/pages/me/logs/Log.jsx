import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/data-table";
import { Navbar } from "@/components/navbar";
import { api } from "@/lib/myapi";
import { FilterIcon } from "lucide-react";
import { cols } from "./schema/trip.columns";
import { isLogged } from "@/lib/hanko";

export const deleteRow = async (id) => {
  const res = await api.delete(`/ai/complete/${id}`);
  return res;
};

export function LogPage() {
  const router = useNavigate();
  const [history, setHistory] = useState();

  if (!isLogged()) {
    router("/auth");
  }

  useEffect(() => {
    (async () => {
      try {
        const history = await api.post("/ai/complete/log");
        setHistory(history.data);
      } catch (e) {
        router("/auth?expired=1");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col flex-1 justify-center items-center">
        {history && (
          <div className="flex flex-col justify-center items-end relative">
            <DataTable columns={cols} data={history} />
            <DropdownMenu>
              <DropdownMenuTrigger className="absolute top-[4.85rem] right-2">
                <FilterIcon className="text-xl text-muted-foreground" />
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
