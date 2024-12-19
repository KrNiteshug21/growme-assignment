import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
import { Paginator } from "primereact/paginator";

interface Data {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions?: string | undefined;
  date_start: number;
  date_end: number;
}

interface Page {
  first: number;
  rows: number;
}

export default function CheckboxRowSelectionDemo() {
  const uri = "https://api.artic.edu/api/v1/artworks";
  const [products, setProducts] = useState<Data[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Data[]>([]);
  const [rowClick, setRowClick] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<Page>({ first: 1, rows: 12 });
  const [totalPages, setTotalPages] = useState<number>(0);
  console.log("selectedProducts", selectedProducts);

  console.log("products", products);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${uri}?page=1`);
      const data = await response.json();
      console.log("data", data);
      setProducts(data.data);
      setLoading(false);
      setTotalPages(data.pagination.total_pages);
    };

    fetchData();
  }, []);

  const handlePageChange = async (event: {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
  }) => {
    console.log("event", event);
    const response = await fetch(`${uri}?page=${event.page + 1}`);
    const data = await response.json();
    console.log("data", data);
    setProducts(data.data);
    setLoading(false);
    setTotalPages(data.pagination.total_pages);
    setPage({ first: event.first, rows: event.rows });
  };

  return (
    <div className="card">
      <div className="flex justify-content-center align-items-center gap-2 mb-4">
        <InputSwitch
          inputId="input-rowclick"
          checked={rowClick}
          onChange={(e) => setRowClick(e.value)}
        />
        <label htmlFor="input-rowclick">Row Click</label>
      </div>
      <DataTable
        showGridlines
        value={products}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedProducts}
        loading={loading}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          //   headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="title" header="title" style={{ width: "20%" }}></Column>
        <Column
          field="place_of_origin"
          header="place_of_origin"
          style={{ width: "5%" }}
        ></Column>
        <Column
          field="artist_display"
          header="artist_display"
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="inscriptions"
          header="inscriptions"
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="date_start"
          header="date_start"
          style={{ width: "5%" }}
        ></Column>
        <Column
          field="date_end"
          header="date_end"
          style={{ width: "5%" }}
        ></Column>
      </DataTable>
      <Paginator
        first={page.first}
        rows={page.rows}
        totalRecords={totalPages * page.rows}
        rowsPerPageOptions={[6, 12, 18, 24]}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
