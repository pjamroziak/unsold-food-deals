import { Offer, SupportedApp } from '@unsold-food-deals/schemas';
import { DateTime } from 'luxon';

function getApplicationName(app: SupportedApp) {
  switch (app) {
    case SupportedApp.Foodsi:
      return 'Foodsi';
    case SupportedApp.TooGoodToGo:
      return 'TooGoodToGo';
  }
}

function getAppearOfferVarietyText(count: number, offerName: string) {
  if (count === 1) {
    return `Pojawiła się *${count}* paczka w *${offerName}*`;
  } else if (count <= 4) {
    return `Pojawiły się *${count}* paczki w *${offerName}*`;
  } else {
    return `Pojawiło się *${count}* paczek w *${offerName}*`;
  }
}

function getWeekDayName(date: string) {
  const nowWeekday = DateTime.now().weekday;
  const weekday = DateTime.fromISO(date).weekday;

  const today = nowWeekday === weekday;
  if (today) {
    return 'Dziś';
  }

  const tomorrow =
    weekday - nowWeekday === 1 || (weekday === 1 && nowWeekday === 7);
  if (tomorrow) {
    return 'Jutro';
  }

  switch (weekday) {
    case 1:
      return 'Poniedziałek';
    case 2:
      return 'Wtorek';
    case 3:
      return 'Środa';
    case 4:
      return 'Czwartek';
    case 5:
      return 'Piątek';
    case 6:
      return 'Sobota';
    case 7:
      return 'Niedziela';
    default:
      return '';
  }
}

export function parseOfferToMessage(offer: Offer): string {
  const format = 'HH:mm';

  const openedAt = DateTime.fromISO(offer.openedAt).toFormat(format);
  const closedAt = DateTime.fromISO(offer.closedAt).toFormat(format);

  const offerText = getAppearOfferVarietyText(offer.stock, offer.name);
  const weekDay = getWeekDayName(offer.openedAt);
  const applicationName = getApplicationName(offer.app);

  return `
🥡 ${offerText}
💸 *${offer.newPrice}* / ${offer.oldPrice} zł 
⌛ ${weekDay} między ${openedAt}-${closedAt}
📲 Aplikacja ${applicationName}
`;
}
