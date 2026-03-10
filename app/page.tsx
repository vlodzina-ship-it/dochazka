import React, { useMemo, useState } from "react";

const employeesSeed = [
  {
    id: 1,
    name: "Petra Řezníčková Kunovská",
    weeklyHours: 20,
    annualLeaveDays: 10,
    annualLeaveHours: 80,
    offices: ["Osoblaha", "Vysoká"],
    schedule: {
      po: [
        { office: "Osoblaha", from: "08:00", to: "12:00" },
        { office: "Vysoká", from: "13:00", to: "16:00" },
      ],
      ut: [],
      st: [
        { office: "Osoblaha", from: "08:00", to: "12:00" },
        { office: "Vysoká", from: "13:00", to: "16:00" },
      ],
      ct: [],
      pa: [],
    },
  },
  {
    id: 2,
    name: "Andrea Agustýnová",
    weeklyHours: 40,
    annualLeaveDays: 20,
    annualLeaveHours: 160,
    offices: ["Dívčí Hrad", "Slezské Pavlovice", "Home office"],
    schedule: {
      po: [{ office: "Dívčí Hrad", from: "08:00", to: "15:00" }],
      ut: [{ office: "Slezské Pavlovice", from: "08:00", to: "15:00" }],
      st: [{ office: "Dívčí Hrad", from: "08:00", to: "15:00" }],
      ct: [{ office: "Slezské Pavlovice", from: "08:00", to: "15:00" }],
      pa: [{ office: "Home office", from: "08:00", to: "16:00" }],
    },
  },
  {
    id: 3,
    name: "Jana Sulková",
    weeklyHours: 40,
    annualLeaveDays: 20,
    annualLeaveHours: 160,
    offices: ["Dle potřeby"],
    schedule: {
      po: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      ut: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      st: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      ct: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      pa: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
    },
  },
  {
    id: 4,
    name: "Pavlína Chovančáková",
    weeklyHours: 20,
    annualLeaveDays: 10,
    annualLeaveHours: 80,
    offices: ["Hlinka"],
    schedule: {
      po: [{ office: "Hlinka", from: "14:00", to: "18:00" }],
      ut: [],
      st: [{ office: "Hlinka", from: "14:00", to: "18:00" }],
      ct: [],
      pa: [],
    },
  },
  {
    id: 5,
    name: "Lucie Nováková",
    weeklyHours: 40,
    annualLeaveDays: 20,
    annualLeaveHours: 160,
    offices: ["Dle potřeby"],
    schedule: {
      po: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      ut: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      st: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      ct: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
      pa: [{ office: "Dle potřeby", from: "08:00", to: "16:00" }],
    },
  },
];

const attendanceSeed = [
  { id: 1, employeeId: 1, date: "2026-03-10", office: "Osoblaha", checkIn: "08:01", checkOut: "12:02", breakMinutes: 0, type: "práce" },
  { id: 2, employeeId: 2, date: "2026-03-10", office: "Slezské Pavlovice", checkIn: "08:00", checkOut: "15:01", breakMinutes: 30, type: "práce" },
  { id: 3, employeeId: 3, date: "2026-03-10", office: "Dle potřeby", checkIn: "08:03", checkOut: "16:05", breakMinutes: 30, type: "práce" },
];

const leaveSeed = [
  { id: 1, employeeId: 1, dateFrom: "2026-03-16", dateTo: "2026-03-16", hours: 7, status: "čeká" },
  { id: 2, employeeId: 4, dateFrom: "2026-03-18", dateTo: "2026-03-18", hours: 4, status: "schváleno" },
];

