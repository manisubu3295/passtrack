import { getLeads, getStorageMode } from '@/lib/leads';

const formatDate = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-SG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Singapore',
  }).format(date);
};

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  const storage = getStorageMode();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">PassTrack Leads</h1>
          <p className="mt-2 text-sm text-slate-600">
            Total submissions: <span className="font-semibold">{leads.length}</span> • Storage:{' '}
            <span className="font-semibold uppercase">{storage}</span>
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Employees</th>
                  <th className="px-4 py-3">Submitted (SGT)</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No leads yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={`${lead.email}-${lead.createdAt}`} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                      <td className="px-4 py-3 text-slate-700">{lead.company}</td>
                      <td className="px-4 py-3 text-slate-700">{lead.email}</td>
                      <td className="px-4 py-3 text-slate-700">{lead.whatsapp || '-'}</td>
                      <td className="px-4 py-3 text-slate-700">{lead.employees}</td>
                      <td className="px-4 py-3 text-slate-700">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
