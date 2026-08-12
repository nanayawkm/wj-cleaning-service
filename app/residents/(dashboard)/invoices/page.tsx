import { PageHeader } from "../ui"
import { InvoiceList } from "./invoice-list"
import { getInvoices, getPickerCustomers, getServiceItems } from "./queries"

export const dynamic = "force-dynamic"

export default async function InvoicesPage() {
  const [invoices, customers, items] = await Promise.all([
    getInvoices(),
    getPickerCustomers(),
    getServiceItems(),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Invoices"
        hint="Make one on the spot, share the PDF, done. Numbering continues from Digiboox."
      />
      <InvoiceList invoices={invoices} customers={customers} items={items} />
    </div>
  )
}
