# Habit Tracker

**IS4447 Mobile Application Development Habit Tracker**
Claire Landersr 122327886

## Deliverabes

- **GitHub Repository:** [[INSERT GITHUB URL]](https://github.com/ClaireLanders/4447122327886.git)
- **Expo Project Dashboard:** https://expo.dev/accounts/clanders/projects/4447122327886
- **Expo Update — iOS QR:** see Expo dashboard above
- **Expo Update — Android QR:** see Expo dashboard above
  

To run the app, scan the Expo QR code from the dashboard above in Expo Go on iOS or Android.

## About

A habit tracker that lets users define habits, organise them into categories, set daily, weekly, and monthly targets, log activity, and view aggregated insights. All data is stored locally via SQLite through Drizzle ORM. Each registered user sees only their own data.

### Core features

- User registration, login, logout, and profile deletion (with cascading data cleanup)
- Full CRUD for habits, categories, habit logs, and targets, each filtered per user
- Daily / weekly / monthly target progress with progress bars and status messaging
- Search and filter for habits and logs (category + text + date range)
- Insights screen with bar chart (progress vs goals) and pie chart (log distribution)
- Reusable components with accessibility labels throughout

### Advanced features

- **Streak tracking** — consecutive periods where a target goal was met, calculated in `lib/streaks.ts`
- **CSV export** — export all habit logs joined with habit and category names via the native share sheet
- **Local notifications** — daily reminder at a user-chosen time, persisted across app restart
## Setup
npm install --legacy-peer-deps
npx expo start

Expo Go required for device preview. Tested on SDK 54.

## Testing
npm test
Three test suites pass:
- Unit test (`tests/unit.test.ts`) — verifies seed function
- Component test (`tests/component.test.tsx`) — verifies `FormField`
- Integration test (`tests/integration.test.tsx`) — verifies habits list renders seeded data
