
#### API Examples (cURL Requests & Example Responses)

**1. Fetching a List of Surahs:**

```sh
curl -X GET "https://quranapi.pages.dev/api/surah.json" -H "Accept: application/json"
```

**Response:**

```json
[
    {
        "surahName": "Al-Faatiha",
        "surahNameArabic": "الفاتحة",
        "surahNameTranslation": "The Opening",
        "revelationPlace": "Mecca",
        "totalAyah": 7
    },
    {
        "surahName": "Al-Baqara",
        "surahNameArabic": "البقرة",
        "surahNameTranslation": "The Cow",
        "revelationPlace": "Madina",
        "totalAyah": 286
    }
]
```

**2. Fetching a Specific Ayah:**

```sh
curl -X GET "https://quranapi.pages.dev/api/1/2.json" -H "Accept: application/json"
```

**Response:**

```json
{
    "surahName": "Al-Faatiha",
    "ayahNo": 2,
    "english": "All praise is for Allah—Lord of all worlds",
    "arabic1": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
    "audio": {
        "1": {
            "reciter": "Mishary Rashid Al-Afasy",
            "url": "https://quranaudio.pages.dev/1/1_2.mp3"
        }
    }
}
```

**3. Fetching a Full Surah:**

```sh
curl -X GET "https://quranapi.pages.dev/api/112.json" -H "Accept: application/json"
```

**Response:**

```json
{
    "surahName": "Al-Ikhlaas",
    "totalAyah": 4,
    "english": [
        "Say, ˹O Prophet,˺ 'He is Allah—One'",
        "Allah—the Sustainer",
        "He has never had offspring, nor was He born.",
        "And there is none comparable to Him."
    ]
}
```

**4. Fetching Available Reciters:**

```sh
curl -X GET "https://quranapi.pages.dev/reciters.json" -H "Accept: application/json"
```

**Response:**

```json
{
    "1": "Mishary Rashid Al-Afasy",
    "2": "Abu Bakr Al-Shatri",
    "3": "Nasser Al Qatami"
}
```

**5. Fetching Audio Recitation for a Specific Ayah:**

```sh
curl -X GET "https://quranapi.pages.dev/2/1_2.mp3" -H "Accept: application/json"
```

**Response:** A direct **MP3 file** response containing the audio recitation of the requested Ayah.

**6. Fetching Audio Recitation for a Full Surah:**

```sh
curl -X GET "https://quranapi.pages.dev/api/audio/2.json" -H "Accept: application/json"
```

**Response:**

```json
{
    "1": {
        "reciter": "Mishary Rashid Al-Afasy",
        "url": "https://github.com/The-Quran-Project/Quran-Audio/raw/refs/heads/main/Data/1/2.mp3",
        "originalUrl": "https://server8.mp3quran.net/afs/002.mp3"
    }
}
```