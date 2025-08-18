WEATHER APP

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

### Unit Tests

```bash
npm test
```

## 📱 API Endpoints

- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **Weather**: `https://api.open-meteo.com/v1/forecast`

### Recent Cities

- localStorage persistence
- Maximum 5 cities
- Click to reload weather
- Remove individual cities

### Geolocation

- Automatic detection on app load
- Fallback to Belgrade if denied
- Clear error messaging
- Permission status display

### Weather Display

- Current temperature and conditions
- 3-day hourly forecast
- Weather icons and descriptions
- Humidity information
- Timezone and coordinates

## Project Structure

```text
src/
├── app/                    # App configuration
│   ├── providers/         # React providers
│   ├── QueryClient.ts     # TanStack Query config
│   └── router.tsx         # React Router setup
├── features/weather/       # Weather feature
│   ├── api/              # API functions and types
│   ├── components/        # React components
│   └── hooks/            # Custom hooks
├── lib/                   # Utility functions
├── test/                  # Test files
│   ├── msw/              # MSW handlers
│   └── unit/             # Unit tests
└── styles/                # Global styles
```