const dayKeys = ["ne", "po", "ut", "st", "ct", "pa", "so"];
const shortDays = ["Po", "Út", "St", "Čt", "Pá"];
const workKeys = ["po", "ut", "st", "ct", "pa"];

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToLabel(value) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}:${String(m).padStart(2, "0")}`;
}

function plannedMinutesForDate(employee, date) {
  const key = dayKeys[new Date(date).getDay()];
  const blocks = employee.schedule[key] || [];
  return blocks.reduce((sum, block) => sum + (toMinutes(block.to) - toMinutes(block.from)), 0);
}

function scheduleLabel(blocks) {
  if (!blocks || blocks.length === 0) return "—";
  return blocks.map((b) => `${b.office} ${b.from}-${b.to}`).join(" • ");
}

function cardStyle() {
  return "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";
}

export default function Page() {
  const [employees] = useState(employeesSeed);
  const [attendance, setAttendance] = useState(attendanceSeed);
  const [leaveRequests, setLeaveRequests] = useState(leaveSeed);
  const [activeEmployeeId, setActiveEmployeeId] = useState(1);
  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: 1,
    date: "2026-03-10",
    office: "Osoblaha",
    checkIn: "08:00",
    checkOut: "16:00",
    breakMinutes: 30,
    type: "práce",
  });
  const [leaveForm, setLeaveForm] = useState({
    employeeId: 1,
    dateFrom: "2026-03-20",
    dateTo: "2026-03-20",
    hours: 7,
  });

  const selectedEmployee = employees.find((e) => e.id === Number(activeEmployeeId)) || employees[0];

  const employeeSummary = useMemo(() => {
    return employees.map((employee) => {
      const used = leaveRequests
        .filter((item) => item.employeeId === employee.id && item.status === "schváleno")
        .reduce((sum, item) => sum + Number(item.hours), 0);
      return {
        ...employee,
        usedLeaveHours: used,
        remainingLeaveHours: employee.annualLeaveHours - used,
      };
    });
  }, [employees, leaveRequests]);

  const attendanceRows = useMemo(() => {
    return attendance.map((item) => {
      const employee = employees.find((e) => e.id === item.employeeId);
      const worked = toMinutes(item.checkOut) - toMinutes(item.checkIn) - Number(item.breakMinutes || 0);
      const planned = employee ? plannedMinutesForDate(employee, item.date) : 0;
      return {
        ...item,
        employeeName: employee?.name || "—",
        workedLabel: minutesToLabel(worked),
        plannedLabel: minutesToLabel(planned),
        balanceLabel: minutesToLabel(worked - planned),
      };
    });
  }, [attendance, employees]);

  function saveAttendance(e) {
    e.preventDefault();
    setAttendance((prev) => [{ id: Date.now(), ...attendanceForm, employeeId: Number(attendanceForm.employeeId) }, ...prev]);
  }

  function saveLeave(e) {
    e.preventDefault();
    setLeaveRequests((prev) => [{ id: Date.now(), ...leaveForm, employeeId: Number(leaveForm.employeeId), status: "čeká" }, ...prev]);
  }

  function approveLeave(id) {
    setLeaveRequests((prev) => prev.map((row) => (row.id === id ? { ...row, status: "schváleno" } : row)));
  }

  function rejectLeave(id) {
    setLeaveRequests((prev) => prev.map((row) => (row.id === id ? { ...row, status: "zamítnuto" } : row)));
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Docházkový systém organizace</h1>
          <p className="text-slate-600">Praktický základ aplikace pro Vercel: docházka, rozvrhy, kanceláře a dovolená v hodinách.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className={cardStyle()}>
            <div className="text-sm text-slate-500">Zaměstnanci</div>
            <div className="mt-2 text-3xl font-bold">{employees.length}</div>
          </div>
          <div className={cardStyle()}>
            <div className="text-sm text-slate-500">Čekající žádosti</div>
            <div className="mt-2 text-3xl font-bold">{leaveRequests.filter((x) => x.status === "čeká").length}</div>
          </div>
          <div className={cardStyle()}>
            <div className="text-sm text-slate-500">Dnešní záznamy</div>
            <div className="mt-2 text-3xl font-bold">{attendance.filter((x) => x.date === "2026-03-10").length}</div>
          </div>
          <div className={cardStyle()}>
            <div className="text-sm text-slate-500">Kanceláře / místa</div>
            <div className="mt-2 text-3xl font-bold">7</div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className={cardStyle()}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Zaměstnanci a dovolená</h2>
                <select
                  className="rounded-xl border border-slate-300 px-3 py-2"
                  value={activeEmployeeId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const employee = employees.find((x) => x.id === id);
                    setActiveEmployeeId(id);
                    setAttendanceForm((s) => ({ ...s, employeeId: id, office: employee?.offices?.[0] || "" }));
                    setLeaveForm((s) => ({ ...s, employeeId: id, hours: employee ? plannedMinutesForDate(employee, s.dateFrom) / 60 : s.hours }));
                  }}
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-lg font-semibold">{selectedEmployee.name}</div>
                <div className="mt-1 text-sm text-slate-600">Úvazek {selectedEmployee.weeklyHours} h týdně • Dovolená {selectedEmployee.annualLeaveHours} h ročně</div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {employeeSummary.filter((x) => x.id === selectedEmployee.id).map((emp) => (
                    <>
                      <div className="rounded-2xl bg-white p-4">
                        <div className="text-sm text-slate-500">Vyčerpáno</div>
                        <div className="text-2xl font-bold">{emp.usedLeaveHours} h</div>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <div className="text-sm text-slate-500">Zbývá</div>
                        <div className="text-2xl font-bold">{emp.remainingLeaveHours} h</div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left">
                        {shortDays.map((day) => <th key={day} className="py-2 pr-4">{day}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {workKeys.map((key) => (
                          <td key={key} className="py-3 pr-4 align-top text-slate-700">{scheduleLabel(selectedEmployee.schedule[key])}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={cardStyle()}>
              <h2 className="mb-4 text-xl font-semibold">Denní bilance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-2 pr-4">Datum</th>
                      <th className="py-2 pr-4">Zaměstnanec</th>
                      <th className="py-2 pr-4">Kancelář</th>
                      <th className="py-2 pr-4">Odpracováno</th>
                      <th className="py-2 pr-4">Plán</th>
                      <th className="py-2 pr-4">Bilance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100">
                        <td className="py-3 pr-4">{row.date}</td>
                        <td className="py-3 pr-4">{row.employeeName}</td>
                        <td className="py-3 pr-4">{row.office}</td>
                        <td className="py-3 pr-4">{row.workedLabel}</td>
                        <td className="py-3 pr-4">{row.plannedLabel}</td>
                        <td className="py-3 pr-4 font-medium">{row.balanceLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={cardStyle()}>
              <h2 className="mb-4 text-xl font-semibold">Nový záznam docházky</h2>
              <form onSubmit={saveAttendance} className="space-y-3">
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2" value={attendanceForm.employeeId} onChange={(e) => setAttendanceForm((s) => ({ ...s, employeeId: Number(e.target.value) }))}>
                  {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
                </select>
                <input className="w-full rounded-xl border border-slate-300 px-3 py-2" type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm((s) => ({ ...s, date: e.target.value }))} />
                <input className="w-full rounded-xl border border-slate-300 px-3 py-2" value={attendanceForm.office} onChange={(e) => setAttendanceForm((s) => ({ ...s, office: e.target.value }))} placeholder="Kancelář" />
                <div className="grid grid-cols-3 gap-3">
                  <input className="rounded-xl border border-slate-300 px-3 py-2" type="time" value={attendanceForm.checkIn} onChange={(e) => setAttendanceForm((s) => ({ ...s, checkIn: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2" type="time" value={attendanceForm.checkOut} onChange={(e) => setAttendanceForm((s) => ({ ...s, checkOut: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2" type="number" value={attendanceForm.breakMinutes} onChange={(e) => setAttendanceForm((s) => ({ ...s, breakMinutes: Number(e.target.value) }))} placeholder="Pauza" />
                </div>
                <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">Uložit docházku</button>
              </form>
            </div>

            <div className={cardStyle()}>
              <h2 className="mb-4 text-xl font-semibold">Žádost o dovolenou</h2>
              <form onSubmit={saveLeave} className="space-y-3">
                <select className="w-full rounded-xl border border-slate-300 px-3 py-2" value={leaveForm.employeeId} onChange={(e) => setLeaveForm((s) => ({ ...s, employeeId: Number(e.target.value) }))}>
                  {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input className="rounded-xl border border-slate-300 px-3 py-2" type="date" value={leaveForm.dateFrom} onChange={(e) => setLeaveForm((s) => ({ ...s, dateFrom: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 px-3 py-2" type="date" value={leaveForm.dateTo} onChange={(e) => setLeaveForm((s) => ({ ...s, dateTo: e.target.value }))} />
                </div>
                <input className="w-full rounded-xl border border-slate-300 px-3 py-2" type="number" value={leaveForm.hours} onChange={(e) => setLeaveForm((s) => ({ ...s, hours: Number(e.target.value) }))} placeholder="Počet hodin" />
                <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white">Odeslat žádost</button>
              </form>
            </div>

            <div className={cardStyle()}>
              <h2 className="mb-4 text-xl font-semibold">Schvalování dovolené</h2>
              <div className="space-y-3">
                {leaveRequests.map((request) => {
                  const employee = employees.find((x) => x.id === request.employeeId);
                  return (
                    <div key={request.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="font-medium">{employee?.name}</div>
                      <div className="mt-1 text-sm text-slate-600">{request.dateFrom} až {request.dateTo} • {request.hours} h</div>
                      <div className="mt-2 text-sm">Stav: <span className="font-medium">{request.status}</span></div>
                      {request.status === "čeká" ? (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => approveLeave(request.id)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">Schválit</button>
                          <button onClick={() => rejectLeave(request.id)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">Zamítnout</button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
