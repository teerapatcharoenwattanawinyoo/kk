import { colors } from './colors'

export const teamCardTheme = {
  // Container styles
  card: {
    backgroundColor: colors.teamCard.background,
    borderColor: colors.teamCard.border,
    boxShadow: `0 1px 3px 0 ${colors.teamCard.shadow}`,
    borderRadius: '0.5rem',
  },

  // Header styles
  header: {
    title: {
      color: colors.teamCard.header.title,
      fontSize: '1.125rem',
      fontWeight: '600',
    },
    subtitle: {
      color: colors.teamCard.header.subtitle,
      fontSize: '0.875rem',
    },
  },

  // Wallet styles
  wallet: {
    label: {
      color: colors.wallet.label,
      fontSize: '0.75rem',
    },
    amount: {
      color: colors.wallet.amount,
      fontWeight: '600',
      backgroundColor: colors.wallet.background,
    },
  },

  // Stats styles
  stats: {
    label: {
      color: colors.stats.label,
      fontSize: '0.875rem',
    },
    value: {
      color: colors.stats.value,
      fontWeight: '600',
    },
  },

  // Badge styles
  badge: {
    backgroundColor: colors.teamCard.badge.background,
    color: colors.teamCard.badge.text,
    borderColor: colors.teamCard.badge.border,
    text: colors.teamCard.badge.text,
  },

  // Button styles
  button: {
    primary: {
      backgroundColor: colors.button.primary,
      color: colors.button.primaryText,
      hover: {
        backgroundColor: colors.button.primaryHover,
      },
    },
  },
} as const

// Helper function to apply theme styles
export const getTeamCardStyles = () => teamCardTheme

// CSS-in-JS style helper
export const createTeamCardStyle = (element: keyof typeof teamCardTheme) => {
  return teamCardTheme[element]
}
