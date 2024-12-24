/*
*/
//load in files

function exceltodata(filename){

    let data = []

    const reader = require('xlsx')
    const file = reader.readFile(filename)

    const sheets = file.SheetNames

    for(let i = 0; i < sheets.length; i++)
    {
    const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
        data.push(res)
    })
    }

    return data
}

let amexdata = exceltodata('./amex.xlsx')
let goexdata = exceltodata('./goexpense.xlsx')

let i = 0

for (let i = 0; i < 10; i++) {
    console.log(amexdata[i])
  }
//console.log(amexdata[4])
//console.log(goexdata[0])


