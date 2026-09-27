import { useRef, useState } from "react";
import { Plus, Trash2, Pencil, User, Phone, Printer, Save } from "lucide-react";

type SaleItem = {
  id: number;
  name: string;
  category: string;
  brand: string;
  unit: string;
  price: number;
  qty: number;
  discount: number;
  gst: number;
};

const createEmptyItem = (): SaleItem => ({
  id: Date.now() + Math.random(),
  name: "",
  category: "",
  brand: "",
  unit: "",
  price: 0,
  qty: 1,
  discount: 0,
  gst: 0,
});

export function SalesPage() {
  const [items, setItems] = useState<SaleItem[]>([createEmptyItem()]);
  const [customer, setCustomer] = useState({
    phone: "",
    name: "",
    address: "",
  });
  const [paymentMode, setPaymentMode] = useState("Cash");
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // --------------------------------------------------
  // UPDATE ITEM
  // --------------------------------------------------
  const updateItem = (id: number, field: keyof SaleItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (
          field === "name" ||
          field === "category" ||
          field === "brand" ||
          field === "unit"
        ) {
          return { ...item, [field]: value };
        }
        return { ...item, [field]: Number(value) || 0 };
      })
    );
  };

  // --------------------------------------------------
  // ADD NEW ROW
  // --------------------------------------------------
  const addItem = () => {
    const newItem = createEmptyItem();
    setItems((prev) => [...prev, newItem]);
    setTimeout(() => {
      inputRefs.current[`name-${newItem.id}`]?.focus();
    }, 50);
  };

  // --------------------------------------------------
  // EDIT ROW (focus it for editing)
  // --------------------------------------------------
  const editItem = (id: number) => {
    inputRefs.current[`name-${id}`]?.focus();
  };

  // --------------------------------------------------
  // DELETE ROW
  // --------------------------------------------------
  const removeItem = (id: number) => {
    setItems((prev) => {
      if (prev.length === 1) {
        return [createEmptyItem()];
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    item: SaleItem,
    field: keyof SaleItem
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (field === "gst") {
      addItem();
      return;
    }

    const fieldOrder: (keyof SaleItem)[] = [
      "name",
      "category",
      "brand",
      "unit",
      "price",
      "qty",
      "discount",
      "gst",
    ];

    const currentIndex = fieldOrder.indexOf(field);
    const nextField = fieldOrder[currentIndex + 1];
    if (nextField) {
      inputRefs.current[`${nextField}-${item.id}`]?.focus();
    }
  };

  // --------------------------------------------------
  // CALCULATIONS
  // --------------------------------------------------
  const calculateAmount = (item: SaleItem) => {
    const itemTotal = item.price * item.qty;
    const discountAmount = (itemTotal * item.discount) / 100;
    const taxableAmount = itemTotal - discountAmount;
    const gstAmount = (taxableAmount * item.gst) / 100;
    return {
      itemTotal,
      discountAmount,
      gstAmount,
      finalAmount: taxableAmount + gstAmount,
    };
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const totalDiscount = items.reduce(
    (total, item) => total + (item.price * item.qty * item.discount) / 100,
    0
  );

  const totalGST = items.reduce((total, item) => {
    const itemTotal = item.price * item.qty;
    const discountAmount = (itemTotal * item.discount) / 100;
    const taxableAmount = itemTotal - discountAmount;
    return total + (taxableAmount * item.gst) / 100;
  }, 0);

  const grandTotal = subtotal - totalDiscount + totalGST;

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------
  const saveInvoice = () => {
    console.log("Invoice Data:", {
      customer,
      items,
      paymentMode,
      subtotal,
      totalDiscount,
      totalGST,
      grandTotal,
    });
    alert("Invoice saved successfully!");
  };

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------
  return (
    <>
       <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-full items-center justify-between px-5">
          <div>
            <h1 className="text-xl font-bold">New Sale</h1>
            <p className="text-xs text-slate-500">Create new sales invoice</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              type="button"
              onClick={saveInvoice}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            >
              <Save className="h-4 w-4" />
              Save Invoice
            </button>
          </div>
        </div>
      </header>
       <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* ===================================================
          HEADER
      =================================================== */}
   

      {/* ===================================================
          MAIN
      =================================================== */}
      <main className="w-full p-2">
        <div className="grid w-full grid-cols-1 gap-2 xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* =============================================
              LEFT SIDE
          ============================================= */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* TABLE (its own scrollable section) */}
            <div className="w-full max-h-[420px] overflow-x-auto overflow-y-auto">
              <table className="w-full min-w-[1350px] text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800">
                    <th className="w-[260px] px-3 py-3">Item</th>
                    <th className="w-[170px] px-3 py-3">Category</th>
                    <th className="w-[160px] px-3 py-3">Brand</th>
                    <th className="w-[110px] px-3 py-3">Unit</th>
                    <th className="w-[140px] px-3 py-3">Price</th>
                    <th className="w-[110px] px-3 py-3">Qty</th>
                    <th className="w-[140px] px-3 py-3">Discount %</th>
                    <th className="w-[110px] px-3 py-3">GST %</th>
                    <th className="w-[150px] px-3 py-3 text-right">Amount</th>
                    <th className="w-[100px]" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const calculation = calculateAmount(item);
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        {/* ITEM */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`name-${item.id}`] = element;
                            }}
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, item, "name")}
                            placeholder="Enter item name"
                            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white"
                          />
                        </td>

                        {/* CATEGORY */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`category-${item.id}`] =
                                element;
                            }}
                            value={item.category}
                            onChange={(e) =>
                              updateItem(item.id, "category", e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, item, "category")
                            }
                            placeholder="Category"
                            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                          />
                        </td>

                        {/* BRAND */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`brand-${item.id}`] = element;
                            }}
                            value={item.brand}
                            onChange={(e) =>
                              updateItem(item.id, "brand", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, item, "brand")}
                            placeholder="Brand"
                            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                          />
                        </td>

                        {/* UNIT */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`unit-${item.id}`] = element;
                            }}
                            value={item.unit}
                            onChange={(e) =>
                              updateItem(item.id, "unit", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, item, "unit")}
                            placeholder="PCS"
                            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                          />
                        </td>

                        {/* PRICE */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`price-${item.id}`] = element;
                            }}
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(item.id, "price", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, item, "price")}
                            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                          />
                        </td>

                        {/* QTY */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`qty-${item.id}`] = element;
                            }}
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(item.id, "qty", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, item, "qty")}
                            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                          />
                        </td>

                        {/* DISCOUNT */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`discount-${item.id}`] =
                                element;
                            }}
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount}
                            onChange={(e) =>
                              updateItem(item.id, "discount", e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, item, "discount")
                            }
                            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                          />
                        </td>

                        {/* GST */}
                        <td className="px-2 py-2">
                          <input
                            ref={(element) => {
                              inputRefs.current[`gst-${item.id}`] = element;
                            }}
                            type="number"
                            min="0"
                            max="100"
                            value={item.gst}
                            onChange={(e) =>
                              updateItem(item.id, "gst", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, item, "gst")}
                            className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                          />
                        </td>

                        {/* AMOUNT */}
                        <td className="px-2 py-2">
                          <div className="flex h-11 items-center justify-end rounded-md bg-slate-50 px-3 font-semibold dark:bg-slate-800">
                            ₹{calculation.finalAmount.toFixed(2)}
                          </div>
                        </td>

                        {/* EDIT / DELETE */}
                        <td className="px-2 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => editItem(item.id)}
                              title="Edit item"
                              className="flex h-10 w-10 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              title="Delete item"
                              className="flex h-10 w-10 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ADD ITEM — separate section below the scrollable list */}
            <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
              >
                <Plus className="h-4 w-4" />
                Add another item
              </button>
            </div>
          </section>

          {/* =============================================
              CUSTOMER
          ============================================= */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold">Customer</h2>
                  <p className="text-xs text-slate-500">
                    Customer information
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4">
              {/* PHONE */}
              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="h-11 w-full rounded-lg border border-slate-300 pl-10 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>

              {/* NAME */}
              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Customer Name
                </label>
                <input
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  placeholder="Customer name"
                  className="h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Address
                </label>
                <textarea
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  rows={4}
                  placeholder="Customer address"
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>
          </aside>
        </div>

        {/* ===================================================
            FOOTER PAYMENT BAR
        =================================================== */}
        <footer className="mt-2 w-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex w-full flex-wrap items-end gap-4 px-5 py-4">
            {/* INVOICE NUMBER */}
            <div className="flex min-w-[150px] flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                Invoice Number
              </label>
              <input
                type="text"
                value="INV-00001"
                readOnly
                className="h-10 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            {/* PAYMENT TYPE */}
            <div className="flex min-w-[150px] flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                Payment Type
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit">Credit</option>
              </select>
            </div>

            {/* PAYMENT AMOUNT */}
            <div className="flex min-w-[140px] flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                Payment Amount
              </label>
              <input
                type="number"
                min={0}
                value={grandTotal}
                readOnly
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {/* DISCOUNT */}
            <div className="flex min-w-[100px] flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                Discount %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={0}
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {/* GST */}
            <div className="flex min-w-[100px] flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                GST %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={0}
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {/* REMARK */}
            <div className="flex min-w-[200px] flex-1 flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                Remark
              </label>
              <input
                type="text"
                placeholder="Add a note..."
                className="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {/* SAVE */}
            <button
              type="button"
              onClick={saveInvoice}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            >
              <Save className="h-4 w-4" />
              Save Invoice
            </button>
          </div>
        </footer>
      </main>
    </div>
    </>
   
  );
}