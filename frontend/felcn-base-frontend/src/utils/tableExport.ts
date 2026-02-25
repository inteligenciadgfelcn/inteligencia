import { downloadExcel } from 'react-export-table-to-excel'

/* CSV */
export function exportToCSV<T>(
  rows: T[],
  headers: string[],
  columns: (keyof T)[],
  fileName: string
) {
  let csv = headers.join(';') + '\n'

  rows.forEach((row) => {
    csv += columns.map((c) => String(row[c] ?? '')).join(';') + '\n'
  })

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${fileName}.csv`
  link.click()
}

/* EXCEL */
export function exportToExcel<T extends Record<string, any>>(
  rows: T[],
  headers: readonly string[],
  columns: readonly (keyof T)[],
  fileName: string
) {
  const body = rows.map((row) => {
    const obj: Record<string, string | number | boolean> = {}

    columns.forEach((c) => {
      obj[c as string] = row[c]
    })

    return obj
  })

  downloadExcel({
    fileName,
    sheet: fileName,
    tablePayload: {
      header: [...headers],   // 👈 CLON
      body,
    },
  })
}

/* PRINT */

export function exportToPrint<T extends Record<string, any>>(
  rows: T[],
 headers: readonly string[],
  columns: readonly (keyof T)[],
  title: string
) {
  let html = `<h2>${title}</h2>`
  html += `<table border="1" style="border-collapse:collapse;width:100%">`

  html += `<thead><tr>`
  headers.forEach((h) => (html += `<th>${h}</th>`))
  html += `</tr></thead><tbody>`

  rows.forEach((row) => {
    html += `<tr>`
    columns.forEach((c) => {
      html += `<td>${row[c] ?? ''}</td>`
    })
    html += `</tr>`
  })

  html += `</tbody></table>`

  const win = window.open('', '', 'width=900,height=700')
  win?.document.write(html)
  win?.document.close()
  win?.print()
}