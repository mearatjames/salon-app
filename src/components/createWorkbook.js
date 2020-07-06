import Excel from "exceljs";
import { saveAs } from "file-saver";

let createWorkbook = async (rows, columnsHeader, fileName) => {
    
    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet("sheet1");

    worksheet.addTable({
      name: 'Report',
      ref: 'A1',
      headerRow: true,
      totalsRow: true,
      style: {
        showRowStripes: true,
      },
      columns: columnsHeader,
      rows: rows
    })

    const dateCol = worksheet.getColumn(1)
    const serviceCol = worksheet.getColumn(2)
    const customerCol = worksheet.getColumn(3)
    const priceCol = worksheet.getColumn(4)

    dateCol.width = 12
    serviceCol.width = 30
    customerCol.width = 15
    priceCol.width = 12


    // save workbook to disk
  const saveFile = await workbook.xlsx
      .writeBuffer()
      .then(buffer => {
        saveAs(new Blob([buffer]), `${fileName}.xlsx`)
        return true
      })
      .catch(err => err);

    return saveFile
  };

  export default createWorkbook