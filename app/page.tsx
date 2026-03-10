export default function Home() {

const employees = [
 {name:"Petra Řezníčková Kunovská", office:"Osoblaha / Vysoká", leave:10},
 {name:"Andrea Agustýnová", office:"Dívčí Hrad / Slezské Pavlovice / Home office", leave:20},
 {name:"Jana Sulková", office:"kancelář dle potřeby", leave:20},
 {name:"Pavlína Chovančáková", office:"Hlinka", leave:10},
 {name:"Lucie Nováková", office:"kancelář dle potřeby", leave:20},
];

return (
<div style={{fontFamily:"Arial", padding:40}}>
<h1>Docházkový systém</h1>

<table border="1" cellPadding="10">
<thead>
<tr>
<th>Zaměstnanec</th>
<th>Kancelář</th>
<th>Dovolená (dny)</th>
</tr>
</thead>

<tbody>
{employees.map((e,i)=>(
<tr key={i}>
<td>{e.name}</td>
<td>{e.office}</td>
<td>{e.leave}</td>
</tr>
))}
</tbody>

</table>
</div>
)

}
