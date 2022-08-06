import { Injectable } from "@angular/core";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: "root",
})
export class ReferredService {
  constructor() {}

  createExcelFile(orders: any[], products: any[], excelFileName: string) {
    let workbook = new Excel.Workbook();
    let sheet = workbook.addWorksheet("Pedidos");
    const headers = [
      { header: "Pedido", key: "idorder", width: 10 },
      { header: "Fecha", key: "timestamp", width: 10 },
      { header: "Cliente", key: "name", width: 10 },
      { header: "Referido", key: "referido_name", width: 10 },      
      { header: "Direccion", key: "street", width: 10 },
      { header: "Número", key: "streetnumber", width: 10 },
      { header: "Colonia", key: "colony", width: 10 },
      { header: "Telefono", key: "telephone", width: 10 },
      { header: "Notas", key: "notes", width: 10 },
      { header: "Recogida", key: "pickup", width: 10 },
      { header: "Notas_Recogida", key: "pickupnotes", width: 10 },
      { header: "Precio aprox.", key: "price", width: 10 },
      /* { header: "Producto", key: "content", width: 32 },
      { header: "Kilos", key: "kg", width: 10 },
      { header: "Piezas", key: "pc", width: 10 } */
    ];
    let maxProducts = 1;
    orders.forEach(function (order) {
      const products = order.content.split("\n");
      if (products.length > maxProducts) {
        maxProducts = products.length;
      }
    });

    for (let countProduct = 0; countProduct < maxProducts; countProduct++) {
      headers.push({
        header: "Producto",
        key: "product" + countProduct,
        width: 32,
      });
      headers.push({ header: "Kilos", key: "kg" + countProduct, width: 10 });
      headers.push({ header: "Piezas", key: "pc" + countProduct, width: 10 });
    }

    sheet.columns = headers;

    orders.forEach(function (order) {
      let orderProducts = order.content.split("\n");

      const rowValues = [];
      rowValues[1] = order.idorder;
      rowValues[2] = order.timestamp;
      rowValues[3] = order.name;
      rowValues[4] = order.referido_name;
      rowValues[5] = order.street;
      rowValues[6] = order.streetnumber;
      rowValues[7] = order.colony;
      rowValues[8] = order.telephone;
      rowValues[9] = order.notes;
      rowValues[10] = order.pickup;
      rowValues[11] = order.pickupnotes;
      rowValues[12] = order.price;

      let column = 13;
      for (
        let countProducts = 0;
        countProducts < orderProducts.length - 1;
        countProducts++
      ) {
        rowValues[column] = orderProducts[countProducts]
          .substring(1)
          .split("(")[0]
          .trim();
        column++;
        rowValues[column] = orderProducts[countProducts]
          .substring(1)
          .split("(")[1]
          .trim()
          .split(",")[0]
          .substring(6)
          .trim();
        column++;
        rowValues[column] = orderProducts[countProducts]
          .substring(1)
          .split(",")[1]
          .trim()
          .substring(7)
          .split(")")[0]
          .trim();
        column++;
      }

      sheet.addRow(rowValues);
    });

    let sheetKg = workbook.addWorksheet("Pedidos - Kilos");
    const headersKg = [
      { header: "Pedido", key: "idorder", width: 10 },
      { header: "Fecha", key: "timestamp", width: 10 },
      { header: "Cliente", key: "name", width: 10 },
      { header: "Referido", key: "referido_name", width: 10 },
      { header: "Direccion", key: "street", width: 10 },
      { header: "Número", key: "streetnumber", width: 10 },
      { header: "Colonia", key: "colony", width: 10 },
      { header: "Telefono", key: "telephone", width: 10 },
      { header: "Notas", key: "notes", width: 10 },
      { header: "Recogida", key: "pickup", width: 10 },
      { header: "Notas_Recogida", key: "pickupnotes", width: 10 },
      { header: "Precio aprox.", key: "price", width: 10 },
    ];

    for (let countProduct = 0; countProduct < products.length; countProduct++) {
      headersKg.push({
        header: "Producto",
        key: "product" + countProduct,
        width: 20,
      });
      headersKg.push({ header: "Kilos", key: "kg" + countProduct, width: 10 });
      headersKg.push({ header: "Piezas", key: "pc" + countProduct, width: 10 });
    }

    sheetKg.columns = headersKg;

    orders.forEach(function (order) {
      let orderProducts = order.content.split("\n");

      const rowValues = [];
      rowValues[1] = order.idorder;
      rowValues[2] = order.timestamp;
      rowValues[3] = order.name;
      rowValues[4] = order.referido_name;
      rowValues[5] = order.street;
      rowValues[6] = order.streetnumber;
      rowValues[7] = order.colony;
      rowValues[8] = order.telephone;
      rowValues[9] = order.notes;
      rowValues[10] = order.pickup;
      rowValues[11] = order.pickupnotes;
      rowValues[12] = order.price;

      let column = 13;
      products.forEach(function (product) {
        rowValues[column] = product.product;
        column++;
        let found = false;
        for (
          let countProducts = 0;
          countProducts < orderProducts.length;
          countProducts++
        ) {
          const productName = orderProducts[countProducts]
            .substring(1)
            .split("(K")[0]
            .trim();
          if (productName === product.product) {
            found = true;
            rowValues[column] = parseFloat(
              orderProducts[countProducts]
                .substring(1)
                .split("(K")[1]
                .trim()
                .split(",")[0]
                .substring(6)
                .trim()
            );
            column++;
            rowValues[column] = parseFloat(
              orderProducts[countProducts]
                .substring(1)
                .split(",")[1]
                .trim()
                .substring(7)
                .split(")")[0]
                .trim()
            );
            column++;
            break;
          }
        }
        if (!found) {
          rowValues[column] = 0;
          column++;
          rowValues[column] = 0;
          column++;
        }
      });

      sheetKg.addRow(rowValues);
    });

    workbook.xlsx.writeBuffer().then((data) => {
      FileSaver.saveAs(
        new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        excelFileName + EXCEL_EXTENSION
      );
    });
  }
}
