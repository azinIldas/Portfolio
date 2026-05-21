import {defineType, defineField} from 'sanity'

export const currentProject = defineType({
  name: 'currentProject',
  title: 'Laufendes Projekt',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'subtitle',
      title: 'Untertitel',
      type: 'string',
      description: 'Kurzer Beschreiber, z. B. "Backend in FastAPI" oder "Live-Demo".',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: 'image',
      title: 'Projektbild',
      type: 'image',
      description: 'Vorschaubild für die Projektkarte (optional).',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tags',
      title: 'Tags / Technologien',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'z. B. "FastAPI", "Docker", "Tailwind"',
    }),
    defineField({
      name: 'video',
      title: 'Video-Link oder Dateipfad',
      type: 'string',
      description:
        'Optional. Entweder eine externe URL (YouTube, Vimeo, Loom) ODER ein relativer Pfad zu einer MP4-Datei im Portfolio, z. B. "videos/dein-video.mp4". Falls leer, wird der "Video ansehen"-Button auf der Karte ausgeblendet.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          if (/^https?:\/\//i.test(value)) return true
          if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(value)) return true
          return 'Bitte eine http(s)-URL oder einen Pfad zu einer .mp4/.webm/.ogg-Datei angeben.'
        }),
    }),
    defineField({
      name: 'github',
      title: 'GitHub-Link',
      type: 'url',
      description:
        'Optional. Link zum Quellcode auf GitHub. Falls leer, wird der "Quellcode"-Button auf der Karte ausgeblendet.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Kleinere Zahl = weiter oben. Leer lassen für automatische Sortierung nach Erstellungsdatum.',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Manuelle Reihenfolge',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: '_createdAt', direction: 'desc'},
      ],
    },
    {
      title: 'Neueste zuerst',
      name: 'createdDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
  },
})
