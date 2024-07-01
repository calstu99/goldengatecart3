"use client";
import React, { useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import { DownloadTableExcel } from "react-export-table-to-excel";

const AdminOrdersTable = ({ columns, data, setOrders }) => {
  const tableRef = useRef(null);

  return (
    <div>
      <DownloadTableExcel
        filename="orders"
        sheet="orders"
        currentTableRef={tableRef.current}
      >
        <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
          Export to Excel
        </button>
      </DownloadTableExcel>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnFilters
        enablePagination
        enableSorting
        enableColumnOrdering
        renderRowOutsideOverlay
        renderRowOutsideOverlayStart={<tr ref={tableRef} />}
      />
    </div>
  );
};

export default AdminOrdersTable;