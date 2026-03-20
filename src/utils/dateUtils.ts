/**
 * Получает текущую дату в формате "20 декабря 2026"
 * @returns Строка с датой в русском формате
 */
export default function getCurrentDateInRussian(): string {
  const today = new Date();
  
  const monthsInRussian = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ];
  
  const day = today.getDate();
  const month = monthsInRussian[today.getMonth()];
  const year = today.getFullYear();
  
  return `${day} ${month} ${year}`;
}
