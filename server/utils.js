
const greater = (date1,date2,allowEqual=true) => {
    if(allowEqual)
        return +date1.replace(/-/g,'') >= +date2.replace(/-/g,'');
    return +date1.replace(/-/g,'') > +date2.replace(/-/g,'');
}

module .exports =  {
	greater,
}