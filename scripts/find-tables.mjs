const data=await(await fetch('https://servicodados.ibge.gov.br/api/v3/agregados')).json();
for(const survey of data){const tables=survey.agregados.filter(a=>/migra|residência.*2017|residência.*5 anos|mortalidade infantil/i.test(a.nome));if(tables.length)console.log(survey.id,survey.nome,JSON.stringify(tables))}
