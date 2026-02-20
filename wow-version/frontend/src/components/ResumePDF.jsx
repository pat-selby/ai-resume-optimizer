import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1e293b',
    lineHeight: 1.5,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contact: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#6366f1',
    marginHorizontal: 'auto',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 3,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subheading: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  date: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  bulletItem: {
    fontSize: 11,
    marginBottom: 3,
    paddingLeft: 12,
    color: '#475569',
  },
  bodyText: {
    fontSize: 11,
    marginBottom: 4,
    color: '#475569',
  },
})

const SECTION_HEADERS = /^(EXPERIENCE|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|OBJECTIVE|PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|PUBLICATIONS|AWARDS|LANGUAGES|INTERESTS|VOLUNTEER|PROFILE|EXPERTISE|QUALIFICATIONS|CORE COMPETENCIES|PROFESSIONAL SUMMARY)/i

export default function ResumePDF({ text }) {
  const lines = (text || '').split('\n').map(l => l.trimEnd())

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {lines.map((line, i) => {
          const trimmed = line.trim()
          if (!trimmed) return <View key={i} style={{ height: 6 }} />

          // First line = name
          if (i === 0 || (i <= 2 && !lines.slice(0, i).some(l => l.trim()))) {
            if (isFirstContent(lines, i)) {
              return <Text key={i} style={styles.name}>{trimmed}</Text>
            }
          }

          // Contact line
          if (i <= 3 && (trimmed.includes('@') || trimmed.includes('|') || trimmed.includes('linkedin'))) {
            return (
              <View key={i}>
                <Text style={styles.contact}>{trimmed}</Text>
                <View style={styles.divider} />
              </View>
            )
          }

          // Section header
          if (SECTION_HEADERS.test(trimmed)) {
            return <Text key={i} style={styles.sectionHeader}>{trimmed.toUpperCase()}</Text>
          }

          // Bullet
          if (/^[-•●▪*]\s/.test(trimmed)) {
            return <Text key={i} style={styles.bulletItem}>{'•  ' + trimmed.replace(/^[-•●▪*]\s+/, '')}</Text>
          }

          // Date line
          const dateMatch = trimmed.match(/(.+?)\s*[|–—-]\s*((?:\d{4}|Present|Current).*)$/i)
          if (dateMatch) {
            return (
              <View key={i} style={styles.subRow}>
                <Text style={styles.subheading}>{dateMatch[1].trim()}</Text>
                <Text style={styles.date}>{dateMatch[2].trim()}</Text>
              </View>
            )
          }

          return <Text key={i} style={styles.bodyText}>{trimmed}</Text>
        })}
      </Page>
    </Document>
  )
}

function isFirstContent(lines, idx) {
  for (let i = 0; i < idx; i++) {
    if (lines[i].trim()) return false
  }
  return true
}
