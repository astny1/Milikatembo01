import type { CollectionEntry } from 'astro:content';
import { formatRange, isUpcoming } from './dates';

export type SiteEvent = CollectionEntry<'events'>;

export function eventEnd(event: SiteEvent) {
  return event.data.endDate ?? event.data.date;
}

export function eventIsoEnd(event: SiteEvent) {
  return eventEnd(event).toISOString();
}

export function eventPhoto(event: SiteEvent) {
  return event.data.image || '/images/portrait-studio.jpg';
}

export function eventTableDate(event: SiteEvent) {
  return formatRange(event.data.date, event.data.endDate);
}

const presentingRoles = new Set([
  'Presenter',
  'Presenter and session chair',
  'Invited speaker',
]);

export function conferencePapers(events: SiteEvent[]) {
  return events.filter(
    (event) => event.data.type === 'Conference' && presentingRoles.has(event.data.role)
  );
}

export function splitConferencePapers(events: SiteEvent[]) {
  const papers = conferencePapers(events);
  const forthcoming = papers
    .filter((event) => isUpcoming(event.data.date, event.data.endDate))
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  const past = papers
    .filter((event) => !isUpcoming(event.data.date, event.data.endDate))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const featured = forthcoming.slice(0, 3);
  const all = [...forthcoming, ...past];

  return {
    papers: all,
    forthcoming,
    past,
    featured,
    hasMore: all.length > featured.length,
  };
}

export function splitEvents(events: SiteEvent[]) {
  const upcoming = events
    .filter((event) => isUpcoming(event.data.date, event.data.endDate))
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  const past = events
    .filter((event) => !isUpcoming(event.data.date, event.data.endDate))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return { upcoming, past, recentPast: past.slice(0, 3) };
}
