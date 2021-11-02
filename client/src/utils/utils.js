
const colors = [
	"rgb(112,146,190)",
	"rgb(163,73,164)",
	"rgb(80,202,74)",
	"rgb(75,192,192)",
	"rgb(255,127, 39)",
	"rgb(136,0, 21)",
	"rgb(127,127, 127)",
	"rgb(237,28, 36)",
	"rgb(255,128, 169)",
	"rgb(255,255, 255)",
]
colors.default = "rgb(30,30,30)";

const currentDate = () => {
    const dt = new Date();
    return [dt.getFullYear(), left_zeroes(dt.getMonth() + 1 +'',2),left_zeroes(dt.getDate() +'',2)].join('-');
}

const daysInMonth = (year,month) =>  new Date(year, month+1, 0).getDate();

const dot = n => val =>{
	const i_dot = (val+'').indexOf('.');
	return (val + '').slice(0, i_dot !== -1 ? (i_dot + n + 1) : undefined );
} 

const dot2 = dot(2);

const getNameById = (id,set) => set.find(it => +it.id === +id)?.name || '';

const greater = (date1,date2,allowEqual=true) => {
    if(allowEqual)
        return +date1.replace(/-/g,'') >= +date2.replace(/-/g,'');
    return +date1.replace(/-/g,'') > +date2.replace(/-/g,'');
}

const left_zeroes = (str,len) => {
	let s = str + '';
    while (s.length < len )
        s = '0' + s;
    return s;
}

const lz2 = val => left_zeroes(val,2);

const months =['Янв','Фев','Мар','Апр','Май','Июн','Июл', 'Авг','Сен','Окт','Ноя','Дек']

const maxDate = dates => dates.sort((a,b) => greater(a,b) ? 1 : -1).pop();
const minDate = dates => dates.sort((a,b) => greater(a,b) ? -1 : 1).pop();

const nTimes = (n,fn=() => {}) => '.'.repeat(n).split('').map(fn)

const sortPurchasesAsc = set => (a,b) => getNameById(a.id_item,set) > getNameById(b.id_item,set) ? 1 : -1

const weekDays = [ 'Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

export {
	colors,
	currentDate,
	daysInMonth,
	dot2,
	getNameById,
	greater,
	left_zeroes,
	lz2,
	maxDate, 
	minDate,
	months,
	nTimes,
	sortPurchasesAsc,
	weekDays
}