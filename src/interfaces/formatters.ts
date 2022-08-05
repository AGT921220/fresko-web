import { Formatter, Column, SlickGrid } from 'angular-slickgrid';

export class CustomFormatters {
    downloadPDFMovimiento: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        if(value != "NA"){
            return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Click para descargar este PDF.'><i style='font-size: 2em;' class='fa fa-download'></i></div>`;
        }else{
            return "";
        }
    };
    plusFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
       if(value == 0){
            return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Click para agregar.'><i style='font-size: 2em;' class='fa fa-plus'></i></div>`;
       }else{
        return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Click para agregar.'><i style='font-size: 2em;' class='fa fa-minus'></i></div>`;
       }
    };
    minusFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Click para agregar.'><i style='font-size: 2em;' class='fa fa-minus'></i></div>`;
    };
    viewVendedorNombreTooltip: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        console.log('Data Context', dataContext);
        return `<div style='position:absolute;left:0;right:0;margin:0 auto;' title='${dataContext.nombre_vendedor}.'>${value}</div>`;
    };
    previewPDFMovimiento: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        if(value != "NA"){
            return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Click para visualizar este PDF.'><i style='font-size: 2em;' class='fa fa-eye'></i></div>`;
        }else{
            return "";
        }
    };
    viewIdOrderWithSource: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        if(dataContext.source == null){
            return value;
        }else{
            if(value != null){
                let generada_en = "por el vendedor";
                if(dataContext.source =="WebApp"){
                    generada_en = "en el portal";
                }
                return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Orden generada ${generada_en}.'>${value}<i style='font-size: 14px;margin-left:10px;' class='fa fa-globe'></i></div>`;
            }else{
                return "";
            }
        } 
    };
    viewDetails: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Click para ver detalles.'><i style='font-size: 2em;' class='fa fa-list'></i></div>`;
    };
    viewDetailsWithExclamation: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        console.log('dataContext', dataContext);
        if(parseInt(dataContext.cantidad_negados) >= 1){
            return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;color:#aa1d1d' title='Click para ver detalles.'><i style='font-size: 2em;' class='fa fa-exclamation'></i></div>`;
        }else{
            return `<div style='position:absolute;left:0;right:0;margin:0 auto;cursor: pointer;' title='Click para ver detalles.'><i style='font-size: 2em;' class='fa fa-list'></i></div>`;
        }
    };
    moneyFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: SlickGrid) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        value = value.toString().replace(exp,rep);
        return `$${value}`;
    };

}