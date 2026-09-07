import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum([
      'Bibliotherapy',
      'Libraries',
      'Literature',
      'Wellbeing',
      'Research',
    ]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eventName: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string(),
    role: z.enum(['Presenter', 'Session chair', 'Presenter and session chair', 'Invited speaker', 'Participant']),
    type: z.enum(['Conference', 'Lecture', 'Workshop', 'Seminar', 'Media', 'Other']),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    link: z.string().url().optional().or(z.literal('')),
    linkLabel: z.string().optional(),
    summary: z.string(),
  }),
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    year: z.number(),
    type: z.enum(['Journal article', 'Book chapter', 'Conference abstract', 'Working paper', 'Other']),
    venue: z.string(),
    link: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().default(false),
    summary: z.string(),
  }),
});

const book = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    meta: z.string().optional(),
    order: z.number().default(1),
    summary: z.string(),
    link: z.string().optional().or(z.literal('')),
    linkLabel: z.string().optional(),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    text: z.string(),
    order: z.number().default(1),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, events, publications, book, services };
