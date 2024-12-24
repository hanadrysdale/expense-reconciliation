/*
*/
//load in files

function exceltodata(filename, firstrow){

    let data = []

    const XLSX = require('xlsx')
    const file = XLSX.readFile(filename)
    const worksheet = file.Sheets[file.SheetNames[0]]

    let range = XLSX.utils.decode_range(worksheet['!ref']);
    range.s.r = firstrow - 1; // <-- zero-indexed, so setting to 1 will skip row 0
    worksheet['!ref'] = XLSX.utils.encode_range(range);

    const sheets = file.SheetNames

    for(let i = 0; i < 1; i++)
    {
    const temp = XLSX.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
        data.push(res)
    })
    }

    return data
}

let amexdata = exceltodata('./amex.xlsx', 7)
let goexdata = exceltodata('./goexpense.xlsx', 1)

console.log(amexdata[0])
console.log(goexdata[0])

//make new reconciliation object that pairs up expenses
//pull out the things that objects need to match on
//match the exact matches

let amexmatching = []

for (let transaction of amexdata) {
    //date
    let datejs = new Date(transaction['Date'].split("/").reverse());
    let dateex = 25569.0 + ((datejs.getTime() - (datejs.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24))

    //object
    let simpletransaction = {date: dateex, amount: transaction['Amount'], description: transaction['Description']};
    amexmatching.push(simpletransaction);
}

//console.log(amexmatching[0])

let goexmatching = []

for (let transaction of goexdata) {

    //object
    let simpletransaction = {date: transaction['Transaction Date'], amount: transaction['Local Amount'], description: transaction['Explanation Details']};
    goexmatching.push(simpletransaction);
}

//console.log(goexmatching[0])

let autorecon = []



for (let i = 0; i < amexmatching.length; i++) {
    for (let j = 0; j < goexmatching.length; j++) {
  
        if (amexmatching[i]['date'] == goexmatching[j]['date'] && amexmatching[i]['amount'] == goexmatching[j]['amount']) {
            autorecon.push({amex: amexmatching[i], goex: goexmatching[j]})
            amexmatching.splice(i, 1);
            goexmatching.splice(j, 1);
            i=i-1
            j=j-1
        }
    }
}
console.log("FULL LIST")
console.log(autorecon)