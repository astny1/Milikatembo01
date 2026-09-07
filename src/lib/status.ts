export type Progress = 'Complete' | 'Working on' | 'Upcoming';

export interface StatusSource {
  data: {
    title: string;
    status: Progress;
    meta?: string;
    summary: string;
    link?: string;
    linkLabel?: string;
    order?: number;
  };
}

export function groupByStatus(items: StatusSource[]) {
  const sorted = [...items].sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  const toItem = (item: StatusSource) => ({
    title: item.data.title,
    meta: item.data.meta,
    text: item.data.summary,
    link: item.data.link || undefined,
    linkLabel: item.data.linkLabel,
  });

  return {
    complete: sorted.filter((item) => item.data.status === 'Complete').map(toItem),
    working: sorted.filter((item) => item.data.status === 'Working on').map(toItem),
    upcoming: sorted.filter((item) => item.data.status === 'Upcoming').map(toItem),
  };
}
